const { promptFailureEmbedOnSlash, promptSuccessEmbedOnSlash } = require("../modules/functions");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

	if (interaction.guildId !== process.env.CTF_SERVER_ID) return;

	// Flag: SIG24{sigauth_0aupti}
	const params = interaction.options._hoistedOptions;
	const key = `SIG24${params[0].value}`;
	const flag = process.env.FLAG;

	const startDate = new Date("2024-12-17T09:00:00+08:00");
	const endDate = new Date("2024-12-18T20:59:59+08:00");
	const currentDate = new Date();
	// Disable command before competition starts
	if (currentDate < startDate) return promptFailureEmbedOnSlash(interaction, "Competition has not started.", true);
	// Disable command after competition ends
	if (currentDate > endDate) return promptFailureEmbedOnSlash(interaction, "Competition has ended.", true);

	if (key !== flag) {
		return promptFailureEmbedOnSlash(interaction, "Incorrect key value. Try again.", true);
	} else {
		return promptSuccessEmbedOnSlash(interaction, `Here is your flag: \`${flag}\``, true);
	}

};

exports.commandData = {
	name: "soln",
	description: "Ｍayｂｅ Ｉ сould ｇeｔ the fｌaｇ thｒｏugh ｔhіｓ speϲіal ϲommand?",
	defaultPermission: true,
	options: [
		{
			name: "key",
			description: "Ｍayｂｅ Ｉ сould ｇeｔ the fｌaｇ thｒｏugh ｔhіｓ speϲіal ϲommand?",
			type: 3,
			required: true
		},
	]
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	permLevel: "User",
	guildOnly: false
};
