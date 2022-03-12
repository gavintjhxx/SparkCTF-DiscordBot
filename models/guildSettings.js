const mongoose = require("mongoose");

const guildSettingsSchema = mongoose.Schema({
    guildID: String,
    prefix: String
});

module.exports = mongoose.model("guildSettings", guildSettingsSchema);