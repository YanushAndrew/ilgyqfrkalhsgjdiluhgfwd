# 🚀 Simple Node.js Project

A super simple Node.js project with Express server, beautiful web interface, and comprehensive logging system.

## ✨ Features

- **Express Server**: Simple HTTP server with RESTful API endpoints
- **Beautiful UI**: Modern, responsive web interface with gradient design
- **Comprehensive Logging**: File-based logging with rotation and multiple log levels
- **API Endpoints**: 
  - `GET /api/hello` - Returns a greeting message
  - `GET /api/time` - Returns current server time
  - `POST /api/echo` - Echoes back sent data
  - `GET /api/health` - Server health information
  - `GET /api/logs/:level` - View log files
  - `DELETE /api/logs/:level` - Clear log files
- **Static File Serving**: Serves HTML, CSS, and JavaScript files
- **Development Mode**: Hot reload with nodemon
- **Log Rotation**: Automatic log file rotation to prevent disk space issues

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development (with auto-reload):**
   ```bash
   npm run dev
   ```

## 🌐 Usage

Once the server is running:

1. Open your browser and go to `http://localhost:3000`
2. You'll see a beautiful interface with buttons to test each API endpoint
3. Click the buttons to interact with the different APIs
4. View the JSON responses in real-time
5. Use the Logs Viewer to monitor server activity
6. Check server health and performance metrics
slkdvjklsdjflksjdf
## 📁 Project Structure

```
node-js-simple-project/
├── server.js          # Main Express server
├── package.json       # Project dependencies and scripts
├── utils/             # Utility modules
│   └── logger.js      # Advanced logging utility
├── public/            # Static files
│   └── index.html     # Web interface
├── logs/              # Log files (auto-created)
│   ├── info.log       # Information logs
│   ├── error.log      # Error logs
│   ├── warn.log       # Warning logs
│   └── debug.log      # Debug logs
└── README.md          # This file
```

## 🔧 API Endpoints

### GET /api/hello
Returns a simple greeting message.
```json
{
  "message": "Hello from Node.js!"
}
```
hohoho
### GET /api/time
Returns current server time and timestamp.
```json
{
  "currentTime": "2024-01-01T12:00:00.000Z",
  "timestamp": 1704110400000
}
```

### POST /api/echo
Echoes back the sent data with additional metadata.
```json
{
  "message": "Echo response",
  "data": { "message": "Hello!", "timestamp": 1704110400000 },
  "receivedAt": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/health
Returns comprehensive server health information.
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600.5,
  "memory": {
    "rss": 12345678,
    "heapTotal": 9876543,
    "heapUsed": 5432109
  },
  "environment": "development",
  "logStats": {
    "info": { "size": 1024, "modified": "2024-01-01T12:00:00.000Z" },
    "error": { "size": 512, "modified": "2024-01-01T12:00:00.000Z" }
  }
}
```

### GET /api/logs/:level
View log entries for a specific log level (info, error, warn, debug).
```json
{
  "level": "info",
  "logs": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "level": "INFO",
      "message": "Server started successfully",
      "data": { "port": 3000 }
    }
  ],
  "count": 1
}
```

### DELETE /api/logs/:level
Clear logs for a specific level or all logs (use 'all' for all levels).
```json
{
  "message": "info logs cleared successfully"
}
```

## 📝 Logging System

The project includes a sophisticated logging system with the following features:

### Log Levels
- **INFO**: General information about application flow
- **ERROR**: Error conditions and exceptions
- **WARN**: Warning conditions that don't stop execution
- **DEBUG**: Detailed debugging information

### Log Features
- **File-based logging**: Each log level gets its own file
- **Automatic rotation**: Log files are rotated when they exceed 5MB
- **Structured logging**: JSON format for easy parsing
- **Request logging**: All HTTP requests are automatically logged
- **Performance tracking**: Request duration and response codes
- **Error tracking**: Unhandled exceptions and rejections

### Log File Locations
- `logs/info.log` - Information logs
- `logs/error.log` - Error logs  
- `logs/warn.log` - Warning logs
- `logs/debug.log` - Debug logs

### Log Rotation
- Maximum file size: 5MB
- Maximum rotated files: 5 per level
- Old logs are automatically deleted

## 🎨 Customization

- **Port**: Change the port by setting the `PORT` environment variable
- **Styling**: Modify the CSS in `public/index.html` to change the appearance
- **API Endpoints**: Add new routes in `server.js`
- **Frontend**: Enhance the JavaScript functionality in `public/index.html`
- **Logging**: Configure log rotation and levels in `utils/logger.js`

## 🚀 Deployment

This project can be easily deployed to:
- Heroku
- Vercel
- Railway
- Any Node.js hosting platform

Just make sure to set the `PORT` environment variable if needed.

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications!

---

**Happy coding! 🎉**
