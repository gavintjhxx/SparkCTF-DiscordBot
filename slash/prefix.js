const guildSettings = require("../models/guildSettings");
const { getGuildDB, promptFailureEmbedOnSlash, promptAlertEmbedOnSlash, promptSuccessEmbedOnSlash } = require("../modules/functions");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
	const channel = await client.channels.cache.get(interaction.channelId);
	const args = interaction.options._hoistedOptions;
	const newPrefix = args[0].value;
	const settings = await getGuildDB(channel.guild);
	const currentPrefix = settings.prefix;
	// Check if prefix is provided
	if (!newPrefix) {
	
		return promptFailureEmbedOnSlash(
			interaction,
			`You need to provide a new prefix.\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	}
	// Check if prefix is 3 or less characters long
	else if (!(newPrefix.length < 4)) {

		return promptAlertEmbedOnSlash(
			interaction,
			`The prefix can only be up to \`3\` characters long!\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	} 
	// Check if new prefix is the same as current prefix
	else if (newPrefix == currentPrefix) {

		return promptFailureEmbedOnSlash(
			interaction,
			`The new prefix provided is the same as the current prefix.\n\
			**Command Usage:** \`${currentPrefix}prefix [new prefix]\``
		);

	}
	// Change prefix
	else {
		const guildID = channel.guild.id;
		await guildSettings.updateOne({ guildID: guildID }, { prefix: newPrefix });
		return promptSuccessEmbedOnSlash(interaction, `Prefix set: \`${newPrefix}\``);
	}

};

exports.commandData = {
	name: "prefix",
	description: "Change bot prefix for current server.",
	options: [
		{
			"name": "prefix",
			"description": "The new prefix for the server.",
			"type": 3,
			"required": false
		}
	],
	defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	permLevel: "Administrator",
	guildOnly: true
};