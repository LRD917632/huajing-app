const express = require('express');
const router = express.Router();
const DiaryPost = require('../models/DiaryPost');

router.get('/', async (req, res) => {
  try {
    const { author, plantId } = req.query;
    let posts;
    
    if (author) {
      posts = await DiaryPost.getByAuthor(author);
    } else if (plantId) {
      posts = await DiaryPost.getByPlantId(plantId);
    } else {
      posts = await DiaryPost.getAll();
    }
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await DiaryPost.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: '日记不存在' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await DiaryPost.create(req.body);
    res.status(201).json({ id, message: '日记创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const affectedRows = await DiaryPost.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '日记不存在' });
    }
    res.json({ message: '日记更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await DiaryPost.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '日记不存在' });
    }
    res.json({ message: '日记删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const affectedRows = await DiaryPost.addLike(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '日记不存在' });
    }
    res.json({ message: '点赞成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;