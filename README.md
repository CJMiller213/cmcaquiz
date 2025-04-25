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
12. [Change Log](#change-log)

---

## Features

- CRUD operations for quiz questions
- Bulk insertion of multiple questions via `/questions/bulk`
- Questions categorized by CMCA® exam domains:
  - Governance
  - Financial Management
  - Operations
  - Communications
  - Human Resources
  - Risk Management
- Schema validation with Mongoose (including enum and custom validators)
- Environment configuration via `.env`
- Ready for deployment on DigitalOcean (PM2, Nginx/SSL)

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

| Method | Endpoint             | Description                                           |
|--------|----------------------|-------------------------------------------------------|
| GET    | `/`                  | Health check                                          |
| POST   | `/questions`         | Create a new question                                 |
| POST   | `/questions/bulk`    | Bulk-create multiple questions                        |
| GET    | `/questions`         | Retrieve all questions (optional filter by `?subject=`) |
| GET    | `/questions/:id`     | Retrieve a single question by ID                      |
| PUT    | `/questions/:id`     | Update an existing question by ID                     |
| DELETE | `/questions/:id`     | Delete a question by ID                               |

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

- **Bulk insert questions**:
  ```bash
  curl -X POST http://localhost:3000/questions/bulk \
    -H "Content-Type: application/json" \
    -d '[
      {
        "subject":"Governance",
        "text":"What is quorum?",
        "choices":["A","B","C","D"],
        "answerIndex":2,
        "explanation":"Minimum number of members required to conduct business."
      },
      {
        "subject":"Financial Management",
        "text":"Which statement reports assets and liabilities?",
        "choices":["Balance Sheet","Income Statement","Cash Flow","Equity Statement"],
        "answerIndex":0,
        "explanation":"A Balance Sheet shows assets, liabilities, and equity."
      }
    ]'
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
2. Use the collection `Quiz API` provided or manually configure requests.
3. Send requests to `{{base_url}}/questions` and `/bulk` for full CRUD coverage.

---

## Deployment

### DigitalOcean Droplet Setup
1. **SSH into your Droplet**  
   ```bash
   ssh corey@<YOUR_DROPLET_IP>
   # Enter your password when prompted
   ```
2. **Create a non-root sudo user** (recommended)  
   ```bash
   sudo adduser corey
   sudo usermod -aG sudo corey
   exit
   ssh corey@<YOUR_DROPLET_IP>
   ```
3. **System updates**  
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Install Node.js (v18+)**  
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
5. **Skip local MongoDB** (using Atlas instead)

6. **Clone your repository & install deps**  
   ```bash
   cd ~
   git clone https://github.com/YourUsername/YourRepoName.git quiz-api
   cd quiz-api
   npm install
   ```
7. **Configure `.env`**  
   ```bash
   cp .env.example .env
   nano .env
   # Set your MONGO_URI to Atlas connection string and PORT=3000
   ```
8. **Process management with PM2**  
   ```bash
   sudo npm install -g pm2
   pm2 start index.js --name cmca-quiz-api
   pm2 save
   pm2 startup systemd
   ```
9. **Enable firewall (UFW)**  
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

---

### Domain & SSL Configuration

1. **Add domain in DigitalOcean**  
   - In the control panel, go to **Networking → Domains** and add your Namecheap domain (e.g., `yourdomain.com`), assigning it to your droplet.

2. **Point Namecheap to DigitalOcean nameservers**  
   - In Namecheap DNS settings, set custom nameservers to:
     ```text
     ns1.digitalocean.com
     ns2.digitalocean.com
     ns3.digitalocean.com
     ```

3. **Create DNS records in DigitalOcean**  
   - **A Record** for `@` → your droplet IP  
   - **CNAME** for `www` → `@`

4. **Configure Nginx reverse proxy**  
   ```bash
   sudo apt install -y nginx
   sudo tee /etc/nginx/sites-available/cmca-quiz-api << 'EOF'
   server {
     listen 80;
     server_name yourdomain.com www.yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   EOF
   sudo ln -s /etc/nginx/sites-available/cmca-quiz-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Obtain SSL with Certbot**  
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
6. **Verify HTTPS**  
   - Visit `https://yourdomain.com` and ensure the certificate is valid and your API responds.

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

---

## Change Log

### v0.1.1 - 2025-04-25
- **Added** bulk insertion endpoint (`POST /questions/bulk`) for inserting multiple questions at once.
- **Updated** API Endpoints and Usage Examples to document bulk creation.

### v0.1.0 - 2025-04-25
- Initial documentation and CRUD implementation for single-question endpoints.
- Environment configuration and deployment instructions.
- Mongoose model with enum validation for CMCA® domains.
- Testing guidelines with Postman.
