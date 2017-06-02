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

bot.dialog('/', [
    function(session) {
        var msg = new builder.Message(session)
	        .text("Thank you for expressing interest in our premium golf shirt! What color of shirt would you like?")
	        .suggestedActions(
		        builder.SuggestedActions.create(
				    session, [
					    builder.CardAction.imBack(session, "productId=1&color=green", "Green"),
					    builder.CardAction.imBack(session, "productId=1&color=blue", "Blue"),
					    builder.CardAction.imBack(session, "productId=1&color=red", "Red")
				    ]
			    ));
        session.send(msg);       
    },
    function(session, result) {
        session.send('Your choice is: ' + result.response);
    }

]);