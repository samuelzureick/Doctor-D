<?php
	$host = "dbhost.cs.man.ac.uk";
	$un = "x83005sz"; 
	$pw = "x14databasepass";
	//$DB = "leaderboard";
	//$database = "leaderboard";

	$conn = mysqli_connect($host, $un, $pw);

	if(!$conn)
	{
	die("connection error... " .mysqli_connect_error());
	}
	//echo("<p>Connection to database established...</p>");
?>
