const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

router.get('/', async (req, res) => {
  try {
    const { userId, plantId } = req.query;
    let favorites;
    
    if (userId && plantId) {
      favorites = await Favorite.getByUserIdAndPlantId(userId, plantId);
    } else if (userId) {
      favorites = await Favorite.getByUserId(userId);
    } else if (plantId) {
      favorites = await Favorite.getByPlantId(plantId);
    } else {
      favorites = await Favorite.getAll();
    }
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId/plants', async (req, res) => {
  try {
    const plants = await Favorite.getFavoritePlants(req.params.userId);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, plantId } = req.body;
    const existing = await Favorite.getByUserIdAndPlantId(userId, plantId);
    if (existing) {
      return res.status(400).json({ error: '已收藏该植物' });
    }
    const id = await Favorite.create({ userId, plantId });
    res.status(201).json({ id, message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await Favorite.deleteById(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '收藏不存在' });
    }
    res.json({ message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/user/:userId/plant/:plantId', async (req, res) => {
  try {
    const affectedRows = await Favorite.deleteByUserIdAndPlantId(req.params.userId, req.params.plantId);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '收藏不存在' });
    }
    res.json({ message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;