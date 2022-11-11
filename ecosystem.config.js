module.exports = {
  apps : [{
    name: 'sultao-api',
    script: './bin/www',
    node_args: '-r esm -r dotenv/config.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch : ['node_modules', 'public'],
    max_memory_restart: '1G'
  }]
};
