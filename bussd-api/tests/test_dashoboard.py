import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app
import os

@pytest.fixture
def mock_supabase():
    with patch('dashboard.dashboard.create_client') as mock:
        yield mock.return_value

@pytest.fixture
def test_client():
    return TestClient(app)

def test_get_routes_success(test_client, mock_supabase):
    # Mock data
    mock_data = [
        {
            "id": 1,
            "bus_route": "123",
            "user_uuid": "test-uuid",
            "percentage_travelled": 75
        }
    ]
    # Set up mock chain
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    
    mock_eq = MagicMock()
    mock_eq.execute.return_value = mock_execute
    
    mock_select = MagicMock()
    mock_select.eq.return_value = mock_eq
    
    mock_from = MagicMock()
    mock_from.select.return_value = mock_select
    
    mock_supabase.from_.return_value = mock_from

    # Make request
    response = test_client.get("/api/dashboard/routes?user_uuid=test-uuid")
    
    # Assert response
    assert response.status_code == 200
    assert response.json() == {"routes": mock_data}
    
    # Verify Supabase query chain
    mock_supabase.from_.assert_called_once_with('bus_routes_taken')
    mock_from.select.assert_called_once_with('*')
    mock_select.eq.assert_called_once_with('user_uuid', 'test-uuid')
    mock_eq.execute.assert_called_once()

def test_get_routes_no_user_uuid(test_client):
    response = test_client.get("/api/dashboard/routes")
    assert response.status_code == 422 

def test_get_routes_empty_result(test_client, mock_supabase):
    mock_execute = MagicMock()
    mock_execute.data = []
    
    mock_eq = MagicMock()
    mock_eq.execute.return_value = mock_execute
    
    mock_select = MagicMock()
    mock_select.eq.return_value = mock_eq
    
    mock_from = MagicMock()
    mock_from.select.return_value = mock_select
    
    mock_supabase.from_.return_value = mock_from

    response = test_client.get("/api/dashboard/routes?user_uuid=test-uuid")
    assert response.status_code == 200
    assert response.json() == {"routes": []}

def test_get_route_by_id_success(test_client, mock_supabase):
    # Mock data
    mock_data = [{
        "id": "123",
        "bus_route": "456",
        "stops": ["Stop A", "Stop B"]
    }]
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    mock_execute.error = None

    mock_eq = MagicMock()
    mock_eq.execute.return_value = mock_execute
    
    mock_select = MagicMock()
    mock_select.eq.return_value = mock_eq
    
    mock_from = MagicMock()
    mock_from.select.return_value = mock_select
    
    mock_supabase.from_.return_value = mock_from

    response = test_client.get("/api/dashboard/routes/123")
    assert response.status_code == 200
    assert response.json() == {"route": mock_data}

    mock_supabase.from_.assert_called_once_with('bus_routes_taken')
    mock_from.select.assert_called_once_with('*')
    mock_select.eq.assert_called_once_with('id', '123')
    mock_eq.execute.assert_called_once()