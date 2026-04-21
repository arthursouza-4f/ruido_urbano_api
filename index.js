require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));

const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Muitas requisições. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/api/users", require("./routes/UserRoutes"));
app.use("/api/noises", require("./routes/NoiseRoutes"));
app.use("/api/category", require("./routes/CategoryRoutes"));
app.use("/api/agents", require("./routes/AgentRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3001, () => console.log('Server is running on port 3001'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));