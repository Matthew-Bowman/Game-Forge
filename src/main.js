const Discord = require(`discord.js`)
const Client = new Discord.Client()

const fs = require(`fs`)

const config = JSON.parse(fs.readFileSync(`./Data/Config.json`))
const events = fs.readdirSync(`./Events`)

events.forEach(function (val) {
    let event = require(`./Events/${val}`)

    Client.on(event.trigger, (args) => {
        args = [args, Discord, Client, config]
        event.execute(args)
    })
})

Client.login(config.Token)