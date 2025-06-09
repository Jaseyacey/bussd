import os
import logging
from typing import Optional
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from supabase import create_client, Client

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
async def add_bus_route(bus_route: str, percentage: int, user_uuid: str, started_stop: str, ended_stop: str):
    require_supabase()

    try:
        response = supabase.table("bus_routes_taken").insert({
            "bus_route": bus_route,
            "percentage_travelled": percentage,
            "started_stop": started_stop,
            "ended_stop": ended_stop,
            "user_uuid": user_uuid,
            "bus_route_taken": True
        }).execute()

        return {"message": "Bus route added", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert into Supabase: {e}")
