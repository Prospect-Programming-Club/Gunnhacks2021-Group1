const Parse = require('parse/node')

Parse.initialize('APP ID', 'MASTER ID')
Parse.serverURL = 'http://localhost:1337/parse'

const express = require('express')
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyparser = require('body-parser')



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