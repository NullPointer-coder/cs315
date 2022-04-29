<?php
/**
 * Jingbo Wang
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

session_start();

$loggedin = isset($_SESSION['username']);
if (isset($_SESSION['manager']))
{
  $managerin = $_SESSION['manager'];
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

    <aside>
      <?php if ($loggedin): ?>
        <p>
          Hello,<br />
          <?= $_SESSION['displayname'] ?>
          !
        </p>
        <p>
          <button id="me" type="button">About Me</button>
          &nbsp;
          <button id="logout" type="button">Logout</button>
        </p>
      <?php else: ?>
        <p>
          <button id="login" type="submit" name="submit">Login</button>
          <br />
          <button id="signup" type="button">Sign Up</button>
        </p>
      <?php endif; ?>
    </aside>

    <section>
      <h2>
        <?php if ($loggedin): ?>
          Manage Our Public Data
        <?php else: ?>
          Here is Our Public Data
        <?php endif; ?>
      </h2>

      <?php $data = array(
                  array('ACME Web',
                       'https://sand.truman.edu/~jw6347/204/company.html'),
                  array('Words Manager',
                  'https://sand.truman.edu/~jw6347/420/managewords.html'));
      ?>
      <ul>
        <?php foreach ($data as $item): ?>
          <li>
            <?php if ($loggedin): ?>
              <a href="<?= $item[1] ?>"><?= $item[0] ?></a>
            <?php else: ?>
              <?= $item[0] ?>
            <?php endif; ?>
          </li>
        <?php endforeach; ?>
      </ul>
      <?php if ($loggedin && $managerin == 1): ?>
        <button id="manager" type="button">
          User Manager
        </button>
      <?php endif; ?>

    </section>
    <script src="home.js"></script>
  </body>
</html>
