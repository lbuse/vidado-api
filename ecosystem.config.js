module.exports = {
  apps : [{
    name: 'vidado-api',
    script: './bin/www',
    env: {
      "NODE_ENV": "production",
    },
    node_args: '-r esm -r dotenv/config.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch : ['node_modules', 'public'],
    max_memory_restart: '1G'
  }]
};
