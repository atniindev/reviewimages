# How to Build and Run
Two `.env.example` files are included: one in the root directory and another inside the `/frontend` folder.
To get started, create `.env` files based on these examples. For a quick setup, you can simply rename the `.env.example` files to `.env`.

Once the `.env` files are in place, start the project with:
`docker compose up`

If you rename the `.env.example` files to `.env`, you can access:  
- Frontend UI: [http://localhost:3000](http://localhost:3000)  
- API: [http://localhost:8000](http://localhost:8000)

**Note:** An additional endpoint was added for testing: [http://localhost:8000/api/images/confirmed](http://localhost:8000/api/images/confirmed)  
This endpoint allows you to easily track the progress after confirming/correcting labels.

For development mode, start the project with:
`docker compose -f docker-compose.dev.yml up`

# Technical choices and assumptions
## Backend
- FastAPI was chosen for its simplicity, speed, and modern async support.
- Uvicorn is used as the server, with the `--reload` option in development mode to enable auto-reloading whenever backend code changes, allowing faster iteration and easier development.
## Frontend 
- React with Vite was used for fast development and hot module replacement. 
- Nginx is used to serve the production build of the frontend for simplicity and performance.
## Database 
PostgreSQL was selected for its reliability, ACID compliance, and good support with SQLAlchemy.
## ORM 
SQLAlchemy was used in the backend for database access because of its flexibility and support for complex queries.
## Environment Variables
`.env` files are used to keep sensitive information out of source code and allow easy configuration for different environments.
## Assumptions
- The project is designed to be simple, elegant, and easy to implement within a few hours of coding. To achieve this, over-engineering was avoided, so if the project grows in the future, certain aspects such as the folder structure may need to be adjusted.
- The project assumes all services (frontend, backend, database) run in a single Docker Compose network. Service names (e.g., `backend`) are used for inter-container communication.
- Environment variables in `.env` are correctly set and available to both backend and frontend containers.
- In production, the frontend container maps port `80` internally; the host port can be configured via `FRONTEND_PORT` in the `.env`.
- For local testing, it's assumed that the user has Docker and Docker Compose installed and running on their machine.

# Possible Improvements
If I had another week to work on this project, I would focus on improving usability and maintainability. Possible improvements within a week include:
- User authentication and authorization
- Add fields to database table like `created_at`, `last_updated`, `deleted_at`, `created_by`, and `last_modified_by` to better track data changes and support auditing 
- Refine the interface and make it responsive for smaller screens.  
- Implement automated testing starting with backend unit tests, and integrate them into a CI/CD pipeline for continuous validation and reliability.

- Structured logging and monitoring. Add centralized logs and monitoring tools for backend services to track performance and errors.

