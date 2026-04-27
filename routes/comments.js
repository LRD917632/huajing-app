const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.get('/', async (req, res) => {
  try {
    const { postId, plantId } = req.query;
    let comments;
    
    if (postId) {
      comments = await Comment.getByPostId(postId);
    } else if (plantId) {
      comments = await Comment.getByPlantId(plantId);
    } else {
      comments = await Comment.getAll();
    }
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.getById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await Comment.create(req.body);
    res.status(201).json({ id, message: '评论成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const affectedRows = await Comment.update(req.params.id, content);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '评论不存在' });
    }
    res.json({ message: '评论更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await Comment.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '评论不存在' });
    }
    res.json({ message: '评论删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;