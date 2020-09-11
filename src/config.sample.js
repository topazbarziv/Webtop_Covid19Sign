module.exports = {
    // Important for autoRemind when you run the code on a server that outside of Israel.
    "timezone": "Asia/Jerusalem",

    //"telegram": false, // You can disable the telegram bot notifications and thats going to make "cronMode = true"
    "telegram": {
        // You can create a telegram bot for free: https://t.me/BotFather. Read more: https://core.telegram.org/bots
        "apiKey": ""
    },

    // Enter your smartschool username and password. This information remains only on your computer.
    "smartschool": {
        "username": "",
        "password": ""
    },
    
    //"messages": false, // DANGER: This will allow anyone to send a "/sign" command to the bot.
    "messages": {
        // You must type your telegram chat id. You can send "/chatid" command to the bot and it will reply you the chatid.
        "chatId": "",

        // true - The bot will ask you every day at the time autoRemindTime if you want to sign today.
        "autoRemind": true,
        "autoRemindTime": "18:53" // 24 hours clock. Format: HH:mm.
    },

    // You can put this code to run automatically by cron. 
    // Read about cron: https://en.wikipedia.org/wiki/Cron
    // true - This will disable the autoRemind at telegram message and will sign automatically when the code run.
    // false - Will sign only when you send the command "/sign" to your telegram bot.
    "cronMode": false
}