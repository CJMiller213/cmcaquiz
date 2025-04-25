// index.js
require('dotenv').config();          // 1. load .env first
const express  = require('express');
const mongoose = require('mongoose');
const Question = require('./models/questions');  // 2. import model

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 3. connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 4. Health-check endpoint
app.get('/', (req, res) => {
  res.send('✅ Quiz API is up and running!');
});

// 5. CRUD for /questions

// CREATE
app.post('/questions', async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all (optionally filter by subject)
app.get('/questions', async (req, res) => {
  const filter = {};
  if (req.query.subject) filter.subject = req.query.subject;
  const list = await Question.find(filter);
  res.json(list);
});

// READ one by ID
app.get('/questions/:id', async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ error: 'Not found' });
  res.json(question);
});

// UPDATE by ID
app.put('/questions/:id', async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE by ID
app.delete('/questions/:id', async (req, res) => {
  const deleted = await Question.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// 6. Start server AFTER DB is open
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
});
