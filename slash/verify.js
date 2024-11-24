const { promptFailureEmbedOnSlash, promptSuccessEmbedOnSlash } = require("../modules/functions.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

	if (interaction.guildId !== process.env.CTF_SERVER_ID) return;

	const params = interaction.options._hoistedOptions;
	const nickname = params[0]?.value;
	const teamName = params[1]?.value;
	if (!nickname || !teamName) return promptFailureEmbedOnSlash(interaction, "Something went wrong.", true);
	if (teamName.length > 30) return promptFailureEmbedOnSlash(interaction, "Team name is too long. (Maximum 30 characters)", true);

	const verifiedRoleID = "1305735928517623839";
	const ticketChannelID = "1305754768370565151";
	const memberHasRole = interaction.member.roles.cache.get(verifiedRoleID);
	if (memberHasRole) {
		return promptFailureEmbedOnSlash(interaction, `You have already been verified. (If you wish to update your team/user name, open a ticket in <#${ticketChannelID}>.`, false);
	} else {
		try {
			interaction.member.roles.add(verifiedRoleID);
			interaction.member.setNickname(`(${teamName}) ${nickname}`);
			return promptSuccessEmbedOnSlash(interaction, `You have been verified successfully.\n**Team Name:** ${teamName}\n**Nickname:** ${nickname}`, true);
		} catch (error) {
			return promptFailureEmbedOnSlash(interaction, `Something went wrong. Please open a ticket in <#${ticketChannelID}>`, true);
		}
	}

};

exports.commandData = {
	name: "verify",
	description: "Verify your nickname and team name.",
	options: [
		{
			name: "nickname",
			description: "This nickname will be applied to your server profile",
			type: 3,
			required: true
		},
		{
			name: "team_name",
			description: "This team name will be applied to your server profile",
			type: 3,
			required: true
		},
	],
	defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	permLevel: "User",
	guildOnly: false
};
