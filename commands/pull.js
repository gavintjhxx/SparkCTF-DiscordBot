const { exec } = require("child_process");
const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);
	// command goes here
	await promptSuccessEmbed(message, "***Pulling from main branch...***");
	exec("git pull origin main", async (error, stdout) => {
		if (error) return promptFailureEmbed(message, "```js\n" + error + "```");
		return promptSuccessEmbed(message, `***Pulled from main branch.***\n\`\`\`js\n${stdout}\`\`\`\nA restart of the bot is required to apply the changes. (\`${settings.prefix}reboot\`)`);
	});
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Bot Owner"
};

exports.help = {
	name: "pull",
	category: "System",
	description: "Pulls the latest updates from the github repository.",
	usage: "pull"
};
