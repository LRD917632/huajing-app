const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const plantsRouter = require('./routes/plants');
const diaryRouter = require('./routes/diary');
const profileRouter = require('./routes/profile');
const favoritesRouter = require('./routes/favorites');
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/plants', plantsRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/profile', profileRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/comments', commentsRouter);

app.get('/', (req, res) => {
  res.json({ message: '花净园艺DIY平台后端服务运行中' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'API接口不存在' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();