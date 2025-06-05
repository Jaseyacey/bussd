import os
from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

app.get('/auth/session')
def get_session():
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Fetch the current session
    session = supabase.auth.get_session()
    
    return {"session": session.data}
