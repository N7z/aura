import { Events, GuildMember } from "discord.js";

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const roleId = '1240436517285924934';

        const role = member.guild.roles.cache.get(roleId);
        if(!role) {
            console.error(`Role with id ${roleId} not found.`);
            return;
        }

        try {
            await member.roles.add(role);
            console.log(`Role ${role.name} added to ${member.user.tag}`);
        } catch(e) {
            console.error(e);
        }
    },
};