const TelegramApi = require('node-telegram-bot-api');

const token = '5638005118:AAHXtppZdz9w2MoGgRWliZkpKo0ytRMnCmU';
const bot = new TelegramApi(token, {polling: true});
const game = [];
const {gameOptions, gameAgain} = require('./options');

const startGame = async (chatid) => {
    await bot.sendMessage(chatid, "Я загадаю число от 1 до 10, а ты попробуй угадать", gameOptions);
    game[chatid] = randomNum(0, 10);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/start2', description: 'Приветствие2'},
    ])
    
    bot.on('message', async msg => {
        switch(msg.text) {
            case '/start': {
                bot.sendMessage(msg.chat.id, 'Старт');
                break;
            }
            case '/random': {
                bot.sendMessage(msg.chat.id, `${Math.random()}`);
                break;
            }
            case '/game': {
                startGame(msg.chat.id);
                break;
            }
            default: {
                return await bot.sendMessage(msg.chat.id, 'Я тебя не понимаю');
            }
        }
        
    })
    bot.on("callback_query", async (msg) => {
        if(msg.data == 'again') {
            return startGame(msg.message.chat.id);
        }
        if(game[msg.message.chat.id] == msg.data) {
            return await bot.sendMessage(msg.message.chat.id, "Ты угадал!");
        } else {
            return await bot.sendMessage(msg.message.chat.id, "Ты проиграл", gameAgain)
        }
    })
}

start();

function randomNum(min, max) {
    let range = max-min+1;
    return parseInt(Math.random()*range);
}
