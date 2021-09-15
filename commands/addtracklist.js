const { pngs } = require("../config.json");
const luxon = require("luxon");
const Sequelize = require("sequelize");
const { Interaction } = require("discord.js");

module.exports = {
    name: "addtracklist",
    aliases: ["atl", "addtl", "uatl", "updatl", "updateatl"],
    args: true,
    guildOnly: true,
    description: "Adds a release",
    usage: "<band name> - <release title> - <album | track | ep>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const now = luxon.DateTime.now();

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

        message.reply("Please send a message/reply with the tracklist!").then(async () => {
            const filter = m => message.author.id === m.author.id;
            await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ["time"] })
                .then(async messages => {
                    const tracklist = messages.first().content.replace("Tracklist:", "").trim();
                    await releases.update({
                        tracklist: tracklist
                    }, { where: whereClause })
                        .then((data) => {
                            message.reply(`Tracklist updated!\nTracklist:\n\`\`\`${data.tracklist || tracklist}\`\`\``);
                        })
                        .catch(Log.error);
                })
                .catch(() => {
                    message.reply(`You didn't reply! Update canceled :(`);
                });
        });
    }
};