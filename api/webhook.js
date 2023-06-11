const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const { CalculateRemainingTime, Health } = require("../utils");
dotenv.config();

process.env.NTBA_FIX_319 = "test";

module.exports = async (request, response) => {
    try {
        const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

        if (request.body && request.body.message) {
            const {
                chat: { id, type },
                text,
            } = request.body.message;

            console.log(request.body);

            if (type === "group" || type === "supergroup") {
            }

            if (text.includes("/israel_deadline")) {
                const startDate = new Date("March 21, 2015");
                const endDate = new Date("March 21, 2040");

                const rTime = CalculateRemainingTime(startDate, endDate);

                const message = `اسراییل ${rTime.years} سال و ${rTime.months} ماه و ${rTime.days} روز آینده را نخواهد دید`;
                await bot.sendMessage(id, message, { parse_mode: "Markdown" });
            }

            if (text.includes("/israel_health")) {
                const health = Health();
                await bot.sendMessage(id, health, { parse_mode: "Markdown" });
            }
        }
    } catch (error) {
        // can log it into the Vercel console
        console.log(error);
        console.error("Error sending message");
    }

    response.send("ok");
};
