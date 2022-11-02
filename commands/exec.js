const { exec } = require("child_process");
const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);
	// command goes here
	if (!args[0]) return promptFailureEmbed(
		message,
		`You need to provide a command to execute. \n\
		**Command Usage:** \`${settings.prefix}exec [command]\`\n`
	);
	const command = args.slice(0).join(" ");
	exec(command, (error, stdout) => {
		if (error) return promptFailureEmbed(message, "```js\n" + error + "```");
		else 
		{
			return promptSuccessEmbed(message, "```js\n" + stdout + "```");
		}
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
	name: "exec",
	category: "System",
	description: "Executes commands in the console.",
	usage: "exec [command]"
};