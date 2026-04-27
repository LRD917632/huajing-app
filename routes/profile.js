const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

router.get('/', async (req, res) => {
  try {
    const profiles = await UserProfile.getAll();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await UserProfile.getById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await UserProfile.create(req.body);
    res.status(201).json({ id, message: '用户创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const affectedRows = await UserProfile.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '用户更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await UserProfile.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/created-works', async (req, res) => {
  try {
    const affectedRows = await UserProfile.incrementCreatedWorks(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '作品数更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/liked-works', async (req, res) => {
  try {
    const affectedRows = await UserProfile.incrementLikedWorks(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '点赞作品数更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/favorites', async (req, res) => {
  try {
    const affectedRows = await UserProfile.incrementFavorites(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '收藏数更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/total-likes', async (req, res) => {
  try {
    const affectedRows = await UserProfile.incrementTotalLikes(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '总点赞数更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;