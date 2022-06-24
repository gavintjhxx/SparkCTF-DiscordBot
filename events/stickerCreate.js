const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, sticker) => {

	const guildID = sticker.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.STICKER_CREATE.enabled;
	const logChannelID = settings.logs.STICKER_CREATE.logChannelID;
	if (!logEnabled || !logChannelID) return;
	const fetchedLogs = await sticker.guild.fetchAuditLogs({
		limit: 1,
		type: "STICKER_CREATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("New Sticker Created")
		.setDescription(`**Executor:** ${executor.tag}\n**Sticker:** ${sticker.name} (${sticker.id})`)
		.setThumbnail(sticker.url)
		.setTimestamp();

	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
