<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Create Account</title>
  <link rel='stylesheet' type='text/css' href='images/webSiteStyleSheet.css'>
</head>
<body onload='warning()'>
  <div class='createAccFillerSpace'>
    <div class='bounceCreateAccount'></div>
  </div>
  

  <div class='cloud'></div>
  <div class='cloud1'></div>
  <div class='cloud2'></div>
  

  <div class='username'>
    <div class='usernamePic'></div>
    <div class='usernameForm'>
      <form method='POST' action='doRegister.php'>
        <input type='text' id='username' name='username'>
    </div>
  </div>

  <div class='password'>
    <div class='passwordPic'></div>
    <div class='passwordForm'>
        <input type='password' id='create_password' name='create_password'><br>
    </div>
  </div>

    <div class='confirmPassword'>
      <div class='confirmPasswordPic'></div>
      <div class='confirmPasswordForm'>
          <input type='password' id='pwc' name='pwc'><br>
        
      </div>
    </div>

  <div class='confirmAndCancel'>
    
    <div class='confirmParent'>
      <button class='confirmButton' type='submit'></button>
      </form>
    </div>

    <div class='cancelParent'>
      <button class='cancelButton' onclick="location.href='Menu.html';"></button>
    </div>

  </div>

      
    </div>
  </div>
</body>
<script>
  function warning(){
  alert("-------WARNING-------\nPLEASE DO NOT ENTER ANY SENSITIVE PASSWORDS OR OTHER INFORMATION AT THIS POINT\nCURRENTLY THERE IS NO SECURE PASSWORD STORAGE AND WE ARE VULNERABLE TO SQL INJECTIONS");
}
  </script>
</html>