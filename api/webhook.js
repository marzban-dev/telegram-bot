const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const { CalculateRemainingTime, Health } = require("../utils");
const axios = require("axios").default;
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

            if (text.includes("هوای")) {
                const city = text.split(" ")[1];

                const response = await axios.get(
                    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_APT_TOKEN}&q=${city}&aqi=no`
                );

                if (response.status === 400) {
                    await bot.sendMessage(id, "مکان یافت نشد", { parse_mode: "Markdown" });
                }

                const { location, current } = response.data;

                const message = `
                    آب و هوای شهر ${location.name} در کشور ${location.country}
                    \n
                    \n
                    وضعیت ${current.condition.text}
                    \n
                    دما ${current.temp_c} درجه سلسیوس
                    \n
                    وزش باد ${current.wind_kph} km/h
                    \n
                    رطوبت ${current.humidity} %
                    \n
                    ابر ${current.cloud} %
                `;

                await bot.sendPhoto(id, `https:${current.condition.icon}`, { caption: message });
            }
        }
    } catch (error) {
        // can log it into the Vercel console
        console.log(error);
        console.error("Error sending message");
    }

    response.send("ok");
};
