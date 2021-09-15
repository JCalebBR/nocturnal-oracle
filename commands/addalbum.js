const luxon = require("luxon");

module.exports = {
    name: "addalbum",
    aliases: ["aalb", "addalb"],
    args: true,
    guildOnly: true,
    description: "Adds an album",
    usage: "<band name> - <album title> - <release date>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const type = "album";
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();
        const rawDate = data.split("-")[2]
            .replace(/(\d+)(st|nd|rd|th)/g, "$1")
            .replaceAll(",", "").trim();
        const dateM = luxon.DateTime.fromFormat(rawDate, "LLLL d");
        const dateMY = luxon.DateTime.fromFormat(rawDate, "LLLL d yyyy");

        let date;

        if (dateM.isValid) {
            date = dateM;
        } else if (dateMY.isValid) {
            date = dateMY;
        } else {
            return message.reply("You have to provide a date for the release!\nExample: \`November 22nd, 2022\`");
        }

        await releases.create({
            type: type,
            title: title,
            band: band,
            date: `${date.toObject().day}/${date.toObject().month}/${date.toObject().year}`,
            week: date.weekNumber,
            month: date.toObject().month,
            year: date.toObject().year,
        })
            .then(data => {
                message.reply(`Album data registered!\nThis is what I got from you: \`${data.band}\`,\`${data.title}\`,\`${data.date}\``);
            })
            .catch(Log.error);
    }
};