<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>SUCCESS PAGE</title>
</head>
<body>
	<h1 title="hello">Thank You</h1>
	<hr>
	<p>Restritation Complete</p>

	<?php
		$un = $_POST['username'];
		$pw = $_POST['confirm_password'];

		echo("<p>$un</p>");
		echo("<p>$pw</p>");

		$_SESSION['create_username'] = $un;
		$_SESSION['confirm_password'] = $pw;
	?>

	<a href="login.php">Login</a>


</body>
</html>