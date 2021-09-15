const luxon = require("luxon");

module.exports = {
    name: "addany",
    aliases: ["aany", "addr", "addrelease"],
    args: true,
    guildOnly: true,
    description: "Adds a track/single",
    usage: "<band name> - <track title> (new <album | track | EP>), <release date>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const releaseRegex = message.content.match(/\([A-Za-z ]+\)/g)[0];
        const cmd = message.content.split(" ")[0];

        const data = message.content.replace(cmd, "").trim().split("\n")[0].split(releaseRegex)[0];
        let tl = message.content.replace(cmd, "").trim().split("\n").slice(1).join("\n").replace("\n", "").trim();
        const tracklist = tl.replace("Tracklist:", "").trim() ? tl : null;

        const type = releaseRegex.split(" ")[1].replace(")", "").trim();
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();

        const rawDate = message.content.replace(cmd, "").trim().split("\n")[0].split(releaseRegex)[1]
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

        const artwork = message.attachments.first() ? message.attachments.first().url : null;
        message.reply(`Release data registered!\nThis is what I got from you: \`${type}\` \`${band}\` \`${title}\` \`${date}\` \`${artwork || artwork}\`\n\`${tracklist || tracklist}\``);

        // await releases.create({
        //     type: type,
        //     title: title,
        //     tracklist: tracklist,
        //     band: band,
        //     date: `${date.toObject().day}/${date.toObject().month}/${date.toObject().year}`,
        //     week: date.weekNumber,
        //     month: date.toObject().month,
        //     year: date.toObject().year,
        //     artwork: artwork
        // })
        //     .then(data => {
        //         message.reply(`Release data registered!\nThis is what I got from you: \`${data.type}\` \`${data.band}\` \`${data.title}\` \`${data.date}\` \`${data.artwork || artwork}\`\n\`${data.tracklist || tracklist}\``);
        //     })
        //     .catch(Log.error);

    }
};