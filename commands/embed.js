const { MessageEmbed } = require("discord.js");
const { getChannel, promptFailureEmbed, getGuildDB } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
	const settings = await getGuildDB(message.guild);
	const currentPrefix = settings.prefix;

	// Check for channel presence
	const specChannel = args[0];
	if (!specChannel) return promptFailureEmbed(
		message,
		`You need to provide a channel. \n\
		**Command Usage:** \`${currentPrefix}embed [channel] [hexColor] [title], [content]\``
	);
	const channel = getChannel(client, specChannel);
	if (!channel) return promptFailureEmbed(
		message, 
		`You need to provide a valid channel.\n\
		**Command Usage:** \`${currentPrefix}embed [channel] [hexColor] [title], [content]\``
	);
	// Check for content presence
	const embedColor = args[1].replace("#", "");
	const params = args.slice(2).join(" ").split(", ");
	const title = params[0];
	params.shift(); // Remove first element of params (title), returning content
	const content = params.join(" ");
	if (!content) return promptFailureEmbed(
		message,
		`You need to provide contents to send into the embed. \n\
		**Command Usage:** \`${currentPrefix}embed [channel] [hexColor] [title], [content]\``
	);
	const embed = new MessageEmbed()
		.setColor(`#${embedColor}`)
		.setTitle(title)
		.setDescription(content);
	// Send embed
	message.guild.channels.cache.get(channel.id).send({ embeds: [ embed ]});

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
	name: "embed",
	category: "Miscellaneous",
	description: "Send an embed into a specified channel with the specified content.",
	usage: "embed [channel] [hexColor] [title], [content]"
};