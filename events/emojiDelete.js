const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, emoji) => {
	const guildID = emoji.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.EMOJI_DELETE.enabled;
	const logChannelID = settings.logs.EMOJI_DELETE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	const fetchedLogs = await emoji.guild.fetchAuditLogs({
		limit: 1,
		type: "EMOJI_DELETE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Emoji Deleted")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**Emoji:** ${emoji.name} (${emoji.id})\n**Animated:** ${emoji.animated}`)
		.setThumbnail(emoji.url)
		.setTimestamp();

	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
