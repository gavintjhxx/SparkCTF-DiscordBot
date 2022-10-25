const guildSettings = require("../models/guildSettings");

module.exports = async (client, messageReaction, user) => {
	if (user.bot) return;
	const guild = messageReaction.message.guild;
	const settings = await guildSettings.findOne({ 
		guildID: guild.id
	});
	const reactionRole = settings.reactionRoles.roles.filter((rr) => {
		return rr.messageID === messageReaction.message.id && rr.emoji === messageReaction.emoji.name;
	});
	if (!settings || !settings.reactionRoles || !reactionRole || !(reactionRole.length > 0)) return;

	const role = guild.roles.cache.get(reactionRole[0].roleID);
	const member = guild.members.cache.get(user.id);
	member.roles.remove(role);
};