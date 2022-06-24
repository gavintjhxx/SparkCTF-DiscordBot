const config = require("../config.js");
exports.run = async (client, message, args, level) => {
    const friendly = config.permLevels.find(l => l.level === level).name;
    message.channel.send(`Your permission level is: ${level} - ${friendly}`);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "pl",
    category: "Miscellaneous",
    description: "Tells you your permission level for the current message location.",
    usage: "pl"
};
