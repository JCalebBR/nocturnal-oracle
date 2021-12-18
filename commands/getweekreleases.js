const { pngs } = require("../config.json");
const luxon = require("luxon");

module.exports = {
    name: "getweekreleases",
    aliases: ["w", "week"],
    args: false,
    guildOnly: true,
    description: "Gets all release(s) from the current or next week",
    usage: "<week>",
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

        let week = now.weekNumber;
        if (!args.length) embed.title += `Releases for this week!`;
        else if (args.join() === "next") {
            embed.title += `Releases for next week!`;
            week += 1;
        }
        else if (args.join() === "after") {
            embed.title += `Releases in two weeks!`;
            week += 2;
        } else return message.reply("Invalid arguments!");

        await releases.findAll({ where: { week: week, year: now.toObject().year }, order: [["type", "ASC"], ["band", "ASC"]] })
            .then(data => {
                if (!data.length) embed.description += `No releases found!`;
                else {
                    data.forEach((release, index) => {
                        release = release.dataValues;

                        let date = luxon.DateTime.fromFormat(release.date, "d/L/yyyy");

                        embed.description += `${index + 1}. ${release.type.capitalize()} | ${release.band} | ${release.title} | ${date.toFormat("ccc, LLL dd")}\n`;
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