module.exports = function(app, mandrill_client)
{
	app.get("/rest/forgotEmail/:email/:username", function(req, res)
	{
		var email = req.params.email;
		var username = req.params.username;

		var html = "<p>You recently requested to rest your password. Here are temporary username and password:</p>";
		html += "<p>Username: " + username + "<br/>Password: password</p>";
		html += "<p>You can login with these credentials and change them from within the application.</p>"

		var text = "You recently requested to rest your password. Here are temporary username and password:\n\n";
		text += "Username: username<br/>Password: password\n\n";
		text += "You can login with these credentials and change them from within the application.\n"

		var message = {
		    "html": html,
		    "text": text,
		    "subject": "example subject",
		    "from_email": "mailto:support@fish360.net",
		    "from_name": "Example Name",
		    "to": [{
	            "email": email,
	        }]
		};
		mandrill_client.messages.send({"message": message}, function(result) {
		    console.log(result);
		}, function(e) {
		    // Mandrill returns the error as an object with name and message keys
		    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
		});
		
		console.log(text);
		res.send(text);
	});
}