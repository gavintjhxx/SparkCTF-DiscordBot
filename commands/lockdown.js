const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const { getGuildDB, defaultDB, promptFailureEmbed, promptSuccessEmbed, getChannel } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild) ? await getGuildDB(message.guild) : await defaultDB(message.guild);
	const currentPrefix = settings.prefix;
	const mode = args[0];

	if (!mode) {
		return promptFailureEmbed(
			message,
			`You need to specify a mode.\n\
			**Command Usage:** \`${currentPrefix}lockdown [mode] (param)\`
            **Command Types:**\n\
            \`on (message)\` - Enable lockdown\n\
            \`off (message)\` - Disable lockdown\n\
            \`settings (type) (channel)\` - Configure settings for lockdown`
		);
	} else {
        
		if (mode == "on") {
			if (!settings.lockdown) {
				return promptFailureEmbed(
					message,
					`Lockdown is not yet configured for this server.\n\
                    Configure the lockdown settings using \`${currentPrefix}lockdown settings add [channel]\``
				);
			} else {

				let lockdownMessage;
				args[1] ? lockdownMessage = args.slice(1).join(" ") : lockdownMessage = "This lockdown was initiated by an administrator. Please wait for the lockdown to be lifted.";
				const lockdownEmbed = new MessageEmbed()
					.setColor("FA8072")
					.setTitle("🔒 Lockdown Initiated")
					.setDescription(lockdownMessage);

				const channelsToLock = settings.lockdown.channels;
				channelsToLock.forEach(channel => { 
					const channelID = channel.channelID;
					try {
						const channel = message.guild.channels.cache.get(channelID);
						channel.permissionOverwrites.create(message.guild.roles.everyone, { SEND_MESSAGES: false });
						channel.send({ embeds: [ lockdownEmbed ]});
					} catch (err) {
						promptFailureEmbed(message, `An error occurred while trying to lockdown <#${channelID}> (\`${channelID}\`)`);
						console.log(err);
					}
				});
			}
		} else if (mode == "off") {
			if (!settings.lockdown) {
				return promptFailureEmbed(
					message,
					`Lockdown is not yet configured for this server.\n\
                    Configure the lockdown settings using \`${currentPrefix}lockdown settings add [channel]\``
				);
			} else {

				let lockdownMessage;
				args[1] ? lockdownMessage = args.slice(1).join(" ") : lockdownMessage = "This lockdown was lifted by an administrator.";
				const lockdownEmbed = new MessageEmbed()
					.setColor("FA8072")
					.setTitle("🔓 Lockdown Lifted")
					.setDescription(lockdownMessage);

				const channelsToLock = settings.lockdown.channels;
				channelsToLock.forEach(channel => { 
					const channelID = channel.channelID;
					try {
						const channel = message.guild.channels.cache.get(channelID);
						channel.lockPermissions();
						channel.send({ embeds: [ lockdownEmbed ]});
					} catch (err) {
						promptFailureEmbed(message, `An error occurred while trying to unlock <#${channelID}> (\`${channelID}\`)`);
					}
				});
			}
		} else if (mode == "settings") {
			const type = args[1];
			if (!type) {
				const lockdownList = settings.lockdown.channels;
				let lockdownListString;
				lockdownList.length > 0 ? lockdownListString = lockdownList.map(channel => `<#${channel.channelID}>`).join(" ") : lockdownListString = "None";
				return promptFailureEmbed(
					message,
					`You need to specify a type.\n\
                    **Command Usage:** \`${currentPrefix}lockdown settings [type] (param)\`
                    **Command Types:**\n\
                    \`on (message)\` - Enable lockdown\n\
                    \`off (message)\` - Disable lockdown\n\
                    \`settings (add/remove) (channel)\` - Configure settings for lockdown
                    **Current Lockdown List:**\n\
                    ${lockdownListString}`
				);
			} else {

				const channelSpecified = args[2];
				if (!channelSpecified) {
					return promptFailureEmbed(
						message,
						`You need to specify a channel.\n\
                        **Command Usage:** \`${currentPrefix}lockdown settings [type] (param)\`
                        **Command Types:**\n\
                        \`on (message)\` - Enable lockdown\n\
                        \`off (message)\` - Disable lockdown\n\
                        \`settings (add/remove) (channel)\` - Configure settings for lockdown`
					);
				}

				if (type == "add") {
					const channel = getChannel(client, channelSpecified);
					if (!channel) {
						return promptFailureEmbed(message, "You need to specify a channel to add to the lockdown.");
					} else {
						const channelID = channel.id;
						if (!settings.lockdown) {
							await guildSettings.updateOne({ guildID: message.guild.id }, { $set: { lockdown: { channels: [ { channelID: channelID } ] } } });
							return promptSuccessEmbed(message, `Added <#${channelID}> (\`${channelID}\`) to the lockdown list.`);
						} else {
							const channels = settings.lockdown.channels;
							const channelExists = channels.find(channel => channel.channelID == channelID);
							if (channelExists) {
								return promptFailureEmbed(message, "This channel is already in the lockdown.");
							} else {
								await guildSettings.updateOne({ guildID: message.guild.id }, { $push: { "lockdown.channels": { channelID: channelID } } });
								return promptSuccessEmbed(message, `Added <#${channelID}> (\`${channelID}\`) to the lockdown list.`);
							}
						}
					}
				} else if (type == "remove") {
					const channel = getChannel(client, channelSpecified);
					if (!channel) {
						return promptFailureEmbed(message, "You need to specify a channel to remove from the lockdown.");
					} else {
						const channelID = channel.id;
						if (!settings.lockdown) {
							return promptFailureEmbed(message, "There are no channels in the lockdown.");
						} else {
							const channels = settings.lockdown.channels;
							const channelExists = channels.find(channel => channel.channelID == channelID);
							if (!channelExists) {
								return promptFailureEmbed(message, "This channel is not in the lockdown.");
							} else {
								await guildSettings.updateOne({ guildID: message.guild.id }, { $pull: { "lockdown.channels": { channelID: channelID } } });
								return promptSuccessEmbed(message, `Removed <#${channelID}> (\`${channelID}\`) from the lockdown list.`);
							}
						}
					}
				} else {
					return promptFailureEmbed(
						message,
						`Only \`add\` or \`remove\` is accepted.\n\
                        **Command Usage:** \`${currentPrefix}lockdown settings [type] (param)\`
                        **Command Types:**\n\
                        \`on (message)\` - Enable lockdown\n\
                        \`off (message)\` - Disable lockdown\n\
                        \`settings (add/remove) (channel)\` - Configure settings for lockdown`
					);
				}
			}
		} else {
			return promptFailureEmbed(
				message,
				`You need to specify a valid type.\n\
                **Command Usage:** \`${currentPrefix}lockdown settings [type] (param)\`
                **Command Types:**\n\
                \`on (message)\` - Enable lockdown\n\
                \`off (message)\` - Disable lockdown\n\
                \`settings (add/remove) (channel)\` - Configure settings for lockdown`
			);
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
	name: "lockdown",
	category: "Anti-Raid",
	description: "Locks down the entire server.",
	usage: "lockdown [mode] (param)"
};