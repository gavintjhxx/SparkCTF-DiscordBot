const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");

module.exports = async (client, guildMember) => {
	const guildID = guildMember.guild.id;
	const settings = await guildSettings.findOne({ guildID: guildID });
	const logEnabled = settings.logs.GUILD_MEMBER_REMOVE.enabled;
	const logChannelID = settings.logs.GUILD_MEMBER_REMOVE.logChannelID;
	if (!logEnabled || !logChannelID) return;

	const user = `${guildMember.user.tag} (${guildMember.user.id})`;
	const joinedAt = guildMember.joinedAt;
	
	const logEmbed = new MessageEmbed()
		.setColor("#FFA700")
		.setTitle("Member Left")
		.setDescription(`**User:** ${user}\n**Member Joined At:** ${joinedAt}`)
		.setThumbnail(guildMember.user.avatarURL())
		.setTimestamp();
	client.channels.cache.get(logChannelID).send({ embeds: [ logEmbed ]});
    
};
