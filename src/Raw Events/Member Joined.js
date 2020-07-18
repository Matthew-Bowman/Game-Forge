module.exports = {
    name: "Member Joined",
    trigger: "GUILD_MEMBER_ADD",
    execute: function(args) {        
        let packet = args[0]
        let Client = args[2]
        let config = args[3]

        let unverifiedRole = config.Roles.Unverified

        let data = packet.d

        let guild = Client.guilds.cache.get(data.guild_id)

        guild.members.fetch(data.user.id).then(member => {
            let guildMemberRoles = member.roles
            guildMemberRoles.add(unverifiedRole)
        })
    }
}