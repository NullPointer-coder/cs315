<?php
/**
 * Jingbo Wang
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');
session_start();

require ('../../cs315/dblogin/dblogin.php');

$db = new PDO("mysql:host=$db_host;dbname=jw6347;charset=utf8mb4",
              $db_user, $db_pass,
              array(PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

$error_msg = '';
$already_logged_in = false;

if (!(isset($_SESSION['username'])))
{
  if (isset($_POST['submit']))
  {
    if (isset($_POST['username']) &&
        preg_match('|^\w+$|', $_POST['username']) &&
        isset($_POST['password']) &&
        preg_match('|^\S+$|', $_POST['password']))
    {
      $sql = 'select u.user_name, u.display_name, p.password, u.manager
              from user as u join password as p on u.password_id = p.id
              where u.user_name = :username';
      $statement = $db->prepare($sql);
      $statement->bindValue(':username', $_POST['username']);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);

      if (count($result) == 1)
      {
        if (password_verify($_POST['password'], $result[0]['password']))
        {
          $_SESSION['username'] = $result[0]['user_name'];
          $_SESSION['displayname'] = $result[0]['display_name'];
          $_SESSION['manager'] = $result[0]['manager'];
          header('Location: home.php');
          exit();
        }
        else
        {
          $error_msg = 'Username-password pair is invalid';
        }
      }
      else
      {
        $error_msg = 'Username-password pair is invalid';
      }
    }
    else
    {
      $error_msg = 'You must enter a valid username-password pair';
    }
  }
}
else
{
  $already_logged_in = true;
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="session.css" />
    <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">
    <title>Sand File</title>
  </head>

  <body>
    <header>
      <h1>
        Jingbo Website Manager
      </h1>
    </header>

    <section>
    <?php if ($already_logged_in): ?>
      <p>
        You are already logged in as <?= $_SESSION['displayname'] ?> !
      </p>
      <div id="<?= $_SESSION['manager'] ?>">
      </div>
      <p>
        <button id="ok" type="button">OK</button>
      </p>

    <?php else:
      if (!empty($error_msg)): ?>
        <p id="error"><?= $error_msg ?></p>
      <?php endif; ?>
        <form action="login.php" method="post">
          <fieldset><legend>Log In</legend>
            <p>
              <label for="username">Username: </label>
              <input type="text" pattern="\w+" required autofocus
                     name="username" id="username"
                     placeholder="letters, digits, underscore" />
            </p>

            <p>
              <label for="password">Password: </label>
              <input type="password" required name="password"
                     placeholder="minimum length 6" pattern="[^ ]{6,}"
                     id="password" />
            </p>

            <p>
              <button type="submit" name="submit">Log In</button>
              &nbsp; &nbsp;
              <button id="home" type="button">Back Home</button>
            </p>
          </fieldset>
        </form>
      <?php endif; ?>
    </section>
    <script src="login.js"></script>
  </body>
</html>
