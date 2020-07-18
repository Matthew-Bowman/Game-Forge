const fs = require(`fs`)
const { MessageMentions, MessageEmbed, GuildManager, GuildEmoji, MessageManager } = require("discord.js")
const fetch = require(`node-fetch`)
const request = require(`request`)
const randomWords = require(`random-words`)
const { Authorised } = require(`../Events/Message.js`)

module.exports = {
    name: "Username",
    trigger: "username",
    roles: [],
    channels: ["dm"],
    robloxLookup: function (username, callback) {

        payload = {
            "usernames": [username]
        }

        request.post(
            'https://users.roblox.com/v1/usernames/users',
            { json: payload },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    return callback(body.data[0])
                }
            }
        );
    },
    condition: function (args, callback) {
        let msg = args[0]
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        let msgArgs = msg.content.split(` `)
        let cmd = msgArgs[0]

        if (cmd == `${config.Prefix}${this.trigger}`) {

            if (Authorised(args, module.exports)) {

                if (this.channels.includes(msg.channel.type)) {

                    let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))

                    if (msgArgs.length == 2) {
                        if (saveData.Verification.Active[msg.author.id]) {

                            let username = msgArgs[1].trim()
                            this.robloxLookup(username, function (data) {
                                if (data) {
                                    username = data.name
                                    let generatedCode = (randomWords({ min: 10, max: 15 })).toLocaleString().split(`,`).join(' ').toLocaleUpperCase()

                                    saveData.Users[msg.author.id] = {
                                        Username: username,
                                        ID: data.id,
                                        Completed: false,
                                        String: generatedCode
                                    }
                                    delete saveData.Verification.Active[msg.author.id]
                                    fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))

                                    return callback(false, { message: "Please set your Roblox Status to the following:", description: `${generatedCode}\nOnce you have done this, please fun ${config.Prefix}verify` })

                                } else {
                                    delete saveData.Verification.Active[msg.author.id]
                                    fs.writeFileSync(`./Data/Info.json`, JSON.stringify(saveData))

                                    let guild = Client.guilds.cache.get(config.Guild)
                                    let channel = guild.channels.cache.get(saveData.Verification.Message.Channel_ID)
                                    channel.messages.fetch(saveData.Verification.Message.ID).then(m => {
                                        m.reactions.cache.get(saveData.Verification.Message.Reaction).users.remove(msg.author)
                                    })

                                    return callback(true, { message: "That is not a valid Roblox user.", description: "To re-initiate the verification, please react to the message in the server again." })
                                }
                            })
                        } else {
                            return callback(true, { message: "You have not initiated the verification process." });
                        }
                    } else {
                        return callback(true, { message: "Please make sure that you are using all of the required arguments" });
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

        let processingEmbed = new Discord.MessageEmbed()
            .setColor(config.Colours.Embed.Processing)
            .setTitle(data.message)
            .setDescription(data.description)
            .setTimestamp()

        msg.channel.send(processingEmbed)
    }
}