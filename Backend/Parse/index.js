// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
var cors = require("cors");
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const bodyParser = require("body-parser")
// const key = require('./admin')

const Parse = require('parse/node')
Parse.initialize('app')
Parse.serverURL = 'http://localhost:1337/parse'

class Message extends Parse.Object {
  constructor() {
    // Pass the ClassName to the Parse.Object constructor
    super('Message');
    // All other initialization
  }

  static createNewMessage(text, users) {
    const message = new Message();
    message.set("text", text)
    message.set("users", users)
    return message;
  }
}

// used to add a user to a message after they
async function addUserToMessage(messageID, newUser) {
  let query = new Parse.Query(Message)
  query.get(messageID).then((message) => {
    let priorUsers = message.get("users")
    let users = []
    priorUsers.forEach(user => {
      users.push(user);
    });
    users.push(newUser);
    message.set("users", users)
    message.save()
  }, (error) => {
    alert("Failed to add user to message object; error code: " + error.message);
  })
}

// used to add new messages from users' first message
async function addMessageFromUser(jsonString) {
  var json = JSON.parse(jsonString)
  Message.createNewMessage(json.text, json.users).save().then((message) => {}, (error) => {
    alert("Failed to create message object; error code: " + error.message);
  })
}

// used to direct messages to users as JSON strings
async function giveMessageToUser() {
  messageID = 0; // TODO: change the message ID to relevant way to decide which message is shared.
  let jsonString;
  let message = query.get(messageID).then((message) => {
    jsonString = JSON.stringify({
      "text": message.get("text"), "users": message.get("users")
    })
  });
  // TODO: use jsonString to return to the user
}

// addMessageFromUser('{"text": "Peter", "users": ["yes", "n"]}')

// addUserToMessage("ZtQfcIwfl6", "aaaaaaxxxxj")

// const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
const databaseUri = process.env.DATABASE_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  appId: process.env.APP_ID || 'app',
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },
};
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}

var dashboard = new ParseDashboard(
  {
    "apps": [
      {
        "serverURL": "http://localhost:1337/parse",
        "appId": "app",
        "masterKey": "master",
        "appName": "MyApp"
      }
    ],
    "users": [
      {
        "user": "abcde",
        "pass": "qwerty"
      }
    ]
  }
);

// make the Parse Dashboard available at /dashboard
app.use("/dashboard", dashboard);


var testAPIRouter = require('./api/testAPI');
app.use("/testAPI", testAPIRouter);

var messageAPIRouter = require('./api/messageAPI');
app.use("/messageAPI", messageAPIRouter);

var uuidAPIRouter = require('./api/uuidAPI');
app.use("/uuidAPI", uuidAPIRouter);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('Parse server running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
