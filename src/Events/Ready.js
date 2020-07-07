module.exports = {
    name: `Ready`,
    trigger: `ready`,
    execute: function(args) {
        let Client = args[1]

        console.log(`${Client.user.username} is now online!`)
        Client.user.setActivity('The Forge', { type: 'WATCHING' });
    }
}