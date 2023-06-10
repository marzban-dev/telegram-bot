const {Telegraf} = require("telegraf");
const dotenv = require("dotenv");
const axios = require("axios");
const {CalculateRemainingTime, downloadFile, getImages, searchImages} = require("./utils");

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.use(async (ctx, next) => {
    next(ctx);
});

bot.start((ctx) => ctx.reply('Welcome'))

bot.command("israel_deadline", ctx => {
    const startDate = new Date("March 21, 2015");
    const endDate = new Date("March 21, 2040");

    const rTime = CalculateRemainingTime(startDate, endDate);

    ctx.reply(`اسراییل ${rTime.years} سال و ${rTime.months} ماه و ${rTime.days} روز آینده را نخواهد دید`)
});

bot.on("message", async (ctx) => {

    const msg = ctx.update.message.text;

    if (msg && msg.includes("عکس بفرست از") && msg.split(" ").length >= 4) {

        if (ctx.update.message.from.username === "Elliott_io") {
            ctx.reply("تو یکی زجه نزن بدبخت", {
                reply_to_message_id: ctx.message.message_id
            })
        } else {
            const query = msg.split(" ").slice(3);

            const images = await getImages({query: query.join(" "), count: 6});

            if (images.length !== 0) {
                await ctx.telegram.sendMediaGroup(ctx.chat.id, images.map(img => ({
                    media: {url: img.url},
                    type: "photo"
                })), {
                    reply_to_message_id: ctx.message.message_id
                })
            } else {
                ctx.reply("چیزی نیافتم", {
                    reply_to_message_id: ctx.message.message_id
                })
            }
        }
    }

    if (msg && msg.includes("جستجو کن") && msg.split(" ").length >= 3) {

        if (ctx.update.message.from.username === "Elliott_io") {
            ctx.reply("تو یکی زجه نزن بدبخت", {
                reply_to_message_id: ctx.message.message_id
            })
        } else {
            const query = msg.split(" ").slice(2);

            const images = await searchImages(query.join(" "));

            if (images.length !== 0) {
                await ctx.telegram.sendMediaGroup(ctx.chat.id, images.map(img => ({
                    media: {url: img.url},
                    type: "photo"
                })), {
                    reply_to_message_id: ctx.message.message_id
                })
            } else {
                ctx.reply("چیزی نیافتم", {
                    reply_to_message_id: ctx.message.message_id
                })
            }
        }
    }
})

bot.launch().then(() => console.log("Started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));