const Sequelize = require("sequelize");

module.exports = {
    name: "addartwork",
    aliases: ["aart", "addart"],
    args: true,
    guildOnly: true,
    description: "Adds artwork to a release",
    usage: "<band name> - <release title> - <album | ep | track>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log, argsRaw) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const type = data.split("-")[2].trim();
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();
        const artwork = message.attachments.first() ? message.attachments.first().url : null;
        if (!artwork) return message.reply("You didn't upload the artwork!");

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

        await releases.update({ artwork: artwork }, { where: whereClause })
            .then((data) => {
                message.reply(`Artwork registered!\nArtwork: \`${data.artwork || artwork}\``);
            })
            .catch(Log.error);
    }
};