<!DOCTYPE html>
<html>
<head>
	<title>Table Test</title>
</head>
<body>
<table>
	<tr>
		<th>Name</th>
		<th>Score</th>
	</tr>
	<?php
	$host = "localhost";
	$un = $pw = "root";

	$conn = mysqli_connect($host, $us, $pw);

	if(!$conn)
	{
	die("connection error... " .mysqli_connect_error());
	}
	echo("<p>Connection to database established...</p>");


	$sql = "CREATE DATABASE leaderboard";

	if ($conn->query($sql))
		echo("Database created successfully");
	else
		echo("Error " .$conn->error);


	$sql = "SELECT name, score from leaderboard";
	$result = $conn-> query($sql);

	if ($result-> num_rows > 0) {
		while ($row = $result-> fetch_assoc()) {
			echo "<tr><td>". $row["name"] ."</td><td>" .$row["score"] . "</td></tr>";
		}
		echo "</table>";
	}
	else { 
		echo "nothing";
	}

	$conn-> close();
	?>

</table>
</body>

</body>
</html>