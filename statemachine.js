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

var world = {
    "room0": { 
        description: "You're in a large clearing. There's a path to the north.",
        commands: { north: "room1", look: "room0" }
    },
    "room1": {
        description: "There's a small house here surrounded by a white fence with a gate. There's a path to the south and west.",
        commands: { "open gate": "room2", south: "room0", west: "room3", look: "room1" }
    }
}

bot.dialog('/', [
    function (session, args) {
        session.beginDialog("/location", { location: "room0" });
    },
    function (session, results) {
        session.send("Congratulations! You made it out!");
    }
]);
bot.dialog('/location', [
    function (session, args) {
        var location = world[args.location];
        session.dialogData.commands = location.commands;
        builder.Prompts.choice(session, location.description, location.commands);
    },
    function (session, results) {
        var destination = session.dialogData.commands[results.response.entity];
        session.replaceDialog("/location", { location: destination });
    }
]);