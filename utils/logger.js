const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logsDir = options.logsDir || path.join(process.cwd(), 'logs');
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024; // 5MB
    this.maxFiles = options.maxFiles || 5;
    this.levels = ['error', 'warn', 'info', 'debug'];
    
    this.createLogsDirectory();
  }
  
  createLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }
  
  rotateLogFile(level) {
    const logFile = path.join(this.logsDir, `${level}.log`);
    
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      
      if (stats.size > this.maxFileSize) {
        // Rotate existing log files
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = path.join(this.logsDir, `${level}.${i}.log`);
          const newFile = path.join(this.logsDir, `${level}.${i + 1}.log`);
          
          if (fs.existsSync(oldFile)) {
            if (i === this.maxFiles - 1) {
              fs.unlinkSync(oldFile); // Delete oldest log
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        
        // Rename current log file
        fs.renameSync(logFile, path.join(this.logsDir, `${level}.1.log`));
      }
    }
  }
  
  formatLogEntry(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data,
      pid: process.pid,
      hostname: require('os').hostname()
    };
    
    return JSON.stringify(logEntry);
  }
  
  writeToFile(level, logLine) {
    try {
      this.rotateLogFile(level);
      
      const logFile = path.join(this.logsDir, `${level}.log`);
      fs.appendFileSync(logFile, logLine + '\n');
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }
  
  log(level, message, data = null) {
    if (!this.levels.includes(level)) {
      level = 'info';
    }
    
    const logLine = this.formatLogEntry(level, message, data);
    
    // Console output with colors
    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[35m'  // Magenta
    };
    
    const reset = '\x1b[0m';
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`${colors[level]}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`, data || '');
    
    // Write to file
    this.writeToFile(level, logLine);
  }
  
  error(message, data) {
    this.log('error', message, data);
  }
  
  warn(message, data) {
    this.log('warn', message, data);
  }
  
  info(message, data) {
    this.log('info', message, data);
  }
  
  debug(message, data) {
    this.log('debug', message, data);
  }
  
  // Get log statistics
  getLogStats() {
    const stats = {};
    
    this.levels.forEach(level => {
      const logFile = path.join(this.logsDir, `${level}.log`);
      if (fs.existsSync(logFile)) {
        const fileStats = fs.statSync(logFile);
        stats[level] = {
          size: fileStats.size,
          modified: fileStats.mtime,
          exists: true
        };
      } else {
        stats[level] = { exists: false };
      }
    });
    
    return stats;
  }
  
  // Clear all log files
  clearLogs() {
    this.levels.forEach(level => {
      const logFile = path.join(this.logsDir, `${level}.log`);
      if (fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '');
      }
      
      // Clear rotated logs too
      for (let i = 1; i <= this.maxFiles; i++) {
        const rotatedFile = path.join(this.logsDir, `${level}.${i}.log`);
        if (fs.existsSync(rotatedFile)) {
          fs.unlinkSync(rotatedFile);
        }
      }
    });
  }
}

module.exports = Logger;
