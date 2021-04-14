<?php
	if(!isset($_SESSION))
	{
		session_start();
	}

	$host = 'dbhost.cs.man.ac.uk';
	$un = 'x83005sz'; 
	$pw = 'databasepassword';
	$DB = 'x83005sz';
	//$database = "leaderboard";

	$conn = mysqli_connect($host, $un, $pw, $DB);

	if(!$conn)
	{
	die('connection error... ' .mysqli_connect_error());
	}
	//echo("<p>Connection to database established...</p>");
?>
