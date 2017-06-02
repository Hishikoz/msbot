'use strict';

var builder = require('botbuilder');
var restify = require('restify');

//Setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

//create the connector
var connector = new builder.ChatConnector();
server.post('/api/messages', connector.listen());

//create the bot
var bot = new builder.UniversalBot(connector);

//dialog
bot.dialog('/', [
    function (session) {
        session.beginDialog('/phonePrompt');
    },
    function (session, results) {
        session.send('Got it... Setting number to %s', results.response);
    }
]);
bot.dialog('/phonePrompt', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Enter the number using a format of either: '(555) 123-4567' or '555-123-4567' or '5551234567'")
        } else {
            builder.Prompts.text(session, "What's your phone number?");
        }
    },
    function (session, results) {
        var matched = results.response.match(/\d+/g);
        var number = matched ? matched.join('') : '';
        if (number.length == 10 || number.length == 11) {
            session.endDialogWithResult({ response: number });
        } else {
            //end the current dialog and replace it with a new one without returning to the caller
            session.replaceDialog('/phonePrompt', { reprompt: true });
        }
    }
]);
