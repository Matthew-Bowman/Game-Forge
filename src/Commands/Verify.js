const fs = require(`fs`)
const { MessageMentions, MessageEmbed, GuildManager, GuildEmoji, MessageManager } = require("discord.js")
const fetch = require(`node-fetch`)
const request = require(`request`)
const { callbackify } = require("util")
const { Authorised } = require(`../Events/Message.js`)

module.exports = {
    name: "Verify",
    trigger: "verify",
    roles: [],
    channels: ["dm"],
    condition: function (args, callback) {
        let msg = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]
        if (msg.content === `${config.Prefix}${this.trigger}`) {

            if (Authorised(args, module.exports)) {

                if (this.channels.includes(msg.channel.type)) {

                    let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))


                    if (saveData.Users[msg.author.id]) {
                        if (!saveData.Users[msg.author.id].Completed) {
                            let userData = saveData.Users[msg.author.id]
                            fetch(`https://users.roblox.com/v1/users/${userData.ID}/status`).then(response => {
                                response.json().then(response => {
                                    let userMessage = response.status
                                    if (userMessage === userData.String) {
                                        return callback(false, { message: "You are now verified" })
                                    } else {
                                        return callback(true, { message: "You have not updated your status." })
                                    }
                                })
                            })
                        } else {
                            return callback(true, { message: "You are already a verified user" });
                        }
                    } else {
                        return callback(true, { message: "You have not initiated the verification process yet/Gotten up to this stage in the process yet." });
                    }

                } else {
                    return callback(true, { message: "You attempted to execute this command inside of the wrong channel." });
                }
            } else {
                return callback(true, { message: "You are not authorised to run this command." })
            }
        }
    },
    execute: function (args, data) {
        let msg = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))

        saveData.Users[msg.author.id].Completed = true
        fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))

        let guild = Client.guilds.cache.get(config.Guild)
        let channel = guild.channels.cache.get(saveData.Verification.Message.Channel_ID)
        channel.messages.fetch(saveData.Verification.Message.ID).then(m => {
            m.reactions.cache.get(saveData.Verification.Message.Reaction).users.remove(msg.author)
        })

        guild.members.fetch(msg.author.id).then(member => {
            member.roles.remove(config.Roles.Unverified)
            member.roles.add(config.Roles.Verified)
            member.setNickname(saveData.Users[msg.author.id].Username) 
        })
        let verifiedEmbed = new Discord.MessageEmbed()
            .setColor(config.Colours.Embed.Success)
            .setTitle(data.message)
            .setTimestamp()
        msg.channel.send(verifiedEmbed)
    }
}