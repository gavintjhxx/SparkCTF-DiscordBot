const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed, awaitReply } = require("../modules/functions");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);
	// command goes here
	if (!args[0]) {
		return promptFailureEmbed(
			message,
			`You need to specify a message to match.\n\
            **Command Usage:** \`${settings.prefix}nuke [message]\``
		);
	} else {
		const matcher = args.slice(0).join(" ");
		const filteredMessages = await message.channel.messages.fetch().then(m => m.filter(m => m.content.includes(matcher)));
		const messageAuthors = [...new Set(filteredMessages.map(m => m.author.id))];

		const response = await awaitReply(message, `Are you sure you want to nuke ${messageAuthors.length} users? (y/n)\n\`\`\`${messageAuthors}\`\`\``);
		if (response == "y") {
			const m = await message.channel.send("***Nuking...***");
			// nuke
			const banSuccessful = [];
			messageAuthors.forEach((authorID) => {
				message.guild.members.cache.get(authorID).ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: "Anti-Raid | Nuked by an administrator." }).then(() => {
					banSuccessful.push(authorID);
				});
			});

			await m.delete();
			const bannedList = banSuccessful.map(id => `<@${id}>`).join(" ");

			const nukeConfirmationEmbed = new MessageEmbed()
				.setColor("FA8072")
				.setTitle("🔨 Nuke Successful")
				.setDescription(`Nuke completed. ${banSuccessful.length}/${messageAuthors.length} members banned successfully.\nMembers who aren't banned may have higher permissions than I do, so they cannot be banned.\n\n**Banned:**\n${bannedList}`);
			message.channel.send({ embeds: [ nukeConfirmationEmbed ]});
		} else if (response == "n") {
			// cancel
			return promptSuccessEmbed(message, "Got it. Nuke cancelled.");
		} else {
			// invalid response
			return promptFailureEmbed(message, "Invalid response. Nuke cancelled.");
		}
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
	name: "nuke",
	category: "Anti-Raid",
	description: "Deletes all messages matching the contents in the command trigger and bans the users who sent them.",
	usage: "nuke [match]"
};