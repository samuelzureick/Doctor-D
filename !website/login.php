
<!DOCTYPE html>
<html lang='en'>
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width, initial-scale=1.0'>
	<title>Log-In</title>
	<link rel='stylesheet' type='text/css' href='images/webSiteStyleSheet.css'>
</head>
<body>
	<div class='titleSpace'>
		<div class='bounceTitle'></div>
	</div>
	

	<div class='cloud'></div>
	<div class='cloud1'></div>
	<div class='cloud2'></div>
	

	<div class='username'>
		<div class='usernamePic'></div>
		<div class='usernameForm'>
			<form method='post' action='doLogin.php'>
				<input type='text' id='username' name='username'>
			
		</div>
	</div>

	<div class='password'>
		<div class='passwordPic'></div>
		<div class='passwordForm'>
			
				<input type='password' id='password' name='password'><br>
			
		</div>
	</div>

	<div class='logIn'>
		<button class='LogInButton' type='submit'></button></form>
	</div>

	<div class='accAndGuestParent'>

		<div class='createAccParent'>
			<button class='createAccountButton' onclick="location.href='createAccount.php';"></button>
		</div>

		<div class='guestPlayParent'>
			<button class='guestPlayButton' onclick="location.href='../!game/';"></button>
		</div>

	</div>
</body>
</html>
