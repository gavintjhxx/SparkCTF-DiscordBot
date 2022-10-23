const { MessageEmbed } = require("discord.js");
const guildSettings = require("../models/guildSettings");
const { getGuildDB, getRole, promptFailureEmbed, promptSuccessEmbed } = require("../modules/functions");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const settings = await getGuildDB(message.guild);
	const currentPrefix = settings.prefix;
    
	const commandType = args[0];
	const specifiedRole = args[1];
	if (!commandType) return promptFailureEmbed(
		message,
		`You need to provide a command type. \n\
		**Command Usage:** \`${currentPrefix}modrole [type] [role]\`\n\
        **Command Types:**\n\
		\`list\` - Display the current configuration\n\
        \`mod\` - Moderator Role\n\
        \`admin\` - Admin Role`
	);

	if (commandType == "list") {

		const modRoles = (settings.modRoles.moderatorRole) ? settings.modRoles.moderatorRole.map(role => `<@&${role.roleID}>`).join(" ") : "Unconfigured";
		const adminRoles = (settings.modRoles.administratorRole) ? settings.modRoles.administratorRole.map(role => `<@&${role.roleID}>`).join(" ") : "Unconfigured";
		const modRoleEmbed = new MessageEmbed()
			.setColor("#FFA700")
			.setTitle("Moderator Role Configuration")
			.setDescription(`**Moderator Role:** ${modRoles}\n**Admin Role:** ${adminRoles}`);
		return message.channel.send({ embeds: [ modRoleEmbed ]});

	} else if (commandType == "mod") { // Moderator role command

		if (!specifiedRole) return promptFailureEmbed(
			message,
			`You need to provide a command type. \n\
			**Command Usage:** \`${currentPrefix}modrole [type] [role]\`\n\
			**Command Types:**\n\
			\`list\` - Display the current configuration\n\
			\`mod\` - Moderator Role\n\
			\`admin\` - Admin Role`
		);

		const role = getRole(message.guild, specifiedRole);
		if (!role) return promptFailureEmbed(
			message,
			`You need to provide a valid role. \n\
			**Command Usage:** \`${currentPrefix}modrole mod [role]\``
		);

		if (settings.modRoles.moderatorRole.some(e => e.roleID == role.id )) {
			await guildSettings.updateOne({ guildID: message.guild.id }, { 
				$pull: { ["modRoles.moderatorRole"] : { roleID: role.id } }
			});
			return promptSuccessEmbed(
				message,
				`Removed **${role.name}** (\`${role.id}\`) from the moderator role list.`
			);
		} else {
			await guildSettings.updateOne({ guildID: message.guild.id }, { 
				$push: { ["modRoles.moderatorRole"] : { roleID: role.id } }
			});
			return promptSuccessEmbed(
				message,
				`Added **${role.name}** (\`${role.id}\`) to the moderator role list.`
			);
		}

	} else if (commandType == "admin") { // Admin role command

		const role = getRole(message.guild, specifiedRole);
		if (!role) return promptFailureEmbed(
			message,
			`You need to provide a valid role. \n\
			**Command Usage:** \`${currentPrefix}modrole admin [role]\``
		);

		if (settings.modRoles.administratorRole.some(e => e.roleID == role.id )) {
			await guildSettings.updateOne({ guildID: message.guild.id }, { 
				$pull: { ["modRoles.administratorRole"] : { roleID: role.id} }
			});
			return promptSuccessEmbed(
				message,
				`Removed **${role.name}** (\`${role.id}\`) from the administrator role list.`
			);
		} else {
			await guildSettings.updateOne({ guildID: message.guild.id }, { 
				$push: { ["modRoles.administratorRole"] : { roleID: role.id}  }
			});
			return promptSuccessEmbed(
				message,
				`Added **${role.name}** (\`${role.id}\`) to the administrator role list.`
			);
		}

	} else {
		return promptFailureEmbed(
			message,
			`Invalid command type. \n\
			**Command Usage:** \`${currentPrefix}modrole [type] [role]\`\n\
			**Command Types:**\n\
			\`mod\` - Moderator Role\n\
			\`admin\` - Admin Role`
		);
	}

};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: "Server Owner"
};

exports.help = {
	name: "modrole",
	category: "Server Configuration",
	description: "Configure the server's moderator / administrator roles.",
	usage: "modRole [type] [role]"
};