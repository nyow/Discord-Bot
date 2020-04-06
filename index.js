const Discord = require('discord.js')
const bot =new Discord.Client()

const token ='NjQ3MjkwNzIzNDM5NDc2NzQ4.XddmJQ.rGKxLFYpePiuZNJvtxpp53Cdn1M'
var chai = require('chai');
const PREFIX=''
var version ="1.0.1"
const Auditlog = require("discord-auditlog");
const decorate = require("./decorate.js")
// var inflight = require('./inflight.js')

// // some request that does some stuff
// function req(key, callback) {
//   // key is any random string.  like a url or filename or whatever.
//   //
//   // will return either a falsey value, indicating that the
//   // request for this key is already in flight, or a new callback
//   // which when called will call all callbacks passed to inflightk
//   // with the same key
//   callback = inflight(key, callback)

//   // If we got a falsey value back, then there's already a req going
//   if (!callback) return

//   // this is where you'd fetch the url or whatever
//   // callback is also once()-ified, so it can safely be assigned
//   // to multiple events etc.  First call wins.
//   setTimeout(function() {
//     callback(null, key)
//   }, 100)
// }

// // only assigns a single setTimeout
// // when it dings, all cbs get called
// req('foo',1);
// req('foo',1);
// req('foo',1);
// req('foo',1);
// will send all event to #audit-logs channel
// will send movement (join/leave) to #in-out channel if the channel exist
const http = require('http')
const assert = require('assert')
const Promise = require('bluebird')
const exec = require('child_process').exec
const logger = require('bole')('monitor')

let contributor = null

module.exports = function startMonitor (port, callback) {
  const monitor = http.createServer()
  let commitHash = ''
  let listening = () => {}
  let ready = new Promise(resolve => {
    listening = resolve
  })

  monitor.on('request', (req, res) => {
    if (req.url !== '/_monitor/ping') {
      return
    }
    req.handled = true
    res.end(process.env.PING_RESPONSE || 'pong')
  })

  monitor.on('request', (req, res) => {
    if (req.url !== '/_monitor/status') {
      return
    }
    req.handled = true
    const getExtra = (
      contributor
      ? Promise.try(() => contributor())
      : Promise.resolve({})
    )

    const getStatus = getExtra.then(obj => {
      return Object.assign({
        pid: process.pid,
        uptime: process.uptime(),
        rss: process.memoryUsage(),
        cmdline: process.argv,
        git: commitHash
      }, obj)
    })

    return getStatus.then(status => {
      res.writeHead(200, {'content-type': 'application/json'})
      res.end(JSON.stringify(status))
    })
  })

  monitor.on('request', (req, res) => {
    logger.info(req)
    if (req.handled) {
      return
    }
    res.writeHead(404)
    res.end('')
  })

  function gitHash () {
    return new Promise(resolve => {
      exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
        resolve((!err && stdout) ? stdout.trim() : undefined)
      })
    })
  }

  Promise.resolve(process.env.BUILD_HASH)
  .then(envHash => envHash || gitHash())
  .then(hash => {
    commitHash = hash
    monitor.listen(port, () => {
      listening()
      callback()
    })
  })

  return Object.assign(monitor, {
    contribute: (_contributor) => {
      assert(typeof _contributor === 'function', 'contributor must be a function')
      contributor = _contributor
    },
    stop: () => ready.then(() => new Promise(resolve => monitor.close(resolve)))
  })
}



var wrappy = require("wrappy")

// var wrapper = wrappy(wrapperFunction)

// make sure a cb is called only once
// See also: http://npm.im/once for this specific use case
var once = wrappy(function (cb) {
  var called = false
  return function () {
    if (called) return
    called = true
    return cb.apply(this, arguments)
  }
})

function printBoo () {
  console.log('boo')
}
// has some rando property
printBoo.iAmBooPrinter = true

var onlyPrintOnce = once(printBoo)

onlyPrintOnce() // prints 'boo'
onlyPrintOnce() // does nothing

// random property is retained!
chai.assert.equal(onlyPrintOnce.iAmBooPrinter, true);

Auditlog(bot, {
  "serverid": {
      auditlog: "audit-log",
      movement: "in-out",
      auditmsg: false, // Default to fasle, recommend to set a channel
      voice: false // Set a Channel name if you want it

  }
});

function myFunction () {
  return 1
}
myFunction.bloo = 3

const decorated = decorate(myFunction, (...args) => {
  return myFunction(...args) + 1
})

console.log(decorated.name) // myFunction
console.log(decorated.bloo) // 3
console.log(decorated())    /
bot.on('ready',()=>{
    console.log('This Bot is ready')
})
bot.on('message', message=>{
    let arg = message.content.substring(PREFIX.length).split(" ");

    switch(arg[0]){
        case 'Quote':
                var request = require("request");

                var options = {
                    method: 'GET',
                    url: 'https://api.quotable.io/random',
                    headers: {}
                };

request(options, function (error, response, body) {
	if (error) throw new Error(error);

    console.log(body);
    var jsonObj = JSON.parse(body);
        message.channel.sendMessage(jsonObj.content)
        message.channel.sendMessage('-'+jsonObj.author)
});

// var jsonObj = require("https://api.quotable.io/random.json");
            break;
            case 'Joke':
                    var request = require("request");
    
                    var options = {
                        method: 'GET',
                        url: 'http://api.icndb.com/jokes/random',
                        headers: {}
                    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    
        console.log(body);
        var jsonObj = JSON.parse(body); 
        console.log(jsonObj.value.joke);

            message.channel.sendMessage(jsonObj.value.joke)
            message.channel.sendMessage('#'+jsonObj.value.categories.toString())
    });
    
    // var jsonObj = require("https://api.quotable.io/random.json");
                break;

    }
})
bot.on('message', msg=>{

    if(msg.content=== "Hi"){
        msg.reply('Hello Mate!')
    }
    else if((msg.content=== "Toss a coin")||msg.content==="Flip a coin"){
        x=Math.floor(Math.random() * Math.floor(2));
        if(x===1) {
            msg.reply('Its HEADS!:medal:' )
            
        }
        else msg.reply('Its TAILS!:medal:')
        console.log(x);
    }
    else{}
})
bot.on('guildMemberAdd', member => {
    member.send(
      `Welcome on the DUMB Server! Please be aware that we won't tolerate troll, spam or harassment. Have fun 😀`
    )
  })
  bot.on('message', message => {
    if (message.content.startsWith('Kiiiiiiiick')) {
      const member = message.mentions.members.first()
  
      if (!member) {
        return message.reply(
          `Who are you trying to kick? You must mention a user.`
        )
      }
  
      if (!member.kickable) {
        return message.reply(`I can't kick this user. Sorry!`)
      }
  
      return member
        .kick()
        .then(() => message.channel.sendMessage(`Get Lost,${member.user}`)) //message.reply(`${member.user.tag} was kicked.`)) 
        .catch(error => message.reply(`Sorry, an error occured.`))
    }
  })

bot.login(token)