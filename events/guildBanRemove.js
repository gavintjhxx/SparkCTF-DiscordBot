const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, guildUnban) => {
	const guildID = guildUnban.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.GUILD_BAN_REMOVE.enabled;
	const logChannelID = settings.logs.GUILD_BAN_REMOVE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await guildUnban.fetchAuditLogs({
		limit: 1,
		type: "GUILD_BAN_REMOVE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const user = `${guildUnban.user.tag} (${guildUnban.user.id})`;
	const reason = guildUnban.reason ? guildUnban.reason : "(No reason specified)";
	
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Member Unbanned")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**User:** ${user}\n**Reason:** ${reason}`)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
