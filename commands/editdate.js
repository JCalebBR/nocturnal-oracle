const luxon = require("luxon");
const Sequelize = require("sequelize");

module.exports = {
    name: "editdate",
    aliases: ["edt", "editdt"],
    args: true,
    guildOnly: true,
    description: "Adds a track/single",
    usage: "<band name> - <release title> - <album | track | EP>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const type = data.split("-")[2].trim();
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();

        const whereClause = {
            [Sequelize.Op.and]: [
                Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("type")), { [Sequelize.Op.like]: `%${type}%` },
                ), Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("title")), { [Sequelize.Op.like]: `%${title}%` },
                ), Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("band")), { [Sequelize.Op.like]: `%${band}%` },
                )
            ]
        };

        message.reply("Please send a message/reply with the new date!").then(async () => {
            const filter = m => message.author.id === m.author.id;
            await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ["time"] })
                .then(async messages => {
                    const rawDate = messages.first().content
                        .replace(/(\d+)(st|nd|rd|th)/g, "$1")
                        .replaceAll(",", "").trim();
                    const dateM = luxon.DateTime.fromFormat(rawDate, "LLLL d");
                    const dateMY = luxon.DateTime.fromFormat(rawDate, "LLLL d yyyy");
                    let date;
                    if (dateM.isValid) date = dateM;
                    else if (dateMY.isValid) date = dateMY;
                    else return message.reply("You have to provide a date for the release!\nExample: \`November 22nd, 2022\`");

                    await releases.update({
                        date: `${date.toObject().day}/${date.toObject().month}/${date.toObject().year}`,
                        week: date.weekNumber,
                        month: date.toObject().month,
                        year: date.toObject().year,
                    }, { where: whereClause })
                        .then((data) => {
                            message.reply(`Release date updated!\nNew Date: \`${data.date || `${date.toObject().day}/${date.toObject().month}/${date.toObject().year}`}\``);
                        })
                        .catch(Log.error);
                })
                .catch(() => {
                    message.reply(`You didn't reply! Update canceled :(`);
                });
        });





    }
};