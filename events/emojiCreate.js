const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const logger = require("../modules/Logger");

module.exports = async (client, emoji) => {

	logger.debug("Event file reached");
	const guildID = emoji.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.EMOJI_CREATE.enabled;
	const logChannelID = settings.logs.EMOJI_CREATE.logChannelID;
	if (!logEnabled || !logChannelID) return;
	const fetchedLogs = await emoji.guild.fetchAuditLogs({
		limit: 1,
		type: "EMOJI_CREATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("New Emoji Created")
		.setDescription(`**Executor:** ${executor.tag}\n**Emoji:** ${emoji.name} (${emoji.id})\n**Animated:** ${emoji.animated}`)
		.setThumbnail(emoji.url)
		.setTimestamp();

	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
