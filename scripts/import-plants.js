const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const plantData = JSON.parse(fs.readFileSync('./植物大全/plant_family.json', 'utf8'));

const parsePlantData = (rawPlant) => {
  const plant = {
    id: rawPlant["1"],
    name: '',
    category: '',
    family: '',
    description: '',
    image: '',
    careLevel: '不容易死',
    propagation: '',
    benefits: '',
    distribution: ''
  };

  let nameFromDesc = '';
  
  for (const key in rawPlant) {
    if (key === '金边龙舌兰') {
      plant.name = rawPlant[key];
    } else if (key === '龙舌兰科') {
      plant.family = rawPlant[key];
    } else if (key === '龙舌兰属') {
      plant.genus = rawPlant[key];
    } else if (key === '西南、华南。原产美洲的沙漠地带') {
      plant.distribution = rawPlant[key];
    } else if (key === '不容易死') {
      plant.careLevel = rawPlant[key];
    } else if (key.startsWith('http://img')) {
      const imgObj = rawPlant[key];
      for (const k1 in imgObj) {
        for (const k2 in imgObj[k1]) {
          for (const k3 in imgObj[k1][k2]) {
            plant.image = `http://img.${k1}.com/${k2}.${k3}`;
          }
        }
      }
    } else if (key.includes('金边龙蛇兰为多年生') || key.includes('澶氬勾')) {
      plant.description = rawPlant[key].replace(/\s+/g, ' ').trim();
      
      const desc = rawPlant[key];
      const chineseMatch = desc.match(/([\u4e00-\u9fa5]{2,8})[\u540d\u8303\u683c\u79cd]/);
      if (chineseMatch && !plant.name) {
        nameFromDesc = chineseMatch[1];
      }
      
      if (!nameFromDesc) {
        const firstChineseMatch = desc.match(/[\u4e00-\u9fa5]{2,8}/);
        if (firstChineseMatch) {
          nameFromDesc = firstChineseMatch[0];
        }
      }
    } else if (key.includes('金边龙舌兰的栽培难度') || key.includes('鏍藉煿')) {
      plant.benefits = rawPlant[key].replace(/\s+/g, ' ').trim().substring(0, 200);
      
      const benefitText = rawPlant[key];
      const nameMatch = benefitText.match(/([\u4e00-\u9fa5]{2,8})[\u662f\u6539\u5982\u4f55]/);
      if (nameMatch && !plant.name && !nameFromDesc) {
        nameFromDesc = nameMatch[1];
      }
    } else if (key.includes('金边龙舌兰常用分株') || key.includes('鐢ㄥ垎')) {
      plant.propagation = rawPlant[key].replace(/\s+/g, ' ').trim().substring(0, 200);
    }
  }

  if (!plant.name && nameFromDesc) {
    plant.name = nameFromDesc;
  }

  if (!plant.name) {
    plant.name = `植物${plant.id}`;
  }

  if (plant.family.includes('景天科')) plant.category = '多肉';
  else if (plant.family.includes('兰科')) plant.category = '兰花';
  else if (plant.family.includes('仙人掌')) plant.category = '仙人掌';
  else if (plant.family.includes('菊科')) plant.category = '草本';
  else if (plant.family.includes('蔷薇科')) plant.category = '灌木';
  else if (plant.family.includes('木犀科')) plant.category = '乔木';
  else if (plant.family.includes('百合科')) plant.category = '草本';
  else if (plant.family.includes('豆科')) plant.category = '灌木';
  else if (plant.family.includes('景天')) plant.category = '多肉';
  else if (plant.family.includes('仙人掌科')) plant.category = '仙人掌';
  else if (plant.family.includes('天南星科')) plant.category = '草本';
  else if (plant.family.includes('柏科')) plant.category = '乔木';
  else if (plant.family.includes('茜草科')) plant.category = '灌木';
  else if (plant.family.includes('杜鹃花科')) plant.category = '灌木';
  else if (plant.family.includes('茄科')) plant.category = '草本';
  else plant.category = '其他';

  return plant;
};

const importPlants = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await connection.execute('DELETE FROM plants');
    
    let count = 0;
    let skipped = 0;
    
    for (const rawPlant of plantData.plants) {
      const plant = parsePlantData(rawPlant);
      
      await connection.execute(
        'INSERT INTO plants (id, name, category, family, description, image, careLevel, propagation, benefits, bloomingSeason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          plant.id,
          plant.name,
          plant.category,
          plant.family,
          plant.description.substring(0, 500),
          plant.image,
          plant.careLevel,
          plant.propagation,
          plant.benefits,
          '未知'
        ]
      );
      count++;
      if (count % 50 === 0) {
        console.log(`已导入 ${count} 种植物...`);
      }
    }

    console.log(`\n共导入 ${count} 种植物`);
  } catch (error) {
    console.error('导入植物数据失败:', error);
  } finally {
    await connection.end();
  }
};

importPlants();