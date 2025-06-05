# BUSSD API

This is the backend API for the BUSSD application, built with FastAPI and Supabase. The API provides endpoints for tracking bus stops and routes in London.

## Prerequisites

- Python 3.11 or higher
- pip (Python package installer)
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bussd-api
```

2. Create and activate a virtual environment:
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## Running the API

Start the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API documentation (Swagger UI): `http://127.0.0.1:8000/docs`
- Alternative API documentation (ReDoc): `http://127.0.0.1:8000/redoc`

### Available Endpoints

- `GET /`: Health check endpoint
- `GET /supabase/test`: Test Supabase connection and fetch data

## Project Structure

```
bussd-api/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── supabase/           # Supabase related code
│   └── supabase_client.py  # Supabase client configuration
└── .env                # Environment variables (not in version control)
```

## Development

### Adding New Dependencies

If you need to add new dependencies to the project:

1. Install the package:
```bash
pip install package_name
```

2. Update requirements.txt:
```bash
pip freeze > requirements.txt
```

### Environment Variables

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous key

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 