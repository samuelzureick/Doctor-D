<?php 
	require('connection.php');
?>
<!DOCTYPE html>
<html lang='en'>
<head>
	<title>SUCCESS PAGE</title>
</head>
<body>

	<?php

		$un = $_POST['username'];
		$pw = $_POST['password'];
		

		

		$sql = "SELECT  * FROM users WHERE username='".$un."' and password='".$pw."'";
		if ($conn->query($sql))
		{
			$answer = mysqli_query($conn, $sql);
			$num = mysqli_num_rows($answer);

			if ($num == 1)
			{
				echo("LOGGED IN SUCCESSFULLY<br>");
				$_SESSION['username'] = $un;
				echo("<a href='Menu.html'>CLICK HERE TO PLAY GAME</a>");
			}
			else
			{
				echo("ERROR! USERNAME AND OR PASSWORD NOT FOUND. <br><a href='login.php'>CLICK HERE TO RETURN TO LOGIN SCEREEN</a>");
			}
		}
		else
		{
			echo('ERROR: ' .$conn->error);
		}


		

		
		
		
	?>


</body>
</html>