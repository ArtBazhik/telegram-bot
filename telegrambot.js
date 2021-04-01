require("dotenv").config();
const Telegram = require('node-telegram-bot-api')

const bot = new Telegram(process.env.BOT_TOKEN, {
    polling: {
        autoStart: true
    },
});

module.exports = bot;
