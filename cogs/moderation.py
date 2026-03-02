import discord
from discord.ext import commands
from discord import app_commands

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    @commands.has_permissions(kick_members=True)
    async def kick(self, ctx, member: discord.Member, *, reason="No reason provided"):
        await member.kick(reason=reason)
        await ctx.send(f"{member} was kicked.\nReason: {reason}")

    @commands.command()
    @commands.has_permissions(ban_members=True)
    async def ban(self, ctx, member: discord.Member, days: int, *, reason="No reason provided"):
        await member.ban(delete_message_days=days, reason=reason)
        await ctx.send(f"{member} was banned for {days} days.\nReason: {reason}")

    @commands.command()
    @commands.has_permissions(ban_members=True)
    async def permban(self, ctx, member: discord.Member, *, reason="No reason provided"):
        await member.ban(reason=reason)
        await ctx.send(f"{member} was permanently banned.\nReason: {reason}")

async def setup(bot):
    await bot.add_cog(Moderation(bot))
