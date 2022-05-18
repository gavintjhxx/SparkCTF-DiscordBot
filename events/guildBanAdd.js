const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, guildBan) => {
	const guildID = guildBan.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.GUILD_BAN_ADD.enabled;
	const logChannelID = settings.logs.GUILD_BAN_ADD.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await guildBan.fetchAuditLogs({
		limit: 1,
		type: "GUILD_BAN_ADD",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const user = `${guildBan.user.tag} (${guildBan.user.id})`;
	const reason = guildBan.reason ? guildBan.reason : "(No reason specified)";
	
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Member Banned")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**User:** ${user}\n**Reason:** ${reason}`)
		.setThumbnail(guildBan.guild.url)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
