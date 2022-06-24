const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, oldGuild, newGuild) => {
	const guildID = newGuild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.GUILD_UPDATE.enabled;
	const logChannelID = settings.logs.GUILD_UPDATE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await newGuild.fetchAuditLogs({
		limit: 1,
		type: "GUILD_UPDATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	// Get changes in emoji objects
	const changes = [];
	if (oldGuild.banner !== newGuild.banner) changes.push(`**Server Banner:**\nOld: [Old Banner](${oldGuild.bannerURL()})\nNew: [New Banner](${newGuild.bannerURL()})`);
	if (oldGuild.icon !== newGuild.icon) changes.push(`**Server Icon:**\nOld: [Old Icon](${oldGuild.iconURL()})\nNew: [New Icon](${newGuild.iconURL()})`);
	if (oldGuild.name !== newGuild.name) changes.push(`**Server Name:**\nOld: ${oldGuild.name})\nNew: ${newGuild.name}`);
	if (oldGuild.ownerId !== newGuild.ownerId) changes.push(`**Server Owner:**\nOld: <@${oldGuild.ownerId}> (${oldGuild.ownerId})\nNew: <@${newGuild.ownerId}> (${newGuild.ownerId})`);
	if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) changes.push(`**Server Rules Channel:**\nOld: <#${oldGuild.rulesChannelId}> (${oldGuild.rulesChannelId})\nNew: <#${newGuild.rulesChannelId}> (${newGuild.rulesChannelId})`);
	if (oldGuild.partnered !== newGuild.partnered) changes.push(`**Server Partnered:**\nOld: ${oldGuild.partnered})\nNew: ${newGuild.partnered}`);
	if (oldGuild.verified !== newGuild.verified) changes.push(`**Server Verified:**\nOld: ${oldGuild.verified})\nNew: ${newGuild.verified}`);
	
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Server Updated")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n\n**__Changes:__**\n${changes.join("\n")}`)
		.setThumbnail(newGuild.url)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
