const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

router.get('/', async (req, res) => {
  try {
    const { category, keyword } = req.query;
    let plants;
    
    if (keyword) {
      plants = await Plant.search(keyword);
    } else if (category) {
      plants = await Plant.getByCategory(category);
    } else {
      plants = await Plant.getAll();
    }
    
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Plant.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.getById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: '植物不存在' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = await Plant.create(req.body);
    res.status(201).json({ id, message: '植物创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const affectedRows = await Plant.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '植物不存在' });
    }
    res.json({ message: '植物更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await Plant.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: '植物不存在' });
    }
    res.json({ message: '植物删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;