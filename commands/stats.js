const osu = require("node-os-utils");
const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const duration = durationFormatter.format(client.uptime);
	const cpu = osu.cpu;
	const mem = osu.mem;
	const drive = osu.drive;
	const cpuUsage = await cpu.usage();
	const { totalGb, usedGb, freeGb, usedPercentage, freePercentage } = await drive.info();
	const { totalMemMb, usedMemMb, freeMemMb, freeMemPercentage } = await mem.info();

	const stats = codeBlock("asciidoc", `= STATISTICS =
  • CPU Usage (%)  :: ${cpu.count()} cores | ${cpuUsage}%
  • Mem Usage      :: ${usedMemMb}MB (${Math.round((100 - freeMemPercentage) * 100) / 100}%) / ${totalMemMb}MB (100%) | ${freeMemMb}MB (${freeMemPercentage}%) free
  • BotMem Usage   :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • SSD Usage      :: ${usedGb}GB (${usedPercentage}%) / ${totalGb}GB (100%) | ${freeGb}GB (${freePercentage}) free
  • Uptime         :: ${duration}
  • Users          :: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}
  • Servers        :: ${client.guilds.cache.size.toLocaleString()}
  • Channels       :: ${client.channels.cache.size.toLocaleString()}
  • Discord.js     :: v${version}
  • Node           :: ${process.version}`);
	message.channel.send(stats);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "User"
};

exports.help = {
	name: "stats",
	category: "Miscellaneous",
	description: "Gives some useful bot statistics.",
	usage: "stats"
};
