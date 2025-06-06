import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app
import os

def test_read_root(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, world!"}

def test_supabase_test_success(test_client, mock_supabase):
    # Mock successful data retrieval
    mock_data = [{"id": 1, "name": "Test"}]
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    mock_supabase.table().select().execute.return_value = mock_execute

    response = test_client.get("/supabase/test")
    
    assert response.status_code == 200
    assert response.json() == {"data": mock_data}

def test_supabase_test_failure(test_client, mock_supabase):
    # Mock database error
    mock_supabase.table().select().execute.side_effect = Exception("Database error")

    response = test_client.get("/supabase/test")
    
    assert response.status_code == 200  # FastAPI returns 200 even for handled errors
    assert "error" in response.json()

@pytest.fixture
def clear_env_vars(monkeypatch):
    # Save original environment variables
    original_url = os.environ.get('SUPABASE_URL')
    original_key = os.environ.get('SUPABASE_ANON_KEY')
    
    # Clear environment variables
    monkeypatch.delenv('SUPABASE_URL', raising=False)
    monkeypatch.delenv('SUPABASE_ANON_KEY', raising=False)
    
    yield
    
    # Restore original environment variables if they existed
    if original_url:
        monkeypatch.setenv('SUPABASE_URL', original_url)
    if original_key:
        monkeypatch.setenv('SUPABASE_ANON_KEY', original_key)
