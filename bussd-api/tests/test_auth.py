import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

def test_signup_success(test_client, mock_supabase):
    # Mock the successful signup response
    mock_user = {
        "id": "test-user-id",
        "email": "test@example.com",
        "aud": "authenticated",
        "app_metadata": {"provider": "email", "providers": ["email"]},
        "user_metadata": {
            "email": "test@example.com",
            "email_verified": True,
            "phone_verified": False
        }
    }
    mock_supabase.auth.sign_up.return_value = MagicMock(user=mock_user)

    response = test_client.post(
        "/supabase/auth/signup",
        json={"email": "test@example.com", "password": "TestPassword123!"}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "User signed up successfully"
    assert response.json()["user"]["id"] == mock_user["id"]
    assert response.json()["user"]["email"] == mock_user["email"]
    assert response.json()["user"]["aud"] == mock_user["aud"]

def test_signup_failure(test_client, mock_supabase):
    # Mock a failed signup
    mock_supabase.auth.sign_up.side_effect = Exception("Signup failed")

    response = test_client.post(
        "/supabase/auth/signup",
        json={"email": "test@example.com", "password": "TestPassword123!"}
    )

    assert response.status_code == 200  # FastAPI returns 200 even for handled errors
    assert "error" in response.json()

def test_signin_success(test_client, mock_supabase):
    # Mock the successful signin response
    mock_user = {
        "id": "test-user-id",
        "email": "test@example.com",
        "aud": "authenticated",
        "app_metadata": {"provider": "email", "providers": ["email"]},
        "user_metadata": {
            "email": "test@example.com",
            "email_verified": True,
            "phone_verified": False
        }
    }
    mock_supabase.auth.sign_in_with_password.return_value = MagicMock(user=mock_user)

    response = test_client.post(
        "/supabase/auth/signin",
        json={"email": "test@example.com", "password": "TestPassword123!"}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "User signed in successfully"
    assert response.json()["user"]["id"] == mock_user["id"]
    assert response.json()["user"]["email"] == mock_user["email"]
    assert response.json()["user"]["aud"] == mock_user["aud"]

def test_signin_failure(test_client, mock_supabase):
    # Mock a failed signin
    mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid credentials")

    response = test_client.post(
        "/supabase/auth/signin",
        json={"email": "test@example.com", "password": "WrongPassword123!"}
    )

    assert response.status_code == 200
    assert "error" in response.json()

def test_signout_success(test_client, mock_supabase):
    response = test_client.post("/supabase/auth/signout")
    
    assert response.status_code == 200
    assert response.json()["message"] == "User signed out successfully"
    mock_supabase.auth.sign_out.assert_called_once()

def test_get_session_authenticated(test_client, mock_supabase):
    # Mock an authenticated session
    mock_user = MagicMock(
        email="test@example.com",
        id="test-user-id",
        aud="authenticated"
    )
    mock_session = MagicMock(user=mock_user)
    mock_supabase.auth.get_session.return_value = mock_session

    response = test_client.get("/auth/session")

    assert response.status_code == 200
    assert response.json()["isLoggedIn"] == True
    assert response.json()["session"]["user"]["email"] == "test@example.com"

def test_get_session_unauthenticated(test_client, mock_supabase):
    # Mock an unauthenticated session
    mock_supabase.auth.get_session.return_value = None

    response = test_client.get("/auth/session")

    assert response.status_code == 200
    assert response.json()["isLoggedIn"] == False
    assert response.json()["session"] is None 