$sql[] = "CREATE TABLE leaderboard (
    id int auto_increment primary key,
    name varchar(50) unique NOT NULL,
    score int NOT NULL
  )";

  doSQL($sql);
  unset($sql);

  $sql[] = "INSERT INTO leaderboard (name, score) 
        VALUES ('Uli', 25953)";
  doSQL($sql);
  unset($sql);
  $sql[] = "INSERT INTO leaderboard (name, score) 
        VALUES ('Viran', 22)";
  doSQL($sql);
  unset($sql);
  $sql[] = "INSERT INTO leaderboard (name, score) 
        VALUES ('Boz', 22)";
  doSQL($sql);
  unset($sql);
  $sql[] = "INSERT INTO leaderboard (name, score) 
        VALUES ('Sam', 14)";
  doSQL($sql);
  unset($sql);

  // drop existing database leaderboard
  $sql[] = "DROP DATABASE IF EXISTS leaderboard";

  doSQL($sql);
  unset($sql);

  $sql[] = "CREATE DATABASE leaderboard";
  doSQL($sql);
  unset($sql);