# software-engineering-challenge

This is a technical challenge/test project with an Angular + NgRx frontend and a Java + Spring Boot + Gradle backend.

## Structure

- `frontend/`: Angular (standalone components) + NgRx (store, effects, store-devtools).
- `backend/`: Spring Boot + Java + Gradle.

## Requirements

- Node.js >= 22.22 (recommended to manage with [nvm](https://github.com/nvm-sh/nvm))
- JDK 25

## How to run the backend

```bash
cd backend
./gradlew bootRun
```

Available at http://localhost:8080

## How to run the frontend

```bash
cd frontend
npm install
npm start
```

Available at http://localhost:4200