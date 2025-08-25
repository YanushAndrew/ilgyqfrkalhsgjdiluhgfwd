const express = require('express');
const path = require('path');
const Logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize logger
const logger = new Logger({
  logsDir: path.join(__dirname, 'logs'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5
});

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Log response details after request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  logger.info('Serving index.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/hello', (req, res) => {
  logger.info('Hello API called');
  res.json({ message: 'Hello from Node.js!' });
});

app.get('/api/time', (req, res) => {
  const currentTime = new Date().toISOString();
  const timestamp = Date.now();
  
  logger.info('Time API called', { currentTime, timestamp });
  
  res.json({ 
    currentTime,
    timestamp
  });
});

app.post('/api/echo', (req, res) => {
  logger.info('Echo API called', { 
    receivedData: req.body,
    contentType: req.get('Content-Type')
  });
  
  res.json({ 
    message: 'Echo response',
    data: req.body,
    receivedAt: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    logStats: logger.getLogStats()
  };
  
  logger.info('Health check requested', health);
  res.json(health);
});

// Log file endpoint (for debugging)
app.get('/api/logs/:level', (req, res) => {
  const { level } = req.params;
  const logFile = path.join(logger.logsDir, `${level}.log`);
  
  if (require('fs').existsSync(logFile)) {
    try {
      const logs = require('fs').readFileSync(logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .slice(-50); // Last 50 log entries
      
      logger.info('Logs requested', { level, entries: logs.length });
      res.json({ level, logs, count: logs.length });
    } catch (error) {
      logger.error('Error reading log file', { level, error: error.message });
      res.status(500).json({ error: 'Failed to read log file' });
    }
  } else {
    logger.warn('Log file not found', { level });
    res.status(404).json({ error: 'Log file not found' });
  }
});

// Clear logs endpoint
app.delete('/api/logs/:level', (req, res) => {
  const { level } = req.params;
  
  if (level === 'all') {
    logger.clearLogs();
    logger.info('All logs cleared');
    res.json({ message: 'All logs cleared successfully' });
  } else if (logger.levels.includes(level)) {
    const logFile = path.join(logger.logsDir, `${level}.log`);
    if (require('fs').existsSync(logFile)) {
      require('fs').writeFileSync(logFile, '');
      logger.info(`${level} logs cleared`);
      res.json({ message: `${level} logs cleared successfully` });
    } else {
      res.status(404).json({ error: 'Log file not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid log level' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { url: req.originalUrl, method: req.method });
  res.status(404).json({ 
    error: 'Route not found',
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  logger.info('Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  });
  
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'public')}`);
  console.log(`📝 Logs are being written to: ${logger.logsDir}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', {
    reason: reason,
    promise: promise
  });
  process.exit(1);
});
