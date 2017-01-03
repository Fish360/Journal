module.exports = function(app, mandrill_client, db, generatePassword)
{
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.F360_GMAIL_USERNAME,
			pass: process.env.F360_GMAIL_PASSWORD
		}
	});

	app.post("/api/forgotPassword/:username", function(req, res)
	{
		var username = req.params.username;

		sendPasswordReset(username);
		
		res.send(200);
	});
	
	function sendPasswordReset(username)
	{
		var newPassword = generatePassword(8, false);

		db.user.findAndModify({
			query:  {username: username},
			update: {$set : {password: newPassword}},
			new: true
		}, function(err, user)
		{
			if(user != null && err == null)
			{
				var email = user.email;

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
			            "email": email
			        }]
				};

				// mandrill_client.messages.send({"message": message},
				// 	function(result) {
                //
				// 	},
				// 	function(e) {
				// 		// Mandrill returns the error as an object with name and message keys
				// 		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
				// 		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
				// 	}
				// );

				console.log('forgot password');
				console.log(email);
				console.log(html);
				console.log(transporter);

				transporter.sendMail({
					to:email,
					subject:"Fish360 Password Reset",
					html: html
				});

			}
		});
	}
};