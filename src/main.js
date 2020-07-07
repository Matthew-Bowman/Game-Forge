const Discord = require(`discord.js`)
const Client = new Discord.Client()

const fs = require(`fs`)

const config = JSON.parse(fs.readFileSync(`./Data/config.json`))
const events = fs.readdirSync(`./Events`)

events.forEach(function(value, index, array){
    let event = require(`./Events/${value}`)

    Client.on(`${event.trigger}`, args => {
        let arguments = [
            args,
            Client,
            Discord,
            config
        ]
        event.execute(arguments)
    })
})

Client.login(config.Token)