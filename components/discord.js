
const Discord = require('discord.js')

const client = new Discord.Client()

let generalChannel

function init(githubBody) {
    initDiscord(githubBody)

}

async function initDiscord(githubBody) {
    const messsageForDiscord = setMessageForDiscord(githubBody)
    const channelId = "857151587427418116"
    
    const channel = client.on('ready', async () => {
        console.log("Connected as " + client.user.tag)

        client.user.setActivity("learning github webhook")

        client.guilds.cache.forEach((guild) => {
            console.log(guild.name)
            guild.channels.cache.forEach((channel) => {
                console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
            })
            // General Channel id: 857151587427418116
        })

        const channel = client.channels.cache.get(channelId)
        return new Promise((resolve, reject) => {
            channel.send('xxx 1')
            resolve(client.channels.cache.get(channelId))
        })
        // client.channels.cache.get(channelId).send(messsageForDiscord)
        // sendAttachment()
        // getCurrentCommit()
        // autoDeploy()
        // testAutoDeploy()
        // github.testAutoDeploy(generalChannel)
    })
    
    await channel.send('xxx 2')
    // await channel.send('xxx')

    client.on('message', (receivedMessage) => {
        console.log("message")
        if (receivedMessage.author === client.user) {
            return
        }

        if (receivedMessage.content.startsWith("!")) {
            processCommand(receivedMessage)
        }
    })

    console.log('login')
    client.login("ODU3MTUxMDU4NjkzNDU1ODkz.YNLaIQ.a7xJK3WPlduvYgi9x6W5Y3aKxcA")
    // https://www.youtube.com/watch?v=8o25pRbXdFw
}

function setMessageForDiscord(githubBody) {
    let message = ""
    const data = {
        repository: githubBody.repository,
        pusher: githubBody.pusher,
        commits: githubBody.commits
    }

    if (data.repository) {
        message += `Repository name: ${data.repository.name} \n`
        message += `Pusher: ${data.pusher.name} \n`
        message += `----- Commit -----\n`
    
        for (let commit of data.commits) {
            message += `Commit: ${commit.id}, Branch: ${data.repository.default_branch} at ${commit.timestamp}\n`
        }
    } else {
        message = "xxx"
    }
    
    return message
}

async function sendAttachment() {
    const attachment = new Discord.MessageAttachment('./images/01.png');
    generalChannel.send(attachment)
}

function processCommand(receivedMessage) {
    const fullMessage = receivedMessage.content.substr(1)
    const commandMessage = fullMessage.split(" ")
    const command = commandMessage[0]
    const option = commandMessage[1]

    if (command === "help") {
        helpCommand(option, receivedMessage)
    } else if (command === "multiply") {
        multiplyCommand(commandMessage, receivedMessage)
    } else {
        receivedMessage.channel.send(`Please try again with !help or !multiply`)
    }
}

function helpCommand(option, receivedMessage) {
    if (option) {
        receivedMessage.react("🥳")
        receivedMessage.channel.send(`I will help you with ` + option)
    } else {
        receivedMessage.react("😭")
        receivedMessage.channel.send(`try again`)
    }
}

function multiplyCommand(option, receivedMessage) {
    const slice = option.slice(1)
    if (slice.length < 2) {
        receivedMessage.react("😭")
        receivedMessage.channel.send(`Please input 2 number like 2 10 `)
    } else {
        let result = 1
        slice.forEach(value => {
            result *= value
        })
        receivedMessage.react("🥳")
        receivedMessage.channel.send(`multiply of ${String(slice)} is ${result}`)
    }
}

module.exports.init = init