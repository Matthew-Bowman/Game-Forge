const fs = require(`fs`)

module.exports = {
    name: "Raw",
    trigger: "raw",
    execute: function (args) {

        const events = fs.readdirSync(`./Raw Events`)
        let packet = args[0]

        events.forEach(function (val) {
            let event = require(`../Raw Events/${val}`)
            if (packet.t === event.trigger) {
                event.execute(args)
            }
        })
    }
}