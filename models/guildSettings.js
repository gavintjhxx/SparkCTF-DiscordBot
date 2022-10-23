const mongoose = require("mongoose");

const guildSettingsSchema = mongoose.Schema({
	guildID: String,
	prefix: String,
	logs: {
		EMOJI_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		EMOJI_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		EMOJI_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		STICKER_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		STICKER_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		STICKER_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		INVITE_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		INVITE_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_BAN_ADD: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_BAN_REMOVE: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_MEMBER_ADD: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_MEMBER_REMOVE: {
			enabled: Boolean,
			logChannelID: String
		},
		GUILD_MEMBER_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		// TODO: Add the following events
		ROLE_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		ROLE_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		ROLE_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		CHANNEL_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		CHANNEL_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		CHANNEL_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		STAGE_INSTANCE_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		STAGE_INSTANCE_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		STAGE_INSTANCE_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		MESSAGE_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		MESSAGE_BULK_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		MESSAGE_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		THREAD_CREATE: {
			enabled: Boolean,
			logChannelID: String
		},
		THREAD_DELETE: {
			enabled: Boolean,
			logChannelID: String
		},
		THREAD_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
		THREAD_MEMBERS_UPDATE: {
			enabled: Boolean,
			logChannelID: String
		},
	}
});

module.exports = mongoose.model("guildSettings", guildSettingsSchema);