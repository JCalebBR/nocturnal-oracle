module.exports = {
    name: "ping",
    aliases: [],
    args: false,
    guildOnly: true,
    description: "",
    usage: "",
    tag: "Misc",
    execute(message) {
        message.reply("pong!");
    }
};