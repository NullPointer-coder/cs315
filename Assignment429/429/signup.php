<?php
/**
 * Jingbo Wang
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
session_start();

/**
 * this version is modified: it does not check for HTML injection
 * in the display name
*/

/**
   * to bool password is ok or not
   * @param $password the enter password
   * @return if password is not ok, return false, otherwise is true
   */
  function password_ok($password)
 {
  $password_ok = false;
  $have_upper = false;
  $have_lower = false;
  $have_digit = false;
  $have_punctuation = false;
  if (preg_match('|[A-Z]+|', $password))
  {
    $have_upper = true;
  }
  if (preg_match('|[a-z]+|', $password))
  {
    $have_lower  = true;
  }
  if (preg_match('|[0-9]+|', $password))
  {
    $have_digit  = true;
  }
  if (preg_match('|[!"#%&\'()*,.\\\/:;?@\[\]_{}-]+|', $password))
  {
    $have_punctuation  = true;
  }
  if ( $have_upper && $have_lower && $have_digit && $have_punctuation)
  {
    $password_ok = true;
  }
  return $password_ok;
 }

/**
 * to bool the string is printable or not
 * @param $string the input string
 * @return true if the input string is not printable; false is printable
*/
  function is_not_printable($string)
  {
    $index = 0;
    $done = false;
    if (!ctype_space($string))
    {
      while ($index < strlen($string) && !$done)
      {
        if (ctype_space($string[$index]))
        {
          $index++;
        }
        else
        {
          if (!ctype_graph($string[$index]))
          {
            $done = true;
          }
          $index++;
        }
      }
    }
    else
    {
    $done = true;
    }
    return $done;
  }

if (isset($_SESSION['username'])) : ?>
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
      <p>
        You are already logged in as <?= $_SESSION['displayname'] ?>!
      </p>
      <p>
        <button id="ok" type="button">OK</button>
      </p>
    </section>
    <script src="signup.js"></script>
  </body>
</html>
<?php
exit;
endif;

require('../../cs315/dblogin/dblogin.php');
$db = new PDO("mysql:host=$db_host;dbname=jw6347;charset=utf8mb4",
              $db_user, $db_pass,
              array(PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

$error_msg = '';
$manager = 0;
if (isset($_POST['submit']))
{
  if (isset($_POST['username']) &&
      preg_match('|^\w+$|', $_POST['username']) &&
      isset($_POST['password']) &&
      password_ok($_POST['password']) &&
      isset($_POST['displayname']) &&
      !is_not_printable($_POST['displayname']))
  {
    $sql = 'select user_name from user where user_name = :username';
    $statement = $db->prepare($sql);
    $statement->bindValue(':username', $_POST['username']);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

    if (count($result) > 0)
    {
      $error_msg = 'That username is already in use';
    }
    else
    {
      $username = $_POST['username'];
      $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
      $displayname = $_POST['displayname'];
      $displayname = htmlspecialchars($displayname);
      $sql = "insert into password (password) values (:password)";
      $statement = $db->prepare($sql);
      $statement->bindValue(':password', $password);
      $statement->execute();

      $sql = 'insert into user (user_name, display_name, manager, password_id)
              values
              (:username, :displayname, false, LAST_INSERT_ID())';
      $statement = $db->prepare($sql);
      $statement->bindValue(':username', $username);
      $statement->bindValue(':displayname', $displayname);

      $statement->execute();
      $_SESSION['username'] = $username;
      $_SESSION['displayname'] = $displayname;
      $_SESSION['manager'] = $manager;
    }
  }
}

if (!isset($_SESSION['username'])):
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
      <?php if ($error_msg !== '') : ?>
        <p id="error"><?= $error_msg ?></p>
      <?php endif; ?>
      <form action="signup.php" method="post">
        <fieldset><legend>Sign Up</legend>
          <p>
            <label for="username">Username: </label>
            <input type="text" required autofocus
                   name="username" id="username"
                   placeholder="letters, digits, underscore" />
            <span id="name_test" class="warning"> &cross; </span>
          </p>

          <p>
            <label for="password">Password: </label>
            <input type="password" required name="password"
                          placeholder="minimum length 6"
                          pattern="[^ ]{6,}"
                          id="password" />
            <span id="password_test" class="warning">&cross;</span>
            <span id="test" class="invisible">
              <br />
              <span id="length_test" class="warning">&cross;</span>
              <span>minimum length 6</span>
              <span id="uppercase_test" class="warning">&cross;</span>
              <span>uppercase</span>
              <span id="lowercase_test" class="warning"> &cross; </span>
              <span>lowercase</span>
              <span id="digit_test" class="warning"> &cross; </span>
              <span>digit</span>
              <span id="punctuation_test" class="warning"> &cross; </span>
              <span>punctuation</span>
            </span>
          </p>
          <p>
            <label for="re_password">Re-Enter Password: </label>
            <input type="password" required name="re_password"
                         placeholder="minimum length 6"
                         pattern="[^ ]{6,}"
                         id="re_password" />
            <span id="repassword_test" class="warning"> &cross; </span>
          </p>

          <p>
            <label for="displayname">Display Name: </label>
            <input type="text" required name="displayname"
                   placeholder="letters, digits, spaces" id="displayname" />
            <span id="displayname_test" class="warning"> &cross; </span>
          </p>

          <p>
            <button id="submit" type="submit" name="submit">Sign Up</button>
            &nbsp; &nbsp;
            <button id="home" type="button">Back Home</button>
          </p>
        </fieldset>
      </form>
    </section>
    <script src="signup.js"></script>
  </body>
</html>
<?php else :
header('Location: home.php');
endif; ?>
