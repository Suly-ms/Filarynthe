module.exports = {
    apps: [
        {
            name: "3d-vault-backend",
            script: "server.js",
            cwd: "./backend",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                // PORT: 14285 // Already defined in server.js but can be overridden here
            }
        },
        {
            name: "3d-vault-frontend",
            script: "npm",
            args: "run preview -- --port 15372 --host", // Using preview for production-like serve
            cwd: "./frontend",
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
            }
        }
    ]
};
