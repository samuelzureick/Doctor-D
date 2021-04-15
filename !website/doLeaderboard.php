<?php
	require('connection.php');
	$name = $_POST['username'];
	$score = $_POST['score'];
	$sql = "INSERT INTO leaderboard (name, score) VALUES('$name', '$score')";
	if ($conn->query($sql))
	{
		header('location: https://web.cs.manchester.ac.uk/x83005sz/first_group_project/!website/Menu.html');
		exit;
	}
	else
	{
		echo("ERROR: " .$conn-.error);
	}
?>

