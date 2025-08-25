#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const logsDir = path.join(process.cwd(), 'logs');
const logLevels = ['info', 'error', 'warn', 'debug'];

console.log('🔍 Log Monitor - Watching for new log entries...\n');

// Function to get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Function to read new content from a file
function readNewContent(filePath, lastSize) {
  try {
    const currentSize = getFileSize(filePath);
    if (currentSize > lastSize) {
      const stream = fs.createReadStream(filePath, { start: lastSize });
      let newContent = '';
      
      stream.on('data', (chunk) => {
        newContent += chunk.toString();
      });
      
      stream.on('end', () => {
        if (newContent.trim()) {
          const lines = newContent.trim().split('\n');
          lines.forEach(line => {
            if (line.trim()) {
              try {
                const logEntry = JSON.parse(line);
                const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();
                const level = logEntry.level;
                const message = logEntry.message;
                const data = logEntry.data ? ` - ${JSON.stringify(logEntry.data)}` : '';
                
                // Color coding for different log levels
                const colors = {
                  'INFO': '\x1b[36m',   // Cyan
                  'ERROR': '\x1b[31m',  // Red
                  'WARN': '\x1b[33m',   // Yellow
                  'DEBUG': '\x1b[35m'   // Magenta
                };
                
                const reset = '\x1b[0m';
                console.log(`${colors[level]}[${timestamp}] [${level}]${reset} ${message}${data}`);
              } catch (parseError) {
                console.log(`[RAW] ${line}`);
              }
            }
          });
        }
      });
      
      return currentSize;
    }
    return lastSize;
  } catch (error) {
    return lastSize;
  }
}

// Monitor each log file
const fileSizes = {};

logLevels.forEach(level => {
  const logFile = path.join(logsDir, `${level}.log`);
  fileSizes[level] = getFileSize(logFile);
  
  console.log(`📝 Monitoring ${level.toUpperCase()} logs: ${logFile}`);
});

console.log('\n⏳ Waiting for new log entries... (Press Ctrl+C to stop)\n');

// Check for new content every 100ms
setInterval(() => {
  logLevels.forEach(level => {
    const logFile = path.join(logsDir, `${level}.log`);
    if (fs.existsSync(logFile)) {
      fileSizes[level] = readNewContent(logFile, fileSizes[level]);
    }
  });
}, 100);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Log monitoring stopped.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Log monitoring stopped.');
  process.exit(0);
});
