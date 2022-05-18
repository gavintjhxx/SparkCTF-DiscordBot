const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, oldMember, newMember) => {
	const guildID = newMember.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.GUILD_MEMBER_UPDATE.enabled;
	const logChannelID = settings.logs.GUILD_MEMBER_UPDATE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	// Audit Log Stuff
	const fetchedLogs = await newMember.guild.fetchAuditLogs({
		limit: 1,
		type: "GUILD_MEMBER_UPDATE",
	});
	const firstLog = fetchedLogs.entries.first();
	let executor;
	firstLog ? { executor } = firstLog : executor = "(Unknown)";

	const user = `${newMember.user.tag} (${newMember.user.id})`;

	// Get changes in emoji objects
	const changes = [];
	
	if (oldMember.nickname !== newMember.nickname) changes.push(`**Nickname:** \`${oldMember.nickname}\` to \`${newMember.nickname}\``);
	/* Use Voice State event instead */
	// if (oldMember.voice.selfDeaf != newMember.voice.selfDeaf) changes.push(`**VC | Self Deafened:** \`${oldMember.voice.selfDeaf}\` to \`${newMember.voice.selfDeaf}\``);
	// if (oldMember.voice.serverDeaf != newMember.voice.serverDeaf) changes.push(`**VC | Server Deafened:** \`${oldMember.voice.serverDeaf}\` to \`${newMember.voice.serverDeaf}\``);
	// if (oldMember.voice.selfMute != newMember.selfMute) changes.push(`**VC | Self Muted:** \`${oldMember.voice.selfMute}\` to \`${newMember.voice.selfMute}\``);
	// if (oldMember.voice.serverMute != newMember.serverMute) changes.push(`**VC | Server Muted:** \`${oldMember.voice.serverMute}\` to \`${newMember.voice.serverMute}\``);
	// if (oldMember.voice.selfVideo != newMember.selfVideo) changes.push(`**VC | Video Camera On:** \`${oldMember.voice.selfVideo}\` to \`${newMember.voice.selfVideo}\``);
	// if (oldMember.voice.streaming != newMember.streaming) changes.push(`**VC | Streaming:** \`${oldMember.voice.streaming}\` to \`${newMember.voice.streaming}\``);
	if (oldMember.roles !== newMember.roles) {
		const roles = newMember.roles.cache.difference(oldMember.roles.cache);
		changes.push(`**Roles:** ${roles.map(r => `${r}`).join("\n")}`);
	}

	// console.log(changes);
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Member Updated")
		.setDescription(`**Executor:** ${executor.tag} (${executor.id})\n**User:** ${user}\n\n**__Changes:__**\n${changes.join("\n")}`)
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
