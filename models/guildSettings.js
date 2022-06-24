const mongoose = require("mongoose");

const guildSettingsSchema = mongoose.Schema({
    guildID: String,
    prefix: String,
    systemNotice: String, // "true"/"false"
    commandReply: String // "true"/"false"
});

module.exports = mongoose.model("guildSettings", guildSettingsSchema);