'use strict';

var builder = require('botbuilder');
var restify = require('restify');

//create the connector
//var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector();

//create the bot
var bot = new builder.UniversalBot(connector);

//add in the dialog
// bot.dialog('/', function(session){
//     //session.send('Hello, bot!')
//     var userMessage = session.message.text;
//     session.send('you said: ' + userMessage);
// });

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Please enter your name');
    },
    function(session, result) {
        session.send('Hello, ' + result.response);
        session.sendTyping();
        setTimeout(function() {
            session.send('wait for 5000 ms');            
        }, 5000);

    }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

server.post('/api/messages', connector.listen());