const guildSettings = require("../models/guildSettings");
const { getGuildDB, promptSuccessEmbed, promptFailureEmbed, promptAlertEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const newPrefix = args[0];
	const settings = await getGuildDB(message.guild);
	const currentPrefix = settings.prefix;
	// Check if prefix is provided
	if (!newPrefix) {
	
		return promptFailureEmbed(
			message,
			`You need to provide a new prefix.\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	}
	// Check if prefix is 3 or less characters long
	else if (!(newPrefix.length < 4)) {

		return promptAlertEmbed(
			message,
			`The prefix can only be up to \`3\` characters long!\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	} 
	// Check if new prefix is the same as current prefix
	else if (newPrefix == currentPrefix) {

		return promptFailureEmbed(
			message,
			`The new prefix provided is the same as the current prefix.\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	}
	// Change prefix
	else {
		const guildID = message.channel.guild.id;
		await guildSettings.updateOne({ guildID: guildID }, { prefix: newPrefix });
		return promptSuccessEmbed(message, `Prefix set: \`${newPrefix}\``);
	}
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Administrator"
};

exports.help = {
	name: "prefix",
	category: "Customization",
	description: "Change bot prefix for current server.",
	usage: "prefix [newPrefix]"
};