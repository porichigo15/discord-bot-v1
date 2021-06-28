const Git = require('nodegit')
const path = require('path')
const http = require('http')
var createHandler = require('github-webhook-handler')

const environment = require('dotenv').config().parsed

const location = environment.PATH
const branch = "master"

function testAutoDeploy(generalChannel) {
    const repoUrl = "https://github.com/porichigo15/lomana-line-login.git"
    var handler = createHandler({ path: '/webhook', secret: '5DC264356C785FF669E6D69D1CD39' })
    const me = Git.Signature.now(environment.GIT_AUTHOR, environment.GIT_EMAIL);

    console.log('start webhook time: ' + new Date())
    
    http.createServer(function (req, res) {
        console.log(req, res)
        handler(req, res, function (err) {
            console.log(err)
          res.statusCode = 404
          res.end('no such location')
        })
      }).listen(7777)
       
      handler.on('error', function (err) {
        console.error('Error:', err.message)
      })
       
      handler.on('push', function (event) {
        console.log('Received a push event for %s to %s',
          event.payload.repository.name,
          event.payload.ref)
      })
       
      handler.on('issues', function (event) {
        console.log('Received an issue event for %s action=%s: #%d %s',
          event.payload.repository.name,
          event.payload.action,
          event.payload.issue.number,
          event.payload.issue.title)
      })

    // handler.on('push', (event) => {
    //     console.log('Received a push event for %s to %s',
    //         event.payload.repository.name,
    //         event.payload.ref)
    //     var payload = event.payload
    //     console.log(payload.ref)

    //     if (payload.ref !== 'refs/heads/' + branch) {
    //         return
    //     }

    //     console.log('github webhook')
    //     Git.Repository.open(location).then(repo => {
    //         fetchRemote(repo)
    //     })
    // })
}

async function getCurrentCommit() {
    Git.Repository.open(location).then(repo => {
        repo.getBranch(branch).then(ref => {
            const branch = `Branch: ${ref.shorthand()} (${ref.target()})`

            sendMessage(generalChannel, branch)
            return repo.getBranchCommit(ref.shorthand())
        }).then(commit => {
            var history = commit.history()
            const promise = new Promise((resolve, reject) => {
                history.on("end", resolve)
                history.on("error", reject)
            })
            history.start()
            return promise
        }).then(commits => {
            var sha = commits[0].sha().substr(0, 8)
            var message = commits[0].message().split('\n')
            const commit = `${sha} ${message}`

            sendMessage(generalChannel, commit)
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
}

async function autoDeploy() {
    const token = "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"

    Git.Repository.open(path.resolve(__dirname, location)).then(async (repo) => {
        return repo.fetchAll("origin", {
            callbacks: {
                certificateCheck: function () { return 0 },
                credentials: function () {
                    return Git.Cred.userpassPlaintextNew(token, "x-oauth-basic");
                }
            }
        }).then(() => {
            console.log("it worked")
            repo.getBranch(branch).then(ref => {
                const branchMessage = `Branch: ${ref.shorthand()} (${ref.target()}) ${new Date()}`
                console.log(branchMessage)
                return repo.setHeadDetached(ref.target(), repo.defaultSignature(), "Checkout: HEAD " + ref.target())
            })
        })
    }).catch(error => {
        console.log(error)
    })
}

function sendMessage(generalChannel, message) {
    generalChannel.send(message)
}

module.exports.testAutoDeploy = testAutoDeploy