const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus : collecte automatique des métriques système
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrique custom : compte le nombre de requêtes HTTP
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Middleware : incrémente le compteur à chaque requête
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route métriques — Prometheus vient scraper cette URL
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Récupère tous les messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crée un message
app.post('/messages', async (req, res) => {
  const { content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (content) VALUES ($1) RETURNING *',
      [content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});