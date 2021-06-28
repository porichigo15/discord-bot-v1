async function receivedMessage() {
    client.on('message', (receivedMessage) => {
        console.log("message")
        if (receivedMessage.author === client.user) {
            return
        }

        if (receivedMessage.content.startsWith("!")) {
            processCommand(receivedMessage)
        }
    })
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