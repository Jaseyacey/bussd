import pytest
from httpx import AsyncClient
from fastapi import status
from main import app

@pytest.mark.asyncio
async def test_get_stops_success(mocker):
    mock_data = {
        "stopPointSequences": [
            {
                "stopPoint": [
                    {"id": "stop1", "name": "Stop 1"},
                    {"id": "stop2", "name": "Stop 2"},
                ]
            }
        ]
    }

    mocker.patch("main.fetch_tfl", return_value=mock_data)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/stops", params={"route_id": "88", "direction": "outbound"})
    assert response.status_code == 200
    assert response.json()["stop_count"] == 2

@pytest.mark.asyncio
async def test_get_stops_no_sequence(mocker):
    mocker.patch("main.fetch_tfl", return_value={"stopPointSequences": []})

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/stops", params={"route_id": "88", "direction": "inbound"})
    assert response.status_code == 404
    assert "No stop sequences found" in response.text


@pytest.mark.asyncio
async def test_get_stop_success(mocker):
    mocker.patch("main.fetch_tfl", return_value={"id": "stop123", "name": "Stop 123"})

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/stops/stop123")
    assert response.status_code == 200
    assert response.json()["id"] == "stop123"

@pytest.mark.asyncio
async def test_stops_between_success(mocker):
    mock_data = {
        "stopPointSequences": [
            {
                "stopPoint": [{"id": "a"}, {"id": "b"}, {"id": "c"}, {"id": "d"}]
            }
        ]
    }

    mocker.patch("main.fetch_tfl", return_value=mock_data)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/stops-between", params={
            "route_id": "88",
            "from_stop_id": "a",
            "to_stop_id": "d",
            "direction": "outbound"
        })

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3
    assert data["stop_ids_between"] == ["b", "c"]

@pytest.mark.asyncio
async def test_stops_between_invalid_stop(mocker):
    mock_data = {
        "stopPointSequences": [
            {
                "stopPoint": [{"id": "x"}, {"id": "y"}]
            }
        ]
    }

    mocker.patch("main.fetch_tfl", return_value=mock_data)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/stops-between", params={
            "route_id": "88",
            "from_stop_id": "a",
            "to_stop_id": "z"
        })
    assert response.status_code == 400
    assert "not found" in response.text


@pytest.mark.asyncio
async def test_add_bus_route_success(mocker):
    # Mock supabase and env check
    mock_supabase = mocker.Mock()
    mocker.patch("main.require_supabase", return_value=None)
    mock_response = mocker.Mock()
    mock_response.data = {"id": 1}
    mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_response
    mocker.patch("main.supabase", mock_supabase)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-bus-route", params={
            "bus_route": "88",
            "percentage": 80,
            "user_uuid": "user-abc"
        })

    assert response.status_code == 200
    assert response.json()["message"] == "Bus route added"
