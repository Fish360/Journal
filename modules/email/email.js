module.exports = function(app, mandrill_client, db, generatePassword)
{
	app.get("/api/forgotPassword/:username", function(req, res)
	{
		var username = req.params.username;
		console.log(username);

		sendPasswordReset(username);
		
		res.send(200);
	});
	
	function sendPasswordReset(username)
	{
		var newPassword = generatePassword(8, false);
		console.log("sendPasswordReset");
		db.user.find({username: username}, function(err, user)
		{
			if(user != null && user.length > 0)
			{
				console.log("err");
				console.log(err);
				
				console.log("user");
				console.log(user);
				
				var email = user[0].email;
				console.log("email");
				console.log(email);
				
				var html = "<p>You recently requested to rest your password. Here are temporary username and password:</p>";
				html += "<p>Username: " + username + "<br/>Password: " + newPassword + "</p>";
				html += "<p>You can login with these credentials and change them from within the application.</p>"
		
				var text = "You recently requested to rest your password. Here are temporary username and password:\n\n";
				text += "Username: "+username+"<br/>Password: "+newPassword+"\n\n";
				text += "You can login with these credentials and change them from within the application.\n"
		
				var message = {
				    "html": html,
				    "text": text,
				    "subject": "Fish360 Password Reset",
				    "from_email": "mailto:support@fish360.net",
				    "from_name": "Fish360 Support",
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
			}
		});
	}
}