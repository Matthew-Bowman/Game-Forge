const fs = require(`fs`)
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "Message",
    trigger: "message",

    execute: function (args) {
        let Message = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        let events = fs.readdirSync(`./Commands`)

        let permissionError = new MessageEmbed()
            .setColor(config.Colours.Embed.Error)
            .setTitle(`You do not have permission to run that command`)
            .setTimestamp()

        if (!Message.author.bot) {

            events.forEach(function (val) {
                let event = require(`../Commands/${val}`)
                event.condition(args, function (err, data) {
                    if (err) {
                        let embed = new MessageEmbed()
                            .setColor(config.Colours.Embed.Error)
                            .setTitle(data.message)
                            .setTimestamp()

                        if (data.description) {
                            embed.setDescription(data.description)
                        }

                        Message.channel.send(embed)
                    } else {
                        event.execute(args, data)
                    }
                })
            })
        }
    },

    Authorised: function (args, event) {
        let Message = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        let authorisation = 0

        if (event.roles.length) {
            let roles = event.roles
            roles.forEach(function (val) {
                if (Message.member.roles.cache.has(config.Roles[val])) {
                    authorisation = 1
                }
            })
        } else {
            return true;
        }

        if (authorisation > 0) {
            return true;
        } else {
            return false;
        }
    }
}