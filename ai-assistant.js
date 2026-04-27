class PlantCareReminder {
    constructor() {
        this.reminders = [];
        this.todayGreeting = this.getTodayGreeting();
        this.careTips = [
            { time: 'morning', tip: '🌅 早上好！记得给你的植物们浇浇水哦~', emoji: '💧' },
            { time: 'noon', tip: '☀️ 中午好！看看你的植物们有没有晒到太阳呀~', emoji: '☀️' },
            { time: 'afternoon', tip: '🌤️ 下午好！有些植物需要通风透气哦~', emoji: '🌬️' },
            { time: 'evening', tip: '🌙 晚上好！检查一下土壤湿度，准备休息啦~', emoji: '🌙' }
        ];
        
        this.careKnowledge = [
            { question: '浇水技巧', answer: '💧 浇水要"见干见湿"，等土壤表面干燥后再浇透，避免积水导致烂根哦~' },
            { question: '施肥建议', answer: '🌿 生长期可每月施一次薄肥，休眠期减少施肥或停止施肥~' },
            { question: '光照需求', answer: '☀️ 大部分花卉需要充足光照，但夏季要避免暴晒，适当遮阴~' },
            { question: '温度注意', answer: '🌡️ 不同植物对温度要求不同，冬季注意保暖，夏季注意通风~' },
            { question: '病虫害防治', answer: '🐛 定期检查叶片背面，发现病虫害及时处理，可使用环保药剂~' },
            { question: '换盆时机', answer: '🪴 一般1-2年换一次盆，春季是最佳时机~' },
            { question: '修剪技巧', answer: '✂️ 及时修剪残花和枯枝，促进植物健康生长~' },
            { question: '土壤选择', answer: '🌱 选择疏松透气的土壤，可添加腐叶土或珍珠岩~' }
        ];
    }

    getTodayGreeting() {
        const hour = new Date().getHours();
        const season = this.getCurrentSeason();
        const weather = this.getWeatherEmoji();
        
        if (hour < 6) return `🌙 夜深了，照顾好自己和植物哦~ ${weather}`;
        if (hour < 12) return `🌅 早上好呀！新的一天开始了，今天也要好好照顾植物哦~ ${season} ${weather}`;
        if (hour < 14) return `☀️ 中午好！记得休息一下，也给植物们晒晒太阳~ ${weather}`;
        if (hour < 18) return `🌤️ 下午好！忙了一天，来看看你的植物朋友们吧~ ${season} ${weather}`;
        return `🌙 晚上好！辛苦了一天，和植物们道声晚安吧~ ${weather}`;
    }

    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return '🌸 春暖花开';
        if (month >= 6 && month <= 8) return '🌿 夏日炎炎';
        if (month >= 9 && month <= 11) return '🍂 秋高气爽';
        return '❄️ 冬日暖阳';
    }

    getWeatherEmoji() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 8) return '🌅';
        if (hour >= 8 && hour < 17) return '☀️';
        if (hour >= 17 && hour < 19) return '🌇';
        return '🌙';
    }

    getCurrentTimeTip() {
        const hour = new Date().getHours();
        if (hour < 12) return this.careTips.find(t => t.time === 'morning');
        if (hour < 14) return this.careTips.find(t => t.time === 'noon');
        if (hour < 18) return this.careTips.find(t => t.time === 'afternoon');
        return this.careTips.find(t => t.time === 'evening');
    }

    getRandomTip() {
        const index = Math.floor(Math.random() * this.careKnowledge.length);
        return this.careKnowledge[index];
    }

    addReminder(type, plantName, dateTime) {
        const reminder = {
            id: Date.now(),
            type,
            plantName,
            dateTime,
            notified: false
        };
        this.reminders.push(reminder);
        this.saveReminders();
        return reminder;
    }

    getReminders() {
        const saved = localStorage.getItem('plantReminders');
        if (saved) {
            this.reminders = JSON.parse(saved);
        }
        return this.reminders;
    }

    saveReminders() {
        localStorage.setItem('plantReminders', JSON.stringify(this.reminders));
    }

    checkReminders() {
        const now = new Date();
        const dueReminders = this.reminders.filter(r => {
            const reminderTime = new Date(r.dateTime);
            return !r.notified && reminderTime <= now;
        });
        return dueReminders;
    }

    markAsNotified(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.notified = true;
            this.saveReminders();
        }
    }
}

const careReminder = new PlantCareReminder();

function toggleAiChat() {
    const chatContainer = document.getElementById('aiChatContainer');
    const aiBtn = document.getElementById('aiBtn');
    
    if (chatContainer.classList.contains('show')) {
        closeAiChat();
    } else {
        chatContainer.classList.add('show');
        aiBtn.classList.add('active');
        showWelcomeMessage();
    }
}

function closeAiChat() {
    const chatContainer = document.getElementById('aiChatContainer');
    const aiBtn = document.getElementById('aiBtn');
    
    chatContainer.classList.remove('show');
    aiBtn.classList.remove('active');
}

function showWelcomeMessage() {
    const messagesContainer = document.getElementById('aiChatMessages');
    messagesContainer.innerHTML = '';
    
    addMessage('bot', careReminder.todayGreeting);
    
    const timeTip = careReminder.getCurrentTimeTip();
    if (timeTip) {
        setTimeout(() => {
            addMessage('bot', `${timeTip.emoji} ${timeTip.tip}`);
        }, 500);
    }
    
    setTimeout(() => {
        addMessage('bot', '💡 我是你的植物养护小助手，有什么可以帮助你的吗？\n\n你可以问问我：\n• 浇水技巧\n• 施肥建议\n• 光照需求\n• 温度注意\n• 病虫害防治\n• 换盆时机\n• 修剪技巧\n• 土壤选择\n\n或者告诉我你想设置浇水/施肥提醒~');
    }, 1000);
}

function sendAiMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    input.value = '';
    
    handleUserMessage(message);
}

function sendAiQuestion(question) {
    document.getElementById('aiInput').value = question;
    sendAiMessage();
}

function handleUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('浇水') || lowerMessage.includes('水')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('浇水'));
        addMessage('bot', tip ? tip.answer : '💧 浇水要"见干见湿"，等土壤表面干燥后再浇透哦~');
    } else if (lowerMessage.includes('施肥') || lowerMessage.includes('肥')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('施肥'));
        addMessage('bot', tip ? tip.answer : '🌿 生长期可每月施一次薄肥，休眠期减少施肥~');
    } else if (lowerMessage.includes('光照') || lowerMessage.includes('阳光')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('光照'));
        addMessage('bot', tip ? tip.answer : '☀️ 大部分花卉需要充足光照，但夏季要避免暴晒~');
    } else if (lowerMessage.includes('温度') || lowerMessage.includes('冷') || lowerMessage.includes('热')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('温度'));
        addMessage('bot', tip ? tip.answer : '🌡️ 不同植物对温度要求不同，冬季注意保暖~');
    } else if (lowerMessage.includes('病虫害') || lowerMessage.includes('虫') || lowerMessage.includes('病')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('病虫害'));
        addMessage('bot', tip ? tip.answer : '🐛 定期检查叶片背面，发现病虫害及时处理~');
    } else if (lowerMessage.includes('换盆') || lowerMessage.includes('盆')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('换盆'));
        addMessage('bot', tip ? tip.answer : '🪴 一般1-2年换一次盆，春季是最佳时机~');
    } else if (lowerMessage.includes('修剪') || lowerMessage.includes('剪')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('修剪'));
        addMessage('bot', tip ? tip.answer : '✂️ 及时修剪残花和枯枝，促进植物健康生长~');
    } else if (lowerMessage.includes('土壤') || lowerMessage.includes('土')) {
        const tip = careReminder.careKnowledge.find(t => t.question.includes('土壤'));
        addMessage('bot', tip ? tip.answer : '🌱 选择疏松透气的土壤，可添加腐叶土~');
    } else if (lowerMessage.includes('提醒') || lowerMessage.includes('设置') || lowerMessage.includes('闹钟')) {
        showReminderModal();
    } else if (lowerMessage.includes('早上好') || lowerMessage.includes('早安')) {
        addMessage('bot', '🌅 早上好呀！今天也要元气满满地照顾植物哦~ 💚');
    } else if (lowerMessage.includes('晚安') || lowerMessage.includes('晚上好')) {
        addMessage('bot', '🌙 晚安！好好休息，明天继续照顾你的植物朋友们~ 💤');
    } else if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
        addMessage('bot', '😊 不用谢！能帮到你真好~ 有任何问题随时找我哦！');
    } else if (lowerMessage.includes('你好') || lowerMessage.includes('哈喽')) {
        addMessage('bot', '🌸 你好呀！我是你的植物养护小助手，很高兴认识你~');
    } else {
        const randomTip = careReminder.getRandomTip();
        addMessage('bot', `🌿 ${randomTip.answer}\n\n如果你有其他问题，随时问我哦~`);
    }
}

function showReminderModal() {
    document.getElementById('reminderModal').style.display = 'flex';
}

function closeReminderModal() {
    document.getElementById('reminderModal').style.display = 'none';
}

function addCareReminder() {
    const type = document.getElementById('reminderType').value;
    const plantName = document.getElementById('reminderPlant').value.trim();
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    
    if (!plantName || !date || !time) {
        alert('请填写完整信息哦~');
        return;
    }
    
    const dateTime = new Date(`${date}T${time}`);
    careReminder.addReminder(type, plantName, dateTime.toISOString());
    
    addMessage('bot', `✅ 已为你设置提醒！\n${type === 'water' ? '💧 浇水' : '🌿 施肥'}提醒：${plantName}\n时间：${date} ${time}`);
    
    closeReminderModal();
    document.getElementById('reminderPlant').value = '';
    document.getElementById('reminderDate').value = '';
    document.getElementById('reminderTime').value = '';
}

function addMessage(sender, content) {
    const messagesContainer = document.getElementById('aiChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    
    const avatar = sender === 'bot' ? '🌸' : '👤';
    messageDiv.innerHTML = `
        <div class="ai-avatar">${avatar}</div>
        <div class="ai-message-content">${content.replace(/\n/g, '<br>')}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function checkDueReminders() {
    careReminder.getReminders();
    const dueReminders = careReminder.checkReminders();
    
    if (dueReminders.length > 0) {
        dueReminders.forEach(reminder => {
            const typeText = reminder.type === 'water' ? '💧 浇水' : '🌿 施肥';
            alert(`🌸 温馨提醒\n${typeText}时间到啦！\n记得给 ${reminder.plantName} ${reminder.type === 'water' ? '浇水' : '施肥'}哦~`);
            careReminder.markAsNotified(reminder.id);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkDueReminders();
    
    setInterval(checkDueReminders, 60000);
    
    document.getElementById('aiInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendAiMessage();
        }
    });
});