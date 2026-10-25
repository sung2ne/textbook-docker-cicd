// 파일: app/src/index.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB 연결 설정
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 스키마 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// API 라우트
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo({ title: req.body.title });
  await todo.save();
  res.status(201).json(todo);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
