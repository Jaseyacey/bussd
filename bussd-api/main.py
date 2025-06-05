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
    if not session:
        return {"isLoggedIn": False, "session": None}
    user = session.user if hasattr(session, 'user') else None
    return {
        "isLoggedIn": bool(user),
        "session": {
            "user": {
                "email": user.email if user else None
            }
        } if user else None
    }

@app.get('/supabase/test')
def test_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"error": "Supabase credentials not found in environment variables"}
    
    try:
        data = supabase.table('test_table').select('*').execute()
        return {"data": data.data}
    except Exception as e:
        return {"error": str(e)}

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
    
@app.post('/supabase/auth/signin')
async def signin_user(request: SignUpRequest):
    print(request.email)
    try:
        response = supabase.auth.sign_in({
            "email": request.email,
            "password": request.password
        })
        if response.user:
            return {"message": "User signed in successfully", "user": response.user}
        else:
            return {"error": "Failed to sign in user"}
    except Exception as e:
        return {"error": str(e)}
