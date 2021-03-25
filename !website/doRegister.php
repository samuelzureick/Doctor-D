<?php 
	require('connection.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>SUCCESS PAGE</title>
</head>
<body>
	<h1 title="hello">Thank You</h1>
	<hr>
	<p></p>

	<?php

		$un = $_POST['username'];
		if ($_POST['create_password'] == $_POST['pwc'])
		{
			$pwc = $_POST['pwc'];
			$pw_hash = password_hash($pwc, PASSWORD_DEFAULT);
		}
		
		$pw = $_POST['pwc'];

		$_SESSION['username'] = $un;

		$sql = "INSERT INTO users (username, password) VALUES ('$un', '$pw')";

		if ($conn->query($sql))
		{
		}
		else
		{
			echo("ERROR: " .$conn->error);
		}
		
		
	?>

	<a href="login.php">Login</a>


</body>
</html>