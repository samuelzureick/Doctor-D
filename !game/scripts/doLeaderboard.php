<?php
	require('connection.php');
	$name = $_POST['un'];
	$score = $_POST['score'];
	$sql = "INSERT INTO leaderboard (name, score) VALUES('$name', '$score')";
	if ($conn->query($sql))
	{
		header('location: ../../\!website/Menu.html');
		exit;
	}
	else
	{
	echo("ERROR: " .$conn->error);
	}
?>

