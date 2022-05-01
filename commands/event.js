const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const { getGuildDB, getChannel, promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

const events = [
	// Miscelleneous (10-29)
	{ event: "EMOJI_CREATE", value: 10, desc: "Emitted whenever a new emoji is created in the server." },
	{ event: "EMOJI_DELETE", value: 11, desc: "Emitted whenever an emoji is deleted from the server." },
	{ event: "EMOJI_UPDATE", value: 12, desc: "Emitted whenever an existing emoji's name is updated." },
	{ event: "STICKER_CREATE", value: 13, desc: "Emitted whenever a new sticker is created in the server." },
	{ event: "STICKER_DELETE", value: 14, desc: "Emitted whenever a sticker is deleted from the server." },
	{ event: "STICKER_UPDATE", value: 15, desc: "Emitted whenever an existing sticker's name is updated." },
	{ event: "INVITE_CREATE", value: 16, desc: "Emitted whenever a new invite is created in the server." },
	{ event: "INVITE_DELETE", value: 17, desc: "Emitted whenever an invite is deleted in the server." },
	// Guild (30-39)
	{ event: "GUILD_UPDATE", value: 30, desc: "Emitted whenever server configuration are updated." },
	{ event: "GUILD_BAN_ADD", value: 31, desc: "Emitted whenever someone is banned from the server." },
	{ event: "GUILD_BAN_REMOVE", value: 32, desc: "Emitted whenever someone is unbanned from the server." },
	{ event: "GUILD_MEMBER_ADD", value: 33, desc: "Emitted whenever someone joins the server." },
	{ event: "GUILD_MEMBER_REMOVE", value: 34, desc: "Emitted whenever someone leaves the server." },
	{ event: "GUILD_MEMBER_UPDATE", value: 35, desc: "Emitted whenever a member's details are updated in the server." },
	//Roles (40-49)
	{ event: "ROLE_CREATE", value: 40, desc: "Emitted whenever a new role is created in the server." },
	{ event: "ROLE_DELETE", value: 41, desc: "Emitted whenever a role is deleted from the server." },
	{ event: "ROLE_UPDATE", value: 42, desc: "Emitted whenever an existing role's configuration is/are updated." },
	// Channel (50-59)
	{ event: "CHANNEL_CREATE", value: 50, desc: "Emitted whenever a new channel is created in the server." },
	{ event: "CHANNEL_DELETE", value: 51, desc: "Emitted whenever a channel is deleted from the server." },
	{ event: "CHANNEL_UPDATE", value: 52, desc: "Emitted whenever an existing channel's configuration is updated." },
	{ event: "STAGE_INSTANCE_CREATE", value: 53, desc: "Emitted whenever a new stage is created in the server." },
	{ event: "STAGE_INSTANCE_DELETE", value: 54, desc: "Emitted whenever a stage is deleted from the server." },
	{ event: "STAGE_INSTANCE_UPDATE", value: 55, desc: "Emitted whenever an existing stage's configuration is updated." },
	// Message (60-69)
	{ event: "MESSAGE_DELETE", value: 60, desc: "Emitted whenever a message is deleted in the server." },
	{ event: "MESSAGE_BULK_DELETE", value: 61, desc: "Emitted whenever messages are pruned/purged in the server." },
	{ event: "MESSAGE_UPDATE", value: 62, desc: "Emitted whenever a message's content is edited." },
	// Thread (70-79)
	{ event: "THREAD_CREATE", value: 70, desc: "Emitted whenever a new thread is created in the server." },
	{ event: "THREAD_DELETE", value: 71, desc: "Emitted whenever a thread is deleted from the server." },
	{ event: "THREAD_UPDATE", value: 72, desc: "Emitted whenever an existing thread's configuration and/or status is updated." },
	{ event: "THREAD_MEMBERS_UPDATE", value: 73, desc: "Emitted whenever a member joins or leaves an existing thread." }
    
];

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	
	const settings = await getGuildDB(message.guild);
	const currentPrefix = settings.prefix;
    
	const commandType = args[0];
	if (!commandType) return promptFailureEmbed(
		message,
		`You need to provide a command type. \n\
		**Command Usage:** \`${currentPrefix}event [type] (param)\`\n\
        **Command Types:**\n\
        \`list\` - List all available log events,\n\
        \`enable\` - Enable a log event,\n\
        \`disable\` - Disable a log event,\n\
        \`channel\` - Set a log channel for a log event`
	);

	if (commandType == "list") { // List events command
		const eventsListEmbed = new MessageEmbed()
			.setColor("#FFA700")
			.setTitle("Events List")
			.setDescription(events.map(e => `**${e.event}** (\`${e.value}\`):\n${e.desc}`).join("\n"));
		return message.channel.send({ embeds: [ eventsListEmbed ]});
	} else if (commandType == "enable") { // Enable log event command

		const eventValue = args[1];
		// Check if an event's value is provided
		if (!eventValue) return promptFailureEmbed(
			message,
			`You need to provide an event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Check if the event value provided exists
		const event = events.find(e => e.value == eventValue);
		if (!event) return promptFailureEmbed(
			message,
			`You need to provide a valid event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Enable event logging
		await guildSettings.updateOne({ guildID: message.guild.id }, { 
			$set: { [`logs.${event.event}.enabled`] : true }
		});

		return promptSuccessEmbed(
			message,
			`Log event for \`${event.event}\` was \`enabled\`.`
		);

	} else if (commandType == "disable") { // Disable log event command

		const eventValue = args[1];
		// Check if an event's value is provided
		if (!eventValue) return promptFailureEmbed(
			message,
			`You need to provide an event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Check if the event value provided exists
		const event = events.find(e => e.value == eventValue);
		if (!event) return promptFailureEmbed(
			message,
			`You need to provide a valid event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Disable event logging
		await guildSettings.updateOne({ guildID: message.guild.id }, { 
			$set: { [`logs.${event.event}.enabled`] : false }
		});

		return promptSuccessEmbed(
			message,
			`Log event for \`${event.event}\` was \`disabled\`.`
		);

	} else if (commandType == "channel") { // Set log channel command

		const eventValue = args[1];
		// Check if an event's value is provided
		if (!eventValue) return promptFailureEmbed(
			message,
			`You need to provide an event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Check if the event value provided exists
		const event = events.find(e => e.value == eventValue);
		if (!event) return promptFailureEmbed(
			message,
			`You need to provide a valid event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event enable [event value]\``
		);

		// Check if a channel is specified
		const specChannel = args[2];
		if (!specChannel) return promptFailureEmbed(
			message,
			`You need to provide an event value. (Found in brackets in \`${currentPrefix}event list\`)\n\
		    **Command Usage:** \`${currentPrefix}event channel ${eventValue} [channel]\``
		);
		const channel = getChannel(client, specChannel);
		if (!channel) return promptFailureEmbed(
			message, 
			`You need to provide a valid channel.\n\
		    **Command Usage:** \`${currentPrefix}event channel ${eventValue} [channel]\``
		);

		// Set event log channel
		await guildSettings.updateOne({ guildID: message.guild.id }, { 
			$set: { [`logs.${event.event}.logChannelID`] : channel.id }
		});

		return promptSuccessEmbed(
			message,
			`Log channel for \`${event.event}\` was set to <#${channel.id}>.`
		);

	} else {
		return promptFailureEmbed(
			message,
			`The command type provided is invalid.\n\
            **Command Usage:** \`${currentPrefix}event [type] (param)\`\n\
            **Command Types:**\n\
            \`list\` - List all available log events,\n\
            \`enable\` - Enable a log event,\n\
            \`disable\` - Disable a log event,\n\
            \`channel\` - Set a log channel for a log event`
		);
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["events"],
	permLevel: "Administrator"
};

exports.help = {
	name: "event",
	category: "Server Configuration",
	description: "List and configure log events.",
	usage: "event"
};
