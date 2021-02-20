<?php
  require("connection.php");
  $sql = "DROP table IF EXISTS leaderboard";
  $sql = "CREATE DATABASE leaderboard";
  $sql = "CREATE TABLE leaderboard (
          id INT(6) UNSIGNED AUTOINCREMENT PRIMARY KEY,
          name VARCHAR(15) not null UNIQUE,
          score INT(7) not null
          )";

  $sql = "INSERT INTO leaderboard (name, score)
           VALUES ('Uli', 10000)";
 $sql = "INSERT INTO leaderboard (name, score)
           VALUES ('Sani', 1000)";
  $sql = "INSERT INTO leaderboard (name, score)
           VALUES ('Zitu', 100)";

 $result = $conn->query($sql) or die($conn->error);

 mysqli_select_db($conn, "leaderboard");

  

  $sql = "SELECT * FROM leaderboard";
  $records = $conn->query($sql);



$main = "
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Leaderboard</title>
  <link rel='stylesheet' type='text/css' href='webSiteStyleSheet.css'>
</head>
<body>
  <div class='createAccFillerSpace'></div>
  <div class='bounceLeaderboard'></div>

  <div class='cloud'></div>
  <div class='cloud1'></div>
  <div class='cloud2'></div>
  

  <div class='NumberANDnameANDscore'>
    <div class='number'>
    	<div class='numberPic'></div>
    </div>
    <div class='name'>
    	<div class='namePic'></div>
    </div>
    <div class='score'>
    	<div class='scorePic'></div>
    </div>
  </div>";
  $count = 1;
  while ($row = $records ->fetch_assoc())
  {
  $main .= "<div class='tableRow'>
  	<div class='cell'>
  		<div class='row$count'></div>
  	</div>
  	<div class='cell'>
  		<div class='textbox'>
    $row[name]</div>
  	</div>
  	<div class='cell'>
  		<div class='textbox'>$row[score]</div>
  	</div>
  </div>";
  $count = $count + 1;
  }




      
  $main .=  "</div>
  </div>
</body>
</html>";

echo $main;




  function doSQL($sql)
  {
    global $conn;

    foreach($sql as $statement)
    {
      //echo("<p>$statement - ");

      if(mysqli_query($conn, $statement))
      {
        //echo("ok</p>");
      }
      else
      {
        //die(mysqli_error($conn));
      }
    }
  }

?>