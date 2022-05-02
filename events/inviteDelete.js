const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, invite) => {

	const guildID = invite.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.INVITE_DELETE.enabled;
	const logChannelID = settings.logs.INVITE_DELETE.logChannelID;
	if (!logEnabled || !logChannelID) return;
	const fetchedLogs = await invite.guild.fetchAuditLogs({
		limit: 1,
		type: "INVITE_DELETE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Invite Deleted")
		.setDescription(`**Executor:** ${executor.tag}\n**Parent channel:** <#${invite.channel.id}> (${invite.channel.id})\n**Invite:** ${invite.url}`)
		.setTimestamp();

	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
