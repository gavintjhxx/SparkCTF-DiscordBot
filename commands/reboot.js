const { exec } = require("child_process");
const { promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	await promptSuccessEmbed(message, "***Restarting...***");
	exec("sudo systemctl restart zlotherino.service", async (error) => {
		if (error) return promptFailureEmbed(message, "```js\n" + error + "```");
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["restart"],
	permLevel: "Bot Admin"
};

exports.help = {
	name: "reboot",
	category: "System",
	description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
	usage: "reboot"
};
