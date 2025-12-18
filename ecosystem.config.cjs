/**
 * PM2 Ecosystem Configuration
 * https://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
  apps: [
    {
      name: 'airamb',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/ec2-user/airamb',
      instances: 'max', // CPU cores ke hisaab se instances
      exec_mode: 'cluster', // Cluster mode for load balancing
      watch: false,
      max_memory_restart: '500M',
      
      // Environment variables - Production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Environment variables - Development
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/ec2-user/airamb/logs/error.log',
      out_file: '/home/ec2-user/airamb/logs/output.log',
      merge_logs: true,

      // Auto restart configuration
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};

