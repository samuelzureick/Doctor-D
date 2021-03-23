<?php
$main = "<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Create Account</title>
  <link rel='stylesheet' type='text/css' href='static/css/webSiteStyleSheet.css'>
</head>
<body>
  <div class='createAccFillerSpace'>
      <div class='bounceCreateAccount'></div>
  </div>


  <div class='cloud'></div>
  <div class='cloud1'></div>
  <div class='cloud2'></div>
  

  <div class='username'>
    <div class='usernamePic'></div>
    <div class='usernameForm'>
      <form action='doRegister.php' method='post'>
        <input type='text' id='create_username' name='username'>
        </form>
    </div>
  </div>

  <div class='password'>
    <div class='passwordPic'></div>
    <div class='passwordForm'>
    <form action='doRegister.php' method='post'>
        <input type='password' id='create_password' name='create_password'><br>
       </form>
      
    </div>
  </div>

    <div class='confirmPassword'>
      <div class='confirmPasswordPic'></div>
      <div class='confirmPasswordForm'>
        <form action='doRegister.php' method='post'>
          <input type='password' id='confirm_password' name='confirm_password'><br>
        </form>
      </div>
    </div>

  <div class='confirmAndCancel'>
    
    <div class='confirmParent'>
      <button class='confirmButton' type='submit' formmethod='post'></button>
    </div>

    <div class='cancelParent'>
      <button class='cancelButton'></button>
    </div>

  </div>

      
    </div>
  </div>
</body>
</html>";

echo $main;

?>