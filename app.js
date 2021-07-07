// SECRET=YOUR_GITHUB_WEBHOOK_SECRET
// CWD=/path/to/your/project
// REMOTE=origin
// SOCKET_PRIV="your_user:your_group"
// GIT_AUTHOR="porichigo15"
// GIT_EMAIL="por.porkaew15@gmail.com"

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const discord = require('./components/discord')

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async function(req, res) {
    await discord.init(req.body)
    res.sendStatus(200);
})

app.listen(port, host, function() {
    console.log("Server started.......");
  });
