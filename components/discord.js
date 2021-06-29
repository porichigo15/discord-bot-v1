
const Discord = require('discord.js')

var moment = require('moment')

const client = new Discord.Client()

const channelId = process.env.CHANNEL_ID

let messsageForDiscord

async function init(githubBody) {
    await login().then(() => {
        initDiscord(githubBody).then(() => {
            announceCommit()
        })
    })
}

async function login() {
    const token = process.env.TOKEN

    return new Promise((resolve) => {
        client.login(token)
        resolve()
    })
}

async function initDiscord(githubBody) {
    return new Promise((resolve) => {
        setMessageForDiscord(githubBody)
    
        client.on('ready', () => {
            console.log("Connected with " + client.user.tag)
            client.user.setActivity("learning github webhook")

            resolve()
        })
    })
}

async function announceCommit() {
    let channel = client.channels.cache.get(channelId)
    if (messsageForDiscord && channel) {
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

        const dateString = moment().format("DD/MM/YYYY HH:mm:ss")

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