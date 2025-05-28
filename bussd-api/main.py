import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class SignUpRequest(BaseModel):
    email: str
    password: str

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get('/')
def read_root():
    return {"message": "Hello, world!"}

@app.get('/auth/session')
def get_session():
    session = supabase.auth.get_session()

    if session and session.get("access_token"):
        return {"session": session}
    else:
        return {"session": None}

@app.get('/supabase/test')
def test_supabase():
    data = supabase.table('test_table').select('*').execute()
    return {"data": data.data}


@app.post('/supabase/auth/signup')
async def signup_user(request: SignUpRequest):
    try:
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        if response.user:
            return {"message": "User signed up successfully", "user": response.user}
        else:
            return {"error": "Failed to create user"}
    except Exception as e:
        return {"error": str(e)}