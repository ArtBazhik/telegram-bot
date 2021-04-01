require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db')
const bot = require('./telegrambot')

app.use(express.json());
app.use(require("cors")());

let chatId;
bot.on('message', async (msg) => {
    chatId = msg.chat.id
})

// Routing
app.post("/api/users", async (req, res) => {
    const {username, email, dateBorn, telNumber} = req.body;

    const newUser = await db.query(
        "INSERT INTO users (username, email, tel_number, date_born) values ($1, $2, $3, $4) RETURNING *",
        [username, email, telNumber, dateBorn]
    );
    const user = newUser.rows[0]
    res.json({
        message: `Создан пользователь ${user.username}`
    });

    // Отправка боту сообщение о создании пользователя
    try{
        bot.sendMessage(chatId, `Добавился пользователь с id: ${user.id}`)
    } catch (error) {
        throw new error
    }
});
app.get("/api/users", async (req, res) => {
    const users = await db.query("SELECT * FROM users");
    res.json(users.rows);

});


// Use Bot
// Описание бота
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `Бот отслеживает созданных пользователей.
        /help - описание,
        /allusers - получить количество пользователей в БД
        /43 - ведите id пользователя для получения информации
        `
    );
});
// Получение ботом количество пользователей по команда /allusers
bot.onText(/\/alluser/, async (msg) => {

    // Запрос в БД для получение всех пользователей
    const users = await db.query("SELECT * FROM users")
    const allUsers = [...users.rows]

    // Отправляем сообщение боту о количестве пользователей
    await bot.sendMessage(msg.chat.id, `Всего пользователей: ${allUsers.length}`)
})

// По команде бота /<id пользователя> предоставляем инфо о пользователе
bot.on('text', async (msg) => {
    let msgString = await msg.text.substring(1)
    let userId = +msgString

    if (userId) {
        // Запрос в БД для получения инфо о пользователе по id
        const user = await db.query(`
            SELECT * FROM users WHERE id=${userId}
        `)
        const sendUser = user.rows[0]

        //Возвращяем боту инфо о пользователе
        await bot.sendMessage(msg.chat.id, `
        Username: ${sendUser.username},
        Email: ${sendUser.email},
        Telephone: ${sendUser.tel_number},
        Born: ${sendUser.date_born}
        `)
    }

})

// Прослушка порта на сервере
app.listen(port, () => console.log(`Server has been started on ${port} port`));

