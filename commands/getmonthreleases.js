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
        let year = now.year;
        if (!args.length) {
            embed.title += `Releases for this month!`;
        } else {
            const monthDate = luxon.DateTime.fromFormat(`${args[0]}`, "LLLL");
            const monthYearDate = luxon.DateTime.fromFormat(`${args[0].replaceAll(",", "")}, ${args[1]}`, "LLLL, yyyy");

            if (monthDate.isValid) {
                month = monthDate.month;
                embed.title += `Releases for ${monthDate.toFormat("LLLL")}`;
            } else if (monthYearDate.isValid) {
                month = monthYearDate.month;
                year = monthYearDate.year;
                embed.title += `Releases for ${monthYearDate.toFormat("LLLL, yyyy")}`;
            }
        }
        await releases.findAll({
            where: { month: month, year: year },
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