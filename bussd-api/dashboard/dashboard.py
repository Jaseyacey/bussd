import os
from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

@app.get('/routes')
async def get_routes(user_uuid: str):
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(user_uuid)
    try:
        routes = supabase.from_('bus_routes_taken').select('*').eq('user_uuid', user_uuid).execute()
        return {"routes": routes.data}
    except Exception as e:
        return {"error": str(e), 'message': 'Error fetching routes'}


@app.get('/routes/{route_id}')
async def get_route(route_id: str):
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    route = supabase.from_('bus_routes_taken').select('*').eq('id', route_id).execute()
    if route.error:
        return {"error": route.error}
    return {"route": route.data}
