const Parse = require('parse/node')

Parse.initialize('APP ID', 'MASTER ID')
Parse.serverURL = 'http://localhost:1337/parse'


/**
 * Needs to:
 * 1. 
 * 
 */

async function run() {
    let Message = Parse.Object.extend('Message')
    let message = new Message()

    message.set('id', '123456789')
    message.set('text', 'this is a message!')
    message.set('users', ['123456789', '987654321'])

    message.save()

}

run()