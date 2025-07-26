# Energy Usage Management System

A complete CRUD (Create, Read, Update, Delete) application for managing customer energy usage records. Built with Node.js, Express, SQLite, and a modern responsive frontend.

## Features

- ✅ **Add new usage records** - Customer ID, kWh usage, and automatic timestamp
- ✅ **List all records** - View all energy usage records with sorting
- ✅ **Update records** - Edit existing usage records
- ✅ **Delete records** - Remove usage records with confirmation
- ✅ **Modern UI** - Beautiful, responsive design with smooth animations
- ✅ **Real-time feedback** - Success/error messages and loading states


## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (local storage)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd energy-usage-crud-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The application will automatically create the database and tables

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Get All Usage Records
```http
GET /api/usage
```

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "customer_id": "CUST001",
      "kwh_used": 150.5,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Single Usage Record
```http
GET /api/usage/:id
```

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "customer_id": "CUST001",
    "kwh_used": 150.5,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Create New Usage Record
```http
POST /api/usage
Content-Type: application/json

{
  "customer_id": "CUST001",
  "kwh_used": 150.5
}
```

**Response:**
```json
{
  "message": "Usage record created successfully",
  "data": {
    "id": 1,
    "customer_id": "CUST001",
    "kwh_used": 150.5,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Update Usage Record
```http
PUT /api/usage/:id
Content-Type: application/json

{
  "customer_id": "CUST001",
  "kwh_used": 175.2
}
```

**Response:**
```json
{
  "message": "Usage record updated successfully",
  "data": {
    "id": 1,
    "customer_id": "CUST001",
    "kwh_used": 175.2,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 5. Delete Usage Record
```http
DELETE /api/usage/:id
```

**Response:**
```json
{
  "message": "Usage record deleted successfully"
}
```

## Sample cURL Commands

### Get all records
```bash
curl -X GET http://localhost:3000/api/usage
```

### Get single record
```bash
curl -X GET http://localhost:3000/api/usage/1
```

### Create new record
```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "CUST001", "kwh_used": 150.5}'
```

### Update record
```bash
curl -X PUT http://localhost:3000/api/usage/1 \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "CUST001", "kwh_used": 175.2}'
```

### Delete record
```bash
curl -X DELETE http://localhost:3000/api/usage/1
```

## Database Schema

The application uses SQLite with the following table structure:

```sql
CREATE TABLE energy_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  kwh_used REAL NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
energy-usage-crud-app/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── energy_usage.db       # SQLite database (auto-created)
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # CSS styles
│   └── script.js         # Frontend JavaScript
├── README.md             # This file
└── .gitignore           # Git ignore file
```

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   eb init
   ```

3. **Create environment**
   ```bash
   eb create energy-usage-app
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### Option 2: AWS EC2

1. **Launch EC2 instance** (t2.micro for free tier)
2. **Install Node.js and dependencies**
3. **Upload code and start application**
4. **Configure security groups** (port 3000)

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```
3. **Deploy**
   ```bash
   git push heroku main
   ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request** - Invalid input data
- **404 Not Found** - Record not found
- **500 Internal Server Error** - Server/database errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: [your-email@example.com]

---

**Built with ❤️ using Node.js, Express, and modern web technologies** 