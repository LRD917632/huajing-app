class GardenDatabase {
    constructor() {
        this.db = null;
        this.DB_NAME = 'GardenDB';
        this.DB_VERSION = 1;
        this.STORES = [
            { name: 'plants', keyPath: 'id', autoIncrement: false },
            { name: 'diaryPosts', keyPath: 'id', autoIncrement: true },
            { name: 'userProfile', keyPath: 'id', autoIncrement: false },
            { name: 'favorites', keyPath: 'id', autoIncrement: true },
            { name: 'likes', keyPath: 'id', autoIncrement: true },
            { name: 'comments', keyPath: 'id', autoIncrement: true }
        ];
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event) => {
                console.error('数据库打开失败:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('数据库打开成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                this.STORES.forEach(store => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const objectStore = db.createObjectStore(store.name, {
                            keyPath: store.keyPath,
                            autoIncrement: store.autoIncrement
                        });
                        
                        if (store.name === 'plants') {
                            objectStore.createIndex('name', 'name', { unique: false });
                            objectStore.createIndex('category', 'category', { unique: false });
                            objectStore.createIndex('family', 'family', { unique: false });
                        }
                        if (store.name === 'diaryPosts') {
                            objectStore.createIndex('author', 'author', { unique: false });
                            objectStore.createIndex('date', 'date', { unique: false });
                        }
                        if (store.name === 'favorites') {
                            objectStore.createIndex('userId', 'userId', { unique: false });
                            objectStore.createIndex('plantId', 'plantId', { unique: false });
                        }
                        if (store.name === 'likes') {
                            objectStore.createIndex('userId', 'userId', { unique: false });
                            objectStore.createIndex('postId', 'postId', { unique: false });
                        }
                        if (store.name === 'comments') {
                            objectStore.createIndex('postId', 'postId', { unique: false });
                            objectStore.createIndex('plantId', 'plantId', { unique: false });
                        }
                    }
                });
            };
        });
    }

    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async searchPlants(keyword) {
        const plants = await this.getAll('plants');
        const lowerKeyword = keyword.toLowerCase();
        return plants.filter(plant => 
            plant.name.toLowerCase().includes(lowerKeyword) ||
            plant.family.toLowerCase().includes(lowerKeyword) ||
            plant.category.toLowerCase().includes(lowerKeyword) ||
            plant.description.toLowerCase().includes(lowerKeyword)
        );
    }

    async filterByCategory(category) {
        if (category === 'all') {
            return this.getAll('plants');
        }
        return this.getByIndex('plants', 'category', category);
    }

    async importInitialData() {
        const plantsCount = (await this.getAll('plants')).length;
        if (plantsCount === 0 && typeof gardenPlantsData !== 'undefined') {
            for (const plant of gardenPlantsData) {
                await this.add('plants', plant);
            }
            console.log('初始植物数据导入完成');
        }

        const profileCount = (await this.getAll('userProfile')).length;
        if (profileCount === 0) {
            await this.add('userProfile', {
                id: 'currentUser',
                username: '园艺人小李',
                bio: '热爱园艺设计，分享美丽花园，记录每一个花草成长的瞬间 🌿',
                avatar: '👤',
                createdWorks: 12,
                likedWorks: 28,
                favorites: 15,
                totalLikes: 326
            });
            console.log('默认用户数据导入完成');
        }
    }

    async getOrCreateUserProfile() {
        let profile = await this.get('userProfile', 'currentUser');
        if (!profile) {
            profile = {
                id: 'currentUser',
                username: '园艺人小李',
                bio: '热爱园艺设计，分享美丽花园 🌿',
                avatar: '👤',
                createdWorks: 0,
                likedWorks: 0,
                favorites: 0,
                totalLikes: 0
            };
            await this.add('userProfile', profile);
        }
        return profile;
    }

    async addDiaryPost(post) {
        const newPost = {
            ...post,
            date: new Date().toISOString(),
            likes: 0,
            comments: []
        };
        return this.add('diaryPosts', newPost);
    }

    async addLike(postId, userId = 'currentUser') {
        const existingLike = await this.getByIndex('likes', 'postId', postId);
        if (existingLike.length > 0) {
            return false;
        }
        await this.add('likes', { postId, userId });
        
        const post = await this.get('diaryPosts', postId);
        if (post) {
            post.likes++;
            await this.update('diaryPosts', post);
        }
        return true;
    }

    async addFavorite(plantId, userId = 'currentUser') {
        const existingFavorite = await this.getByIndex('favorites', 'plantId', plantId);
        if (existingFavorite.length > 0) {
            return false;
        }
        await this.add('favorites', { plantId, userId });
        return true;
    }

    async removeFavorite(plantId, userId = 'currentUser') {
        const favorites = await this.getByIndex('favorites', 'plantId', plantId);
        const userFavorite = favorites.find(f => f.userId === userId);
        if (userFavorite) {
            await this.delete('favorites', userFavorite.id);
            return true;
        }
        return false;
    }

    async addComment(data) {
        const comment = {
            ...data,
            date: new Date().toISOString()
        };
        return this.add('comments', comment);
    }

    async getCommentsByPost(postId) {
        return this.getByIndex('comments', 'postId', postId);
    }

    async getCommentsByPlant(plantId) {
        return this.getByIndex('comments', 'plantId', plantId);
    }
}

const gardenDB = new GardenDatabase();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await gardenDB.init();
        await gardenDB.importInitialData();
        console.log('花净数据库初始化完成');
    } catch (error) {
        console.error('数据库初始化失败:', error);
    }
});