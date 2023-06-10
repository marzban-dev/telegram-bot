// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const { CalculateRemainingTime } = require("../utils");
dotenv.config();

process.env.NTBA_FIX_319 = "test";

// bot.start((ctx) => ctx.reply("Welcome"));

// bot.command("test", async (ctx) => {
//     ctx.reply("test");
// });

// bot.on("message", async (ctx) => {
//     await ctx.reply("some message");
// });

module.exports = async (request, response) => {
    try {
        const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

        if (request.body && request.body.message) {
            // Retrieve the ID for this chat
            // and the text that the user sent
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
        }
    } catch (error) {
        // can log it into the Vercel console
        console.log(error);
        console.error("Error sending message");
    }

    response.send("ok");
};

// export async function handleTestCommand(ctx: TelegrafContext) {
//   const COMMAND = "/test"
//   const { message } = ctx

//   let reply = "Hello there! Awaiting your service"

//   const didReply = await ctx.reply(reply, {
//     reply_to_message_id: message?.message_id,
//   })

//   if (didReply) {
//     console.log(`Reply to ${COMMAND} command sent successfully.`)
//   } else {
//     console.error(
//       `Something went wrong with the ${COMMAND} command. Reply not sent.`
//     )
//   }
// }

// export async function handleOnMessage(ctx: TelegrafContext) {
//   const { message } = ctx

//   const isGroup =
//     message?.chat.type === "group" || message?.chat.type === "supergroup"

//   if (isGroup) {
//     await ctx.reply("This bot is only available in private chats.")
//     return
//   }

//   const telegramUsername = message?.from?.username
//   const reply = "a message was sent"

//   await ctx.reply(reply, {
//     reply_to_message_id: message.message_id,
//   })
// }
