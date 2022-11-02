const { exec } = require("child_process");
const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);
	await promptSuccessEmbed(message, "***Restarting...***```js\nsudo systemctl restart zlotherino```");
	exec("sudo systemctl restart zlotherino.service", async (error, stdout) => {
		if (error) return promptFailureEmbed(message, "```js\n" + error + "```");
		return promptSuccessEmbed(message, `***Pulled from master branch.***\n\`\`\`js\n${stdout}\`\`\`\nA restart of the bot is required to apply the changes. (\`${settings.prefix}reboot\`)`);
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
