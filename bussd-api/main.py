import os
from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


@app.get('/supabase/test')
def test_supabase():
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"error": "Supabase credentials not found in environment variables"}
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Example query to fetch data from a table named 'test_table'
        data = supabase.table('test_table').select('*').execute()
        
        return {"data": data.data}
    except Exception as e:
        return {"error": str(e)}

