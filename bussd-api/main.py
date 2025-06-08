import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
from dashboard.dashboard import app as dashboard_app

load_dotenv()

class SignUpRequest(BaseModel):
    email: str
    password: str

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Mount the dashboard routes
app.mount("/api/dashboard", dashboard_app)

# Only create Supabase client if credentials are available
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to create Supabase client: {e}")

def check_supabase_credentials():
    """Check if Supabase credentials are available"""
    if not SUPABASE_URL or not SUPABASE_KEY or not supabase:
        return {"error": "Supabase credentials not found in environment variables"}
    return None

@app.get('/')
def read_root():
    return {"message": "Hello, world!"}

@app.get('/auth/session')
def get_session():
    error = check_supabase_credentials()
    if error:
        return error
    
    session = supabase.auth.get_session()
    if not session:
        return {"isLoggedIn": False, "session": None}
    user = session.user if hasattr(session, 'user') else None
    return {
        "isLoggedIn": bool(user),
        "session": {
            "user": {
                "email": user.email if user else None,
                "id": user.id if user else None
            }
        } if user else None
    }

@app.get('/supabase/test')
def test_supabase():
    error = check_supabase_credentials()
    if error:
        return error
    
    try:
        data = supabase.table('test_table').select('*').execute()
        return {"data": data.data}
    except Exception as e:
        return {"error": str(e)}

@app.post('/supabase/auth/signup')
async def signup_user(request: SignUpRequest):
    error = check_supabase_credentials()
    if error:
        return error
    
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
    error = check_supabase_credentials()
    if error:
        return error
    
    print("Attempting to sign in:", request.email)
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        print("Sign in response:", response)
        if response.user:
            return {"message": "User signed in successfully", "user": response.user}
        else:
            return {"error": "Failed to sign in user"}
    except Exception as e:
        print("Sign in error:", str(e))
        return {"error": str(e)}

@app.post('/supabase/auth/signout')
async def signout_user():
    error = check_supabase_credentials()
    if error:
        return error
    
    supabase.auth.sign_out()
    return {"message": "User signed out successfully"}