const WomboDream = require("dream-api");
const { promptFailureEmbedOnSlash } = require("../modules/functions");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
	const args = interaction.options._hoistedOptions;
	if (!args[0]) {
		promptFailureEmbedOnSlash(
			interaction, 
			"You need to provide a prompt. \n\
            **Command Usage:** `/dream [prompt]`"
		);
	} else {
		await interaction.deferReply();
		const text = args[0].value;
		WomboDream.generateImage(1, text).then(image => {
			interaction.editReply(image.result.final);
		});
	}
	
};

exports.commandData = {
	name: "dream",
	description: "Generates an image using AI from Wombo Dream.",
	options: [
		{
			"name": "prompt",
			"description": "This word/phrase will be a prompt used to generate the image using AI from Wombo Dream.",
			"type": 3,
			"required": false
		}
	],
	defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	permLevel: "User",
	guildOnly: true
};