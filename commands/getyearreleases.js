const { pngs } = require("../config.json");
const luxon = require("luxon");

module.exports = {
    name: "getyearreleases",
    aliases: ["y", "year"],
    args: false,
    guildOnly: true,
    description: "Gets all release(s) from the current or a specific year",
    usage: "<year>",
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

        let year = now.year;
        if (!args.length) embed.title += `Releases for this year!`;
        else {
            args = args.join();
            if (parseInt(args)) {
                year = luxon.DateTime.fromFormat(args, "yyyy").year;
                embed.title += `Releases for ${luxon.DateTime.fromFormat(args, "yyyy").toFormat("yyyy")}`;
            } else return message.reply("That isn't a valid year!");
        }

        await releases.findAll({ where: { year: year }, order: [["type", "ASC"], ["band", "ASC"]] })
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