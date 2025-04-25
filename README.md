# CMCA Quiz API

A RESTful API for managing multiple-choice quiz questions aligned with the Community Association Manager (CMCA®) certification domains. Built with Express and MongoDB (Mongoose).

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Usage Examples](#usage-examples)
8. [Testing with Postman](#testing-with-postman)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- CRUD operations for quiz questions
- Questions categorized by CMCA® exam domains:
  - Governance
  - Financial Management
  - Operations
  - Communications
  - Human Resources
  - Risk Management
- Schema validation with Mongoose (including enum and custom validators)
- Environment configuration via `.env`
- Ready for deployment on DigitalOcean (Docker, PM2, Nginx/SSL)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or newer
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- Optional: [nodemon](https://www.npmjs.com/package/nodemon) for development

---

## Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/YourRepoName.git
cd YourRepoName

# Install dependencies
npm install
``` 

---

## Configuration

1. Create a `.env` file in the project root:
   ```dotenv
   MONGO_URI="mongodb+srv://cmiller:<password>@cmcaquestions.uisgots.mongodb.net/quizdb?retryWrites=true&w=majority&appName=CMCAQuestions"
   PORT=3000
   ```
2. Add `.env` to your `.gitignore`:
   ```gitignore
   node_modules/
   .env
   ```

---

## Running the Application

- **Development** (with auto-reload via nodemon):
  ```bash
  npm run dev
  ```

- **Production**:
  ```bash
  npm start
  ```

The server will start at `http://localhost:<PORT>` (default: 3000).

---

## API Endpoints

| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| GET    | `/`                  | Health check                      |
| POST   | `/questions`         | Create a new question             |
| GET    | `/questions`         | Retrieve all questions (optional filter by `?subject=`) |
| GET    | `/questions/:id`     | Retrieve a single question by ID  |
| PUT    | `/questions/:id`     | Update an existing question by ID |
| DELETE | `/questions/:id`     | Delete a question by ID           |

---

## Usage Examples

- **Create a question**:
  ```bash
  curl -X POST http://localhost:3000/questions \
    -H "Content-Type: application/json" \
    -d '{
      "subject":"Governance",
      "text":"What is quorum?",
      "choices":["A","B","C","D"],
      "answerIndex":2,
      "explanation":"Minimum number of members required to conduct business."
    }'
  ```

- **List all questions**:
  ```bash
  curl http://localhost:3000/questions
  ```

- **Filter by subject**:
  ```bash
  curl http://localhost:3000/questions?subject=Operations
  ```

- **Get one question**:
  ```bash
  curl http://localhost:3000/questions/<QUESTION_ID>
  ```

- **Update a question**:
  ```bash
  curl -X PUT http://localhost:3000/questions/<QUESTION_ID> \
    -H "Content-Type: application/json" \
    -d '{"text":"Updated question prompt?"}'
  ```

- **Delete a question**:
  ```bash
  curl -X DELETE http://localhost:3000/questions/<QUESTION_ID>
  ```

---

## Testing with Postman

1. Create a Postman environment with variable `base_url = http://localhost:3000`.
2. Use the collection `Quiz API` provided in `/postman` (if included) or manually configure requests.
3. Send requests to `{{base_url}}/questions` for full CRUD coverage.

---

## Deployment

See the [Deployment to DigitalOcean](./docs/deployment.md) guide for:
- Droplet provisioning  
- Node.js & MongoDB setup  
- PM2 process management  
- UFW firewall rules  
- Optional Nginx reverse proxy & SSL via Certbot

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add YourFeature"`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
