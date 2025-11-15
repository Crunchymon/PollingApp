API Contracts:

Standard Headers & Error Responses
These are the common responses that can apply to many of your endpoints.
Standard Request Headers
Content-Type: application/json
Required on: All POST requests that send a JSON body.
Authorization: Bearer <jwt_token>
Required on: All "Authenticated" endpoints.
Standard Error Responses
400 Bad Request (Zod Validation Error)
Description: Sent when the request body, URL parameters, or query parameters fail validation.
Response Body:
JSON
{
  "errors": [
    {
      "path": ["fieldName"],
      "message": "Specific error message from Zod"
    }
  ]
}




401 Unauthorized
Description: Sent if the JWT is missing, invalid, or expired.
Response Body: { "message": "Token is not valid." }
500 Internal Server Error
Description: A catch-all for any unexpected server failure (e.g., database connection lost).
Response Body: { "message": "An internal server error occurred." }

1. Auth Resource (/api/auth)
POST /api/auth/signup
Access: Public
Request:
Headers: Content-Type: application/json
Body:
JSON
{
  "name": "Suryansh Chattree",
  "email": "suryansh@example.com",
  "password": "a-strong-password-123"
}




Responses:
201 Created (Success):
JSON
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Suryansh Chattree", "email": "suryansh@example.com", "avatarUrl": null }
}




400 Bad Request: (Standard Zod Error, e.g., password too short)
409 Conflict: { "message": "A user with this email address already exists." }
500 Internal Server Error: (Standard Server Error)
POST /api/auth/login
Access: Public
Request:
Headers: Content-Type: application/json
Body:
JSON
{
  "email": "suryansh@example.com",
  "password": "a-strong-password-123"
}




Responses:
200 OK (Success):
JSON
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Suryansh Chattree", "email": "suryansh@example.com", "avatarUrl": null }
}




400 Bad Request: (Standard Zod Error, e.g., invalid email format)
401 Unauthorized: { "message": "Invalid email or password." }
500 Internal Server Error: (Standard Server Error)

2. Users Resource (/api/users)
GET /api/users/me
Access: Authenticated
Request:
Headers: Authorization: Bearer <jwt_token>
Responses:
200 OK (Success):
JSON
{
  "id": 1,
  "name": "Suryansh Chattree",
  "email": "suryansh@example.com",
  "avatarUrl": null
}




401 Unauthorized: (Standard Auth Error)
404 Not Found: { "message": "User not found." } (e.g., if user was deleted but token is still valid)
500 Internal Server Error: (Standard Server Error)

3. Polls Resource (/api/polls)
POST /api/polls
Access: Authenticated
Request:
Headers: Content-Type: application/json, Authorization: Bearer <jwt_token>
Body:
JSON
{
  "question": "What tech stack should we use?",
  "options": ["MERN", "PERN", "T3 Stack"]
}




Responses:
201 Created (Success): (Returns the full poll object, as it's needed for an immediate redirect)
JSON
{
  "id": 42,
  "question": "What tech stack should we use?",
  "author": { "id": 1, "name": "Suryansh Chattree", "avatarUrl": null },
  "options": [
    { "id": 101, "text": "MERN", "votes": 0, "voters": [] },
    { "id": 102, "text": "PERN", "votes": 0, "voters": [] },
    { "id": 103, "text": "T3 Stack", "votes": 0, "voters": [] }
  ]
}




400 Bad Request: (Standard Zod Error, e.g., "Must provide at least two options")
401 Unauthorized: (Standard Auth Error)
500 Internal Server Error: (Standard Server Error)
GET /api/polls
Returns a paginated list of polls.
Access: Authenticated
Request:
Headers: Authorization: Bearer <jwt_token>
Query Params:
?search=... (string, optional)
?sortBy=createdAt&order=desc (optional)
?page=1&limit=10 (optional)
Responses:
200 OK (Success):
JSON
{
  "data": [
    {
      "id": 1,
      "question": "What tech stack should we use?",
      "author": {
        "id": 1,
        "name": "John Doe",
        "avatarUrl": null
      },
      "options": [
        {
          "id": 1,
          "text": "MERN",
          "votes": 0,
          "voters": []
        },
        {
          "id": 2,
          "text": "PERN",
          "votes": 0,
          "voters": []
        },
        {
          "id": 3,
          "text": "T3 Stack",
          "votes": 0,
          "voters": []
        }
      ]
    }
  ],
  "meta": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}




400 Bad Request: (Standard Zod Error, e.g., if page is not a number)
401 Unauthorized: (Standard Auth Error)
500 Internal Server Error: (Standard Server Error)


GET /api/polls/:id
Access: Public
Request:
Headers: None
Responses:
200 OK (Success): (Returns the full poll object with all voter details)
JSON
{
  "id": 42,
  "question": "What tech stack should we use?",
  "author": { "id": 1, "name": "Suryansh", "avatarUrl": null },
  "options": [
    {
      "id": 101,
      "text": "MERN",
      "votes": 1,
      "voters": [ { "user": { "id": 2, "name": "Jane Doe", "avatarUrl": null } } ]
    },
    { "id": 102, "text": "PERN", "votes": 0, "voters": [] }
  ]
}




404 Not Found: { "message": "Poll not found." }
500 Internal Server Error: (Standard Server Error)
DELETE /api/polls/:id
Access: Authenticated (Owner Only)
Request:
Headers: Authorization: Bearer <jwt_token>
Responses:
204 No Content (Success): (Returns an empty body)
401 Unauthorized: (Standard Auth Error)
403 Forbidden: { "message": "You are not authorized to delete this poll." }
404 Not Found: { "message": "Poll not found." }
500 Internal Server Error: (Standard Server Error)

4. Votes Resource (/api/votes)
(Using the cleaner /api/votes resource we discussed)
POST /api/votes
Access: Authenticated
Request:
Headers: Content-Type: application/json, Authorization: Bearer <jwt_token>
Body:
JSON
{
  "pollId": 42,
  "optionId": 101
}




Responses:
201 Created (Success): (Returns the full updated poll, so the UI can refresh)
JSON
{
  "id": 42,
  "question": "What tech stack should we use?",
  "author": { ... },
  "options": [
    { "id": 101, "text": "MERN", "votes": 1, "voters": [...] },
    { "id": 102, "text": "PERN", "votes": 0, "voters": [] }
  ]
}




400 Bad Request: (Standard Zod Error, e.g., missing pollId)
401 Unauthorized: (Standard Auth Error)
409 Conflict: { "message": "You have already voted on this poll." }
500 Internal Server Error: (Standard Server Error)
DELETE /api/votes/poll/:pollId
Description: Retracts the current user's vote from a specific poll.
Access: Authenticated
Request:
Headers: Authorization: Bearer <jwt_token>
Responses:
200 OK (Success): (Returns the full updated poll, so the UI can refresh)
JSON
{
  "id": 42,
  "question": "What tech stack should we use?",
  "author": { ... },
  "options": [
    { "id": 101, "text": "MERN", "votes": 0, "voters": [] },
    { "id": 102, "text": "PERN", "votes": 0, "voters": [] }
  ]
}




400 Bad Request: (Standard Zod Error, e.g., invalid pollId)
401 Unauthorized: (Standard Auth Error)
4404 Not Found: { "message": "You have not cast a vote on this poll." }
5D00 Internal Server Error: (Standard Server Error)
