import random
import discord
from discord.ext import commands
from discord import app_commands

class Fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    def random_footer(self):
        return random.choice([
            "Certified",
            "Legendary vibes",
            "Unreal stats detected",
            "Built different",
            "Main character energy"
        ])

    # ---------- PREFIX DIHMETER ----------
    @commands.command()
    async def dihmeter(self, ctx, member: discord.Member = None):
        member = member or ctx.author
        inches = random.randint(1, 25)

        embed = discord.Embed(
            title="🍆 Dih Meter 🍆",
            description=f"Checking the stats for {member.mention}...",
            color=discord.Color.red()
        )
        embed.add_field(name="Result", value=f"**{inches} inches**")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=self.random_footer())

        await ctx.send(embed=embed)

    # ---------- PREFIX GAYMETER ----------
    @commands.command()
    async def gaymeter(self, ctx, member: discord.Member = None):
        member = member or ctx.author
        percent = random.randint(1, 100)

        embed = discord.Embed(
            title="🌈 Gay Meter 🌈",
            description=f"Scanning {member.mention}...",
            color=discord.Color.magenta()
        )
        embed.add_field(name="Result", value=f"**{percent}%** gay")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=self.random_footer())

        await ctx.send(embed=embed)

    # ---------- SLASH DIHMETER ----------
    @app_commands.command(name="dihmeter", description="Check someone's stats")
    async def slash_dihmeter(self, interaction: discord.Interaction, member: discord.Member = None):
        member = member or interaction.user
        inches = random.randint(1, 25)

        embed = discord.Embed(
            title="🍆 Dih Meter 🍆",
            description=f"Checking the stats for {member.mention}...",
            color=discord.Color.red()
        )
        embed.add_field(name="Result", value=f"**{inches} inches**")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=self.random_footer())

        await interaction.response.send_message(embed=embed)

    # ---------- SLASH GAYMETER ----------
    @app_commands.command(name="gaymeter", description="Check someone's percentage")
    async def slash_gaymeter(self, interaction: discord.Interaction, member: discord.Member = None):
        member = member or interaction.user
        percent = random.randint(1, 100)

        embed = discord.Embed(
            title="🌈 Gay Meter 🌈",
            description=f"Scanning {member.mention}...",
            color=discord.Color.magenta()
        )
        embed.add_field(name="Result", value=f"**{percent}%** gay")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text=self.random_footer())

        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Fun(bot))
