# Node.js CRUD API with In-Memory DB and Load Balancing

## Introduction

This repository houses a Node.js project focused on delivering a CRUD API. It utilizes an in-memory database to manage data and leverages Node.js clustering to achieve load balancing. The primary objective is to demonstrate the ability to perform Create, Read, Update, and Delete operations, while efficiently handling multiple server instances for better performance and reliability.

## Setup Guide

### Steps to Install

1. **Clone the Project**: 
   ```bash
   git clone https://github.com/IrinaPeshko/CRUD-API.git

2. **Navigate to the Project Directory**:
    ```bash
    cd crud-api-nodejs

3. **Install Dependencies**: 
   ```bash
   npm install
   
4. **Set Environment Variables**: 
   ```bash
   PORT=3000 

5. #### Start the Server

##### For development:
    npm run start:dev

##### For production:
    npm run start:prod

6. **Running Tests**: 
Execute the following command to run predefined test scenarios:
   ```bash
   npm test

## API Documentation

### Endpoints

- `GET /api/users`: Fetch all users.
- `GET /api/users/{userId}`: Fetch a single user by ID.
- `POST /api/users`: Create a new user.
- `PUT /api/users/{userId}`: Update an existing user.
- `DELETE /api/users/{userId}`: Delete a user.

### User Model

- `id`: UUID, auto-generated.
- `username`: String, required.
- `age`: Number, required.
- `hobbies`: Array of strings.

### Error Handling

- 400: Bad Request (Invalid input, e.g., non-UUID userId)
- 404: Not Found (User not found)
- 500: Internal Server Error

## Contribution

Contributions are welcome. Please follow the standard fork-and-pull request workflow.
 

