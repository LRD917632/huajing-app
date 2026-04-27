const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
  let connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS plants (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        family VARCHAR(100),
        description TEXT,
        image VARCHAR(255),
        careLevel VARCHAR(20),
        waterFrequency VARCHAR(50),
        lightRequirements VARCHAR(100),
        soilType VARCHAR(100),
        growthSize VARCHAR(100),
        bloomingSeason VARCHAR(100),
        toxicity VARCHAR(50),
        propagation VARCHAR(200),
        benefits TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_plants_name (name),
        INDEX idx_plants_category (category),
        INDEX idx_plants_family (family)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS diary_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        plantId VARCHAR(50),
        likes INT DEFAULT 0,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_diary_author (author),
        INDEX idx_diary_date (date),
        INDEX idx_diary_plantId (plantId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        bio TEXT,
        avatar VARCHAR(255),
        createdWorks INT DEFAULT 0,
        likedWorks INT DEFAULT 0,
        favorites INT DEFAULT 0,
        totalLikes INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        plantId VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_favorites_userId (userId),
        INDEX idx_favorites_plantId (plantId),
        UNIQUE KEY unique_favorite (userId, plantId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        postId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_likes_userId (userId),
        INDEX idx_likes_postId (postId),
        UNIQUE KEY unique_like (userId, postId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT,
        plantId VARCHAR(50),
        userId VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_comments_postId (postId),
        INDEX idx_comments_plantId (plantId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('数据库表结构创建完成');
  } catch (error) {
    console.error('创建数据库表失败:', error);
  } finally {
    await connection.end();
  }
};

createTables();