import pytest
from fastapi.testclient import TestClient
from main import app
import os
from unittest.mock import MagicMock, patch

@pytest.fixture(autouse=True)
def mock_env_vars(monkeypatch):
    """Fixture to set mock environment variables for all tests"""
    monkeypatch.setenv("SUPABASE_URL", "https://test-url.supabase.co")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "test-key")

@pytest.fixture
def mock_supabase():
    """Mock Supabase client"""
    mock_client = MagicMock()
    
    # Mock auth methods
    mock_client.auth = MagicMock()
    mock_client.auth.sign_up = MagicMock()
    mock_client.auth.sign_in_with_password = MagicMock()
    mock_client.auth.sign_out = MagicMock()
    mock_client.auth.get_session = MagicMock()
    
    # Mock table methods
    mock_table = MagicMock()
    mock_select = MagicMock()
    mock_execute = MagicMock()
    mock_table.select.return_value = mock_select
    mock_select.execute.return_value = mock_execute
    mock_client.table.return_value = mock_table
    
    with patch('main.create_client', return_value=mock_client), \
         patch('main.supabase', mock_client):
        yield mock_client

@pytest.fixture
def test_client(mock_supabase):
    """Test client fixture"""
    with TestClient(app) as client:
        yield client

@pytest.fixture
def test_client_no_supabase(monkeypatch):
    original_url = os.environ.get('SUPABASE_URL')
    original_key = os.environ.get('SUPABASE_ANON_KEY')
    
    # Clear environment variables
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_ANON_KEY", raising=False)
    
    # Mock Supabase client as None
    with patch('main.supabase', None), \
         patch('main.create_client', return_value=None), \
         patch('main.SUPABASE_URL', None), \
         patch('main.SUPABASE_KEY', None), \
         TestClient(app) as client:
        yield client
    
    if original_url:
        monkeypatch.setenv('SUPABASE_URL', original_url)
    if original_key:
        monkeypatch.setenv('SUPABASE_ANON_KEY', original_key) 