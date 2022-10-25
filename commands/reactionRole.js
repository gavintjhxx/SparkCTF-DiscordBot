const guildSettings = require("../models/guildSettings");
const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed, getRole, getEmoji } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);

	const messageLink = args[0];
	const role = args[1];
	const emojiString =  args[2];

	if (!messageLink || !role || !emojiString) return promptFailureEmbed(
		message, 
		`Please provide a message link, role, and emoji.\n\
        **Command Usage:** \`${settings.prefix}reactionrole [message link] [role] [emoji]\``
	);

	const messageLinkParams = messageLink.split("/");
	const messageChannel = messageLinkParams[5];
	const messageID = messageLinkParams[6];

	// Check if params are valid
	const channelSpecified = message.channel.guild.channels.cache.get(messageChannel);
	if (!channelSpecified) return promptFailureEmbed(
		message,
		`The message link is invalid.\n\
        **Command Usage:** \`${settings.prefix}reactionrole [message link] [role] [emoji]\``
	);
	const messageSpecified = await channelSpecified.messages.fetch(messageID);
	if (!messageSpecified) return promptFailureEmbed(
		message,
		`The message link is invalid.\n\
        **Command Usage:** \`${settings.prefix}reactionrole [message link] [role] [emoji]\``
	);
	const roleSpecified = getRole(message.guild, role);
	if (!roleSpecified) return promptFailureEmbed(
		message,
		`The role specified is invalid.\n\
        **Command Usage:** \`${settings.prefix}reactionrole [message link] [role] [emoji]\``
	);
	const emojiSpecified = getEmoji(message.guild, emojiString);
	if (!emojiSpecified) return promptFailureEmbed(
		message,
		`The emoji specified is invalid. Only use server/discord emojis.\n\
		**Command Usage:** \`${settings.prefix}reactionrole [message link] [role] [emoji]\``
	);

	// Check if reaction role already exists
	let reactionRoleExists;
	settings.reactionRoles ? reactionRoleExists = settings.reactionRoles.roles.find(role => role.messageID === messageID) : reactionRoleExists = undefined;
	if (!reactionRoleExists) {
		// Reaction role does not exist
		// Create new reaction role
		await guildSettings.updateOne({ guildID: message.guild.id }, { 
			$push: { ["reactionRoles.roles"] : { messageID: messageID, roleID: roleSpecified.id, emoji: emojiSpecified.name } }
		});
		// React with emoji
		const isServerEmoji = message.channel.guild.emojis.cache.find(emoji => emoji.name === emojiSpecified.name);
		isServerEmoji ? channelSpecified.messages.cache.get(messageID).react(isServerEmoji.id) : channelSpecified.messages.cache.get(messageID).react(emojiSpecified.name);
		// Send success message
		return promptSuccessEmbed(
			message,
			`Successfully created reaction role.\n\
			Binded reaction \`${emojiSpecified.name}\` to role <@&${roleSpecified.id}> in [message](${messageLink})`
		);
	} else {
		// Reaction role exists
		// Delete reaction role
		await guildSettings.updateOne({ guildID: message.guild.id }, { 
			$pull: { ["reactionRoles.roles"] : { messageID: messageID, roleID: roleSpecified.id, emoji: emojiSpecified.name } }
		});
		// Remove reaction
		const isServerEmoji = message.channel.guild.emojis.cache.find(emoji => emoji.name === emojiSpecified.name);
		isServerEmoji ? channelSpecified.messages.cache.get(messageID).reactions.cache.get(isServerEmoji.id).remove() : channelSpecified.messages.cache.get(messageID).reactions.cache.find(reaction => reaction.emoji.name == emojiSpecified.name).remove();
		// Send success message
		return promptSuccessEmbed(
			message,
			`Successfully deleted reaction role.\n\
			Unbinded reaction \`${emojiSpecified.name}\` to role <@&${roleSpecified.id}> in [message](${messageLink})`
		);
	}
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["rr"],
	permLevel: "User"
};

exports.help = {
	name: "reactionrole",
	category: "Server Configuration",
	description: "Configure reaction roles for the server. (Unlimited)",
	usage: "reactionrole [message link] [role] [emoji]"
};