const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, oldEmoji, newEmoji) => {
	const guildID = newEmoji.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.EMOJI_UPDATE.enabled;
	const logChannelID = settings.logs.EMOJI_UPDATE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await newEmoji.guild.fetchAuditLogs({
		limit: 1,
		type: "EMOJI_UPDATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	// Get changes in emoji objects
	const changes = [];
	if (oldEmoji.name !== newEmoji.name) changes.push(`**Name:** \`${oldEmoji.name}\` to \`${newEmoji.name}\``);

	// console.log(changes);
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Emoji Updated")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**Emoji:** ${newEmoji.name} (${newEmoji.id})\n\n**__Changes:__**\n${changes.join("\n")}`)
		.setThumbnail(newEmoji.url)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
