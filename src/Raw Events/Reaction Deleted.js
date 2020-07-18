const fs = require(`fs`)
const { Client } = require("discord.js")

module.exports = {
    name: "Message Reaction Removed",
    trigger: "MESSAGE_REACTION_REMOVE",
    execute: function(args) {
        let packet = args[0]
        let data = packet.d

        let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))

        if(data.message_id == saveData.Verification.Message.ID) {
            if(!saveData.Users[data.user_id]) {
                delete saveData.Verification.Active[data.user_id]
                fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))
                args[2].users.fetch(data.user_id).then(user => {
                    let cancelledEmbed = new args[1].MessageEmbed()
                    .setColor(args[3].Colours.Embed.Error)
                    .setTitle(`The verification process has been cancelled.`)
                    .setTimestamp()

                    user.send(cancelledEmbed)
                })
            }
        }
    }
}