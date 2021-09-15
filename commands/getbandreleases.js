const { pngs } = require("../config.json");
const luxon = require("luxon");
const Sequelize = require("sequelize");

module.exports = {
    name: "getbandreleases",
    aliases: ["b", "band"],
    args: true,
    guildOnly: true,
    description: "Gets all upcoming releases from a band",
    usage: "<band name>",
    admin: false,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const band = args.join(" ");

        let embed = {
            color: 0xff0000,
            title: "",
            description: "",
            author: { icon_url: pngs.oracle.avatar },
            fields: [],
            thumbnail: { url: "" }
        };
        const whereClause = {
            [Sequelize.Op.or]: [
                Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("band")), { [Sequelize.Op.like]: `%${band}%` }
                )
            ]
        };
        await releases.findAll({ where: whereClause })
            .then(data => {
                data.forEach((release, index) => {
                    release = release.dataValues;

                    let date = luxon.DateTime.fromFormat(release.date, "d/L/yyyy");
                    embed.description += `${index + 1}. ${release.type.capitalize()} | ${release.title} | ${date.toFormat("ccc, LLL dd, yyyy")}\n`;
                });
                embed.title += `Releases for ${data[0].dataValues.band}`;
                embed.thumbnail.url += data[0].dataValues.artwork || pngs.oracle.avatar;
            })
            .catch(Log.error);
        return message.reply({ embeds: [embed] });
    }
};

// @ts-ignore
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};