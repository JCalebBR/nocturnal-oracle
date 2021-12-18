const { pngs } = require("../config.json");
const luxon = require("luxon");
const Sequelize = require("sequelize");

module.exports = {
    name: "getalbuminfo",
    aliases: ["album", "alb"],
    args: true,
    guildOnly: true,
    description: "Gets available album info",
    usage: "<band name> - <track>",
    admin: false,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const type = "album";
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();

        let embed = {
            color: 0xff0000,
            description: "",
            title: "",
            author: { icon_url: pngs.oracle.avatar },
            fields: [],
            thumbnail: { url: "" }
        };

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

        await releases.findAll({ where: whereClause, })
            .then(data => {
                if (!data.length) {
                    embed.description += `No releases found!`;
                } else {
                    data.forEach(release => {
                        release = release.dataValues;

                        let date = luxon.DateTime.fromFormat(release.date, "d/L/yyyy");
                        embed.title += `${release.type.toUpperCase()}: ${release.band} - ${release.title}`;
                        embed.description += `**Release Date:** ${date.toFormat("cccc, LLLL dd, yyyy")}\n`;
                        embed.thumbnail.url += release.artwork || pngs.oracle.avatar;
                        if (release.tracklist) {
                            embed.description += `\n**Tracklist:**\n${release.tracklist.replace("Tracklist:", "").trim()}`;
                        }
                    });
                }
            })
            .catch(Log.error);
        return message.reply({ embeds: [embed] });
    }
};