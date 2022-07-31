const WomboDream = require("dream-api");
const { promptFailureEmbed, getGuildDB } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const text = args.slice(0).join(" ");
	console.log(text);
	if (!text) { 

		const settings = await getGuildDB(message.guild);
		const currentPrefix = settings.prefix;

		promptFailureEmbed(
			message, 
			`You need to provide a prompt. \n\
            **Command Usage:** \`${currentPrefix}dream [prompt]\``
		);

	} else {
		const reply = await message.reply("***Generating...***");
		WomboDream.generateImage(1, text).then(image => {
			reply.edit(image.result.final);
		});
	}
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "dream",
	category: "Miscellaneous",
	description: "Generates an image using AI from Wombo Dream.",
	usage: "dream"
};