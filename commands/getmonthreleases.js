const { pngs } = require("../config.json");
const luxon = require("luxon");

module.exports = {
    name: "getmonthreleases",
    aliases: ["m", "month"],
    args: false,
    guildOnly: true,
    description: "Gets all release(s) from the current or a specific month",
    usage: "<month number or name>",
    admin: false,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const now = luxon.DateTime.now();

        let embed = {
            color: 0xff0000,
            description: "",
            title: "",
            author: { icon_url: pngs.oracle.avatar },
            fields: [],
            thumbnail: { url: pngs.oracle.avatar }
        };
        let month = now.month;
        if (!args.length) {
            embed.title += `Releases for this month!`;
        } else {
            args = args.join();
            if (parseInt(args)) {
                month = luxon.DateTime.fromFormat(args, "L").month;
                embed.title += `Releases for ${luxon.DateTime.fromFormat(args, "L").toFormat("LLLL")}`;
            } else {
                month = luxon.DateTime.fromFormat(args, "LLLL").month;
                embed.title += `Releases for ${luxon.DateTime.fromFormat(args, "LLLL").toFormat("LLLL")}`;
            }
        }
        await releases.findAll({
            where: { month: month, year: now.toObject().year },
            order: [["type", "ASC"], ["band", "ASC"]]
        })
            .then(data => {
                if (!data.length) embed.description += `No releases found!`;
                else {
                    data.forEach((release, index) => {
                        release = release.dataValues;

                        let date = luxon.DateTime.fromFormat(release.date, "d/L/yyyy");

                        embed.description += `${index + 1}. ${release.type.capitalize()} | ${release.band} | ${release.title} | ${date.toFormat("ccc, dd")}\n`;
                    });
                }
            })
            .catch(Log.error);
        return message.reply({ embeds: [embed] });
    }
};

// @ts-ignore
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};