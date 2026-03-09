import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import * as xlsx from 'xlsx';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const db = new Database('bloodwise.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    date TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    age INTEGER,
    gender TEXT,
    vegetarian TEXT,
    history TEXT,
    medications TEXT,
    hb REAL,
    plt REAL,
    pt REAL,
    albumin REAL,
    symptoms TEXT,
    scenarios TEXT,
    ai_advice TEXT,
    user_decision TEXT,
    survey_satisfaction INTEGER,
    survey_improved TEXT,
    survey_feedback TEXT
  );
`);

// API Routes

// 1. Visits
app.get('/api/visits', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get total visits
  const totalRow = db.prepare('SELECT SUM(count) as total FROM visits').get() as { total: number };
  const total = totalRow.total || 0;
  
  // Get today's visits
  const todayRow = db.prepare('SELECT count FROM visits WHERE date = ?').get(today) as { count: number };
  const todayCount = todayRow ? todayRow.count : 0;
  
  res.json({ total, today: todayCount });
});

app.post('/api/visits', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const stmt = db.prepare(`
    INSERT INTO visits (date, count) 
    VALUES (?, 1) 
    ON CONFLICT(date) DO UPDATE SET count = count + 1
  `);
  stmt.run(today);
  
  res.json({ success: true });
});

// 2. Submissions
app.post('/api/submissions', (req, res) => {
  const data = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO submissions (
      age, gender, vegetarian, history, medications, hb, plt, pt, albumin, 
      symptoms, scenarios, ai_advice, user_decision, survey_satisfaction, 
      survey_improved, survey_feedback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  try {
    const result = stmt.run(
      data.age,
      data.gender,
      data.vegetarian ? 'Yes' : 'No',
      JSON.stringify(data.history || []),
      JSON.stringify(data.medications || []),
      data.hb,
      data.plt,
      data.pt,
      data.albumin,
      JSON.stringify(data.symptoms || []),
      JSON.stringify(data.scenarios || []),
      JSON.stringify(data.ai_advice || {}),
      data.user_decision,
      data.survey_satisfaction,
      data.survey_improved,
      data.survey_feedback
    );
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// 3. Export Data
app.post('/api/export', (req, res) => {
  const { password } = req.body;
  
  if (password !== 'bloodwise@2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
    
    // Format data for Excel
    const formattedData = submissions.map((sub: any) => ({
      'ID': sub.id,
      'Time': sub.created_at,
      'Age': sub.age,
      'Gender': sub.gender,
      'Vegetarian': sub.vegetarian,
      'History': sub.history,
      'Medications': sub.medications,
      'Hemoglobin (Hb)': sub.hb,
      'Platelets (Plt)': sub.plt,
      'PT/aPTT INR': sub.pt,
      'Albumin': sub.albumin,
      'Symptoms': sub.symptoms,
      'Scenarios': sub.scenarios,
      'AI Advice': sub.ai_advice,
      'User Decision': sub.user_decision,
      'Satisfaction (1-5)': sub.survey_satisfaction,
      'Improved Understanding': sub.survey_improved,
      'Feedback': sub.survey_feedback
    }));
    
    const ws = xlsx.utils.json_to_sheet(formattedData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Submissions');
    
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="bloodwise_data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
