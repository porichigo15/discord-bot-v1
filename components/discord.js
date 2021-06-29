
const Discord = require('discord.js')

var moment = require('moment')

const client = new Discord.Client()
const environment = require('dotenv').config().parsed

const channelId = environment.CHANNEL_ID

let messsageForDiscord

async function init(githubBody) {
    await initDiscord(githubBody)
}

async function login() {
    const token = environment.TOKEN

    console.log('login')
    await client.login(token)
}

async function initDiscord(githubBody) {
    setMessageForDiscord(githubBody)

    client.on('ready', async () => {
        console.log("Connected with " + client.user.tag)
        client.user.setActivity("learning github webhook")
    })
}

async function announceCommit() {
    let channel = client.channels.cache.get(channelId);
    if (messsageForDiscord && channel) {
        console.log(channel)
        await channel.send(messsageForDiscord)
    }
}

async function setMessageForDiscord(githubBody) {
    let message = ""
    const data = {
        repository: githubBody.repository,
        pusher: githubBody.pusher,
        commits: githubBody.commits
    }

    if (data.repository) {

        const dateString = moment().format("DD MM YYYY hh:mm:ss")

        message += `Repository name: ${data.repository.name} \n`
        message += `Pusher: ${data.pusher.name} \n`
        message += `----- Commit -----\n`

        for (let commit of data.commits) {
            message += `Commit: ${commit.id} \n`
            message += `Branch: ${data.repository.default_branch} \n`
            message += `at ${dateString} \n`
        }
    } else {
        message = "xxx"
    }

    messsageForDiscord = message
}

module.exports = {
    init: init,
    login: login,
    announceCommit: announceCommit
}