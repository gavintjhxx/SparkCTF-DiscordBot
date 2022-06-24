const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, oldSticker, newSticker) => {
	const guildID = newSticker.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.STICKER_UPDATE.enabled;
	const logChannelID = settings.logs.STICKER_UPDATE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await newSticker.guild.fetchAuditLogs({
		limit: 1,
		type: "STICKER_UPDATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	// Get changes in emoji objects
	const changes = [];
	if (oldSticker.name !== newSticker.name) changes.push(`**Name:** \`${oldSticker.name}\` to \`${newSticker.name}\``);

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Sticker Updated")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**Emoji:** ${newSticker.name} (${newSticker.id})\n\n**__Changes:__**\n${changes.join("\n")}`)
		.setThumbnail(newSticker.url)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
