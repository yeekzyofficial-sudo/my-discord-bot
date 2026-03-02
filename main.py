import os
import discord
from discord.ext import commands
import asyncio
import glob

# ---- OPTIONAL FLASK SERVER FOR RENDER ----
from flask import Flask
from threading import Thread

app = Flask(__name__)

@app.route("/")
def home():
    return "Bot is running!"

def run():
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)

def keep_alive():
    t = Thread(target=run)
    t.start()

# ---- DISCORD BOT SETUP ----
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="k.", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")
    try:
        synced = await bot.tree.sync()
        print(f"Synced {len(synced)} slash commands")
    except Exception as e:
        print(e)

# ---- LOAD COGS AUTOMATICALLY ----
async def load_cogs():
    for file in glob.glob("cogs/*.py"):
        extension = file.replace("/", ".")[:-3]
        try:
            await bot.load_extension(extension)
            print(f"Loaded {extension}")
        except Exception as e:
            print(f"Failed to load {extension}: {e}")

async def main():
    async with bot:
        await load_cogs()
        keep_alive()  # remove if using Background Worker
        await bot.start(os.environ["DISCORD_TOKEN"])

asyncio.run(main())
