<?php
	$host = "localhost";
	$un = "root"; 
	$pw = "root";
	$DB = "leaderboard";
	//$database = "leaderboard";

	$conn = mysqli_connect($host, $un, $pw, $DB);

	if(!$conn)
	{
	die("connection error... " .mysqli_connect_error());
	}
	//echo("<p>Connection to database established...</p>");
?>
