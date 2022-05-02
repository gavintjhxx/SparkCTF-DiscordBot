const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const { FormatDuration } = require("../modules/FormatDuration");

module.exports = async (client, invite) => {

	const guildID = invite.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.INVITE_CREATE.enabled;
	const logChannelID = settings.logs.INVITE_CREATE.logChannelID;
	if (!logEnabled || !logChannelID) return;
	const fetchedLogs = await invite.guild.fetchAuditLogs({
		limit: 1,
		type: "INVITE_CREATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	let inviteAge;
	let maxUses;
	invite.maxAge == 0 ? inviteAge = "Forever" : inviteAge = FormatDuration(invite.maxAge*1000);
	invite.maxUses == 0 ? maxUses = "Infinite" : maxUses = invite.maxUses;

	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("New Invite Created")
		.setDescription(`**Executor:** ${executor.tag}\n**Parent channel:** <#${invite.channel.id}> (${invite.channel.id})\n**Invite:** ${invite.url}\n**Max Uses:** ${maxUses}\n**Max Age:** ${inviteAge}\n**Temporary Membership:** ${invite.temporary}`)
		.setTimestamp();

	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
