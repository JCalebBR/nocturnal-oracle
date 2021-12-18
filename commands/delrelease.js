const Sequelize = require("sequelize");

module.exports = {
    name: "delrelease",
    aliases: ["dr", "delr"],
    args: true,
    guildOnly: true,
    description: "Deletes (a) release(s)",
    usage: "<band name> - <title of release> - <track | album | ep>",
    admin: true,
    tag: "Releases",
    async execute(message, args, releases, Log) {
        const cmd = message.content.split(" ")[0];
        const data = message.content.replace(cmd, "").trim();

        const type = data.split("-")[2].trim();
        const band = data.split("-")[0].trim();
        const title = data.split("-")[1].trim();

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
        await releases.findAll({ where: whereClause })
            .then(entries => {
                entries.forEach(async release => {
                    await release.destroy()
                        .then(message.reply("Release(s) successfully deleted!"))
                        .catch(Log.error);
                });
            });
    }
};