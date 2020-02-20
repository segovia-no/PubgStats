import dotenv from 'dotenv'
import Discord from 'discord.js'

import messageListener from './listeners/message'
import readyListener from './listeners/ready'

const client = new Discord.Client()

//load env. variables
dotenv.config()

//Listeners mapping
client.on('ready', () => readyListener(client))

client.on('message', msg => messageListener(msg))


////Startup sequence

//Discord login
client.login(process.env.DISCORDAPPTOKEN)