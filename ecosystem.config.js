module.exports = {
  apps: [
    {
      name: 'user-backend',
      script: 'server.js',
      cwd: './user-backend',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'media-backend',
      script: 'server.js',
      cwd: './media-backend',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'frontend',
      script: 'npx',
      args: 'serve -s build -l 8080',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
