import os
import logging
from typing import Optional, List
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from pydantic import BaseModel, Field

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
TFL_URL = os.getenv("TFL_URL", "https://api.tfl.gov.uk")
TFL_API_KEY = os.getenv("TFL_API_KEY", "")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")

app = FastAPI()


def require_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY or not supabase:
        raise HTTPException(status_code=500, detail="Supabase credentials not properly set.")


async def fetch_tfl(url: str):
    headers = {"app_key": TFL_API_KEY}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/stops")
async def get_stops(route_id: str = Query(...), direction: str = Query(...)):
    url = f"{TFL_URL}/Line/{route_id}/Route/Sequence/{direction}"
    data = await fetch_tfl(url)

    sequences = data.get("stopPointSequences", [])
    if not sequences:
        raise HTTPException(status_code=404, detail="No stop sequences found.")

    stops = sequences[0].get("stopPoint", [])
    return {
        "route_id": route_id,
        "direction": direction,
        "stop_count": len(stops),
        "stops": stops
    }


@app.get("/stops/{stop_id}")
async def get_stop(stop_id: str):
    url = f"{TFL_URL}/StopPoint/{stop_id}"
    return await fetch_tfl(url)


@app.get("/stops-between")
async def stops_between(route_id: str, from_stop_id: str, to_stop_id: str, direction: str = "outbound"):
    url = f"{TFL_URL}/Line/{route_id}/Route/Sequence/{direction}"
    data = await fetch_tfl(url)

    sequences = data.get("stopPointSequences", [])
    if not sequences:
        raise HTTPException(status_code=404, detail="No stop sequences found.")

    stops = sequences[0].get("stopPoint", [])
    stop_ids = [stop["id"] for stop in stops]

    try:
        fromStop = stop_ids.index(from_stop_id)
        toStop = stop_ids.index(to_stop_id)
        between = stop_ids[min(fromStop, toStop)+1:max(fromStop, toStop)]
        return {
            "count": abs(toStop - fromStop),
            "from_index": fromStop,
            "to_index": toStop,
            "stop_ids_between": between,
            "all_stop_ids": stop_ids
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="One or both stop IDs not found on this route.")


@app.post("/add-bus-route")
async def add_bus_route(
    bus_route: str, 
    percentage: int, 
    user_uuid: str, 
    started_stop: str, 
    ended_stop: str,
    user_email: str
):
    require_supabase()

    try:
        response = supabase.table("bus_routes_taken").insert({
            "bus_route": bus_route,
            "percentage_travelled": percentage,
            "started_stop": started_stop,
            "ended_stop": ended_stop,
            "user_uuid": user_uuid,
            "user_email": user_email,
            "bus_route_taken": True
        }).execute()

        return {"message": "Bus route added", "data": response.data}
    except Exception as e:
        logging.error(f"Error adding route: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to insert into Supabase: {e}")

class UpdateBusRoutePayload(BaseModel):
    user_email: str
    bus_route: str
    percentage: str = Field(alias="percentage_travelled", alias_priority=2)
    started_stop: Optional[str] = None
    ended_stop: Optional[str] = None
    user_uuid: str

    class Config:
        # This allows the model to populate a "percentage_travelled" field from a "percentage" input
        fields = {
            'percentage': 'percentage_travelled'
        }

@app.post("/update-bus-route/{route_id}")
async def update_bus_route(route_id: int, payload: UpdateBusRoutePayload):
    require_supabase()

    try:
        # Convert the payload to dict and rename percentage to percentage_travelled
        update_data = {
            "percentage_travelled": payload.percentage,
            "started_stop": payload.started_stop,
            "ended_stop": payload.ended_stop
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}

        # First verify the route exists and belongs to the user
        verify_response = (
            supabase.table("bus_routes_taken")
            .select("*")
            .eq("id", route_id)
            .eq("user_uuid", payload.user_uuid)
            .execute()
        )

        if not verify_response.data:
            raise HTTPException(status_code=404, detail=f"No route found with id {route_id} for this user")

        # Then update it
        try:
            response = (
                supabase.table("bus_routes_taken")
                .update(update_data)
                .eq("id", route_id)
                .eq("user_uuid", payload.user_uuid)
                .execute()
            )
        except Exception as update_error:
            logging.error(f"Supabase update error: {str(update_error)}")
            raise HTTPException(status_code=400, detail=f"Failed to update route: {str(update_error)}")

        # Let's fetch the updated record to return it
        updated_record = (
            supabase.table("bus_routes_taken")
            .select("*")
            .eq("id", route_id)
            .eq("user_uuid", payload.user_uuid)
            .execute()
        )

        if not updated_record.data:
            raise HTTPException(status_code=404, detail=f"Could not verify update for route {route_id}")

        return {"message": "Bus route updated", "data": updated_record.data}
    except Exception as e:
        logging.error(f"Error updating route: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update Supabase: {e}")
    
@app.delete('/delete-bus-route/{bus_route_id}')
async def delete_bus_route(bus_route_id: int):
    require_supabase()

    try:
        response = supabase.table("bus_routes_taken").delete().eq("id", bus_route_id).execute()
        return {"message": "Bus route deleted", "data": response.data}
    except Exception as e:
        logging.error(f"Error deleting route: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete route: {e}")