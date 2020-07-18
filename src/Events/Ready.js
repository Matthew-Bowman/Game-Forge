const fs = require(`fs`)

module.exports = {
    name: "Ready",
    trigger: "ready",
    execute: function (args) {
        let Discord = args[1]
        let Client = args[2]
        let config = args[3]

        console.log(`${Client.user.username} is now online!`)

        let timeout = 300000

        let timeoutEmbed = new Discord.MessageEmbed()
            .setColor(config.Colours.Embed.Processing)
            .setTitle(`You were timed out of the verification process.`)
            .setTimestamp()

        setInterval(function () {
            let saveData = JSON.parse(fs.readFileSync(`./Data/Info.json`))
            let users = saveData.Verification.Active
            let keys = Object.keys(users)

            keys.forEach(function (key) {
                let startTime = users[key].timeInitiated
                if (Date.now() >= startTime + timeout) {
                    Client.users.fetch(key).then(user => {

                        user.send(timeoutEmbed)

                        delete saveData.Verification.Active[key]
                        fs.writeFileSync(`./Data.json`, JSON.stringify(saveData))

                        let guild = Client.guilds.cache.get(config.Guild)
                        let channel = guild.channels.cache.get(saveData.Verification.Message.Channel_ID)
                        channel.messages.fetch(saveData.Verification.Message.ID).then(m => {
                            m.reactions.cache.get(saveData.Verification.Message.Reaction).users.remove(key)
                        })

                    })
                }
            })
        }, 1000)
    }
}