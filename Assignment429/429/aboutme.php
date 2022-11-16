<?php
/**
 * Jingbo Wang
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

require ('../../cs315/dblogin/dblogin.php');
$db = new PDO("mysql:host=$db_host;dbname=jw6347;charset=utf8mb4",
              $db_user, $db_pass,
              array(PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
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

session_start();
$loggedin = isset($_SESSION['username']);
$new_displayname_ok = false;
$new_password_ok = false;
$msg = '';
if (isset($_POST) && isset($_POST['new_displayname'])
      && !is_not_printable($_POST['new_displayname'])
      && strlen($_POST['new_displayname']) != 0)
{
  $new_displayname_ok = true;
  $new_displayname = $_POST['new_displayname'];
  $new_displayname = htmlspecialchars($new_displayname);
  $_SESSION['displayname'] = $new_displayname;
}

if (isset($_POST) && isset($_POST['new_password'])
      && strlen($_POST['new_password']) != 0
      && password_ok($_POST['new_password']))
{
  $new_password_ok = true;
  $new_password = $_POST['new_password'];
}

if ($new_displayname_ok)
{
  $sql = 'update user as u set display_name = :new_displayname
                  where u.user_name = :username';
  $statement = $db->prepare($sql);
  $statement->bindValue(':new_displayname', $new_displayname);
  $statement->bindValue(':username', $_SESSION['username']);
  $statement->execute();
}

if ($new_password_ok)
{
  $sql = 'select u.password_id from user as
                    u where u.user_name = :username';
  $statement = $db->prepare($sql);
  $statement->bindValue(':username', $_SESSION['username']);
  $statement->execute();
  $sql_result = $statement->fetchAll(PDO::FETCH_ASSOC);
  $username_id = $sql_result[0]['password_id'];

  $new_password = password_hash($new_password, PASSWORD_DEFAULT);
  $sql = 'update password as p set password = :newpassword
                  where p.id = :passwordid';
  $statement = $db->prepare($sql);
  $statement->bindValue(':newpassword', $new_password);
  $statement->bindValue(':passwordid', $username_id);
  $statement->execute();
}

if ($new_displayname_ok || $new_password_ok)
{
  $msg = "Successful chaged!";
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
        Your Profile
      </h1>
    </header>
    <?php if ($loggedin): ?>
      <aside id="aboutme">
        <p>
          Hello,
          <br />
          <a>
            <?= $_SESSION['displayname'] ?>
          </a>
          !
        </p>
        <p>
          <button id="home" type="button">Home</button>
        </p>
      </aside>
        <?php if ($msg !== '') : ?>
        <p id="success"><?= $msg ?></p>
      <?php endif; ?>
      <form  method="post" action="aboutme.php">
        <fieldset><legend>Manage your Profile</legend>
          <div id="manage_chosen">
            <p id="cb-p-name" class="checked">
              <input type="checkbox" id="name_cb" hidden/>
              <label for="name_cb">Change Display Name</label>
            </p>
            <p id="cb-p-pass" class="not_checked">
              <input type="checkbox" id="pass_cb" hidden/>
               <label for="pass_cb">Change Password</label>
            </p>
          </div>
          <p id="new-displayname" class="visible">
            <label for="new_displayname">New display Name:</label>
            <input type="text" id="new_displayname" name="new_displayname"
                          placeholder="any printable characters" />
            <span id="name_test" class="warning"> &cross; </span>
          </p>
          <p id="new-password" class="invisible">
            <label for="new_password">New  password:</label>
            <input type="password" id="new_password"
                          name="new_password"
                          placeholder="minimum length 6"/>
            <span id="newpassword_test" class="warning">&cross;</span>
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
          <p id="re-password" class="invisible">
            <label for="re_password">Re-enter password:</label>
            <input type="password" name="re_password" id="re_password"
                   placeholder="minimum length 6" />
            <span id="repassword_test" class="warning"> &cross; </span>
          </p>
          <p>
            <button  id="submit" type="submit" name="submit" class="visible">
              ok
            </button>
          </p>
        </fieldset>
      </form>
    <?php else: ?>
      <section>
        <h2>
          Log in or sign up first!
        </h2>
          <p>
            <button id="signup" type="button">Sign Up</button>
            &nbsp; &nbsp;
            <button id="login" type="button">Log In</button>
          </p>
      </section>
    <?php endif; ?>
    <script src="aboutme.js"></script>
  </body>
</html>
