const fs = require(`fs`)
const { MessageMentions } = require("discord.js")
const { Authorised } = require(`../Events/Message.js`)

module.exports = {
    name: "Setup",
    trigger: "setup",
    roles: ["Administrator"],
    channels: ["text"],
    condition: function (args, callback) {
        let msg = args[0]
        let msgArgs = msg.content.split(` `)
        let cmd = msgArgs[0]

        if (cmd == `${args[3].Prefix}${module.exports.trigger}`) {

            if (Authorised(args, module.exports)) {

                if (this.channels.includes(msg.channel.type)) {

                    if (msgArgs.length == 2) {
                        let channel = msgArgs[1]

                        return callback(!MessageMentions.CHANNELS_PATTERN.test(channel), { message: "Please make sure that you are mentioning a channel in your command." })

                    } else {
                        return callback(true, { message: "Please make sure that you are using the required arguments." });
                    }
                } else {
                    console.log(`2`)
                    return callback(true, { message: "You attempted to execute this command inside of the wrong channel." });
                }
            } else {
                return callback(true, { message: "You are not authorised to run this command." })
            }
        }
    },
    execute: function (args) {
        let msg = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        let channel = msg.content.split(` `)[1].trim().split('#')[1].split('>')[0]
        let guildChannel = msg.guild.channels.cache.get(channel)

        let processingEmbed = new Discord.MessageEmbed()
            .setColor(config.Colours.Embed.Processing)
            .setTitle(`Setting up the verification system in ${guildChannel.name}`)
            .setTimestamp()

        let verificationEmbed = new Discord.MessageEmbed()
            .setColor(config.Colours.Embed.Success)
            .setTitle(`Please react to this message with ✅ to start the verification process.`)
            .setTimestamp()

        msg.channel.send(processingEmbed)
        guildChannel.send(verificationEmbed).then(m => {
            let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))
            saveData.Verification.Message.ID = m.id
            saveData.Verification.Message.Channel_ID = m.channel.id
            fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))
            m.react(`✅`)
        })
    }
}