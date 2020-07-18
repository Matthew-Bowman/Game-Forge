const fs = require(`fs`)
const { MessageCollector, ClientUser } = require("discord.js")

module.exports = {
    name: "Message Reaction Added",
    trigger: "MESSAGE_REACTION_ADD",
    execute: function (args) {
        let packet = args[0]
        let Client = args[2]
        let data = packet.d

        let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))

        Client.users.fetch(data.user_id).then(user => {
            if (!user.bot) {
                if (data.message_id == saveData.Verification.Message.ID) {
                    if (!saveData.Users[data.user_id]) {
                        saveData.Verification.Active[data.user_id] = {timeInitiated: Date.now()}
                        fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))
                        args[2].users.fetch(data.user_id).then(user => {
                            let cancelledEmbed = new args[1].MessageEmbed()
                                .setColor(args[3].Colours.Embed.Success)
                                .setTitle(`The verification process has been initiated.\nPlease respond with \`${args[3].Prefix}username [Roblox Username]\`.`)
                                .setTimestamp()

                            user.send(cancelledEmbed)
                        })
                    }
                }
            }
        })


    }
}