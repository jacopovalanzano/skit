const express = require('express');
const next = require('next');
const youtubeRoutes = require('./app/routes/youtubeRoutes');
const spotifyRoutes = require('./app/routes/spotifyRoutes');
const storageRoutes = require('./app/routes/storageRoutes');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express(); // Create an Express app

    // Enable CORS
    server.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });

    // Middleware must be used BEFORE routes
    server.use(express.json());
    server.use(express.urlencoded({ extended: true })); // Optional for form data

    // Mount API routes
    server.use("/api/v1", youtubeRoutes);
    server.use("/api/v1", spotifyRoutes);
    server.use("/api/v1", storageRoutes);

    // Handle Next.js pages
    server.all('*', (req, res) => {
        return handle(req, res); // Serve Next.js pages
    });

    // Start the server
    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Server ready on http://localhost:${port}`);
    });
});
