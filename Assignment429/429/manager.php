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
session_start();

$loggedin = isset($_SESSION['username']);
if (isset($_SESSION['manager']))
{
  $managerin = $_SESSION['manager'];
}

$msg = '';

$delete_ok = false;
$demote_ok = false;
$promote_ok = false;

if (isset($_POST) && isset($_POST['delete_list'])
      && count($_POST['delete_list']) != 0)
{
  $count = 0;
  $unsafe_delete_list = $_POST['delete_list'];
  $query = 'select user_name from user where id = :id';
  $statement = $db->prepare($query);
  foreach ($unsafe_delete_list as $id)
  {
    $statement->bindValue(':id', $id);
    $statement->execute();
    $unsafe_name = $statement->fetchAll(PDO::FETCH_ASSOC);
    if (count($unsafe_name) == 1)
    {
      $count++;
    }
  }
  if (count($unsafe_delete_list) == $count)
  {
    $delete_ok = true;
    $delete_list = $_POST['delete_list'];
  }
}

if (isset($_POST) && isset($_POST['demote_list'])
      && count($_POST['demote_list']) != 0)
{
  $count = 0;
  $unsafe_demote_list = $_POST['demote_list'];
  $query = 'select user_name from user where id = :id and manager = 1';
  $statement = $db->prepare($query);
  foreach ($unsafe_demote_list as $id)
  {
    $id = explode('_', $id);
    $statement->bindValue(':id', $id[1]);
    $statement->execute();
    $unsafe_name = $statement->fetchAll(PDO::FETCH_ASSOC);
    if (count($unsafe_name) == 1)
    {
      $count++;
    }
  }
  if (count($unsafe_demote_list) == $count)
  {
    $demote_ok = true;
    $demote_list = $_POST['demote_list'];
  }
}

if (isset($_POST) && isset($_POST['promote_list'])
      && count($_POST['promote_list']) != 0)
{
  $count = 0;
  $unsafe_promote_list = $_POST['promote_list'];
  $query = 'select user_name from user where id = :id and manager = 0';
  $statement = $db->prepare($query);
  foreach ($unsafe_promote_list as $id)
  {
    $id = explode('_', $id);
    $statement->bindValue(':id', $id[1]);
    $statement->execute();
    $unsafe_name = $statement->fetchAll(PDO::FETCH_ASSOC);
    if (count($unsafe_name) == 1)
    {
      $count++;
    }
  }
  if (count($unsafe_promote_list) == $count)
  {
    $promote_ok = true;
    $promote_list = $_POST['promote_list'];
  }
}

if($delete_ok)
{
  $query = 'select password_id from user where id = :id';
  $statement = $db->prepare($query);
  $passid_list = [];
  foreach ($delete_list as $id)
  {
    $statement->bindValue(':id', $id);
    $statement->execute();
    $passid = $statement->fetchAll(PDO::FETCH_ASSOC);
    array_push($passid_list, $passid[0]["password_id"]);
  }

  $query = 'delete from user where id = :id';
  $statement = $db->prepare($query);
  foreach ($delete_list as $id)
  {
    $statement->bindValue(':id', $id);
    $statement->execute();
  }

  $query = 'delete from password where id = :id';
  $statement = $db->prepare($query);
  foreach ($passid_list as $id)
  {
    $statement->bindValue(':id', $id);
    $statement->execute();
  }
}

if ($demote_ok)
{
  $query = 'update user as u set manager = 0
                       where u.id = :id';
  $statement = $db->prepare($query);
  foreach ($demote_list as $id)
  {
    $id = explode('_', $id);
    $statement->bindValue(':id', $id[1]);
    $statement->execute();
  }
}

if ($promote_ok)
{
  $query = 'update user as u set manager = 1
                     where u.id = :id';
  $statement = $db->prepare($query);
  foreach ($promote_list as $id)
  {
    $id = explode('_', $id);
    $statement->bindValue(':id', $id[1]);
    $statement->execute();
  }
}

$sql = 'select u.id, u.user_name, u.manager from user as u';
$statement = $db->prepare($sql);
$statement->execute();
$delete_result = $statement->fetchAll(PDO::FETCH_ASSOC);

$sql = 'select u.id, u.user_name from user as
                    u where u.manager = 1';
$statement = $db->prepare($sql);
$statement->execute();
$demote_result = $statement->fetchAll(PDO::FETCH_ASSOC);

$sql = 'select u.id, u.user_name from user as
                    u where u.manager = 0';
$statement = $db->prepare($sql);
$statement->execute();
$promote_result = $statement->fetchAll(PDO::FETCH_ASSOC);

if ($delete_ok || $demote_ok || $promote_ok)
{
  $msg = "Successfully edited!";
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
        User Manager
      </h1>
    </header>
    <?php if ($loggedin && $managerin == 1): ?>
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
          <button id="home" type="button">
            Home
          </button>
        </p>
      </aside>
        <?php if ($msg !== '') : ?>
        <p id="success"><?= $msg ?></p>
      <?php endif; ?>
        <fieldset><legend>Manage Users</legend>
            <div id="manager_chosen">
              <p id="cb-p-delete" class="checked">
                <input type="checkbox" id="delete_cb" hidden/>
                <label for="delete_cb">Delete Users</label>
              </p>
              <p id="cb-p-demote" class="not_checked">
                <input type="checkbox" id="demote_cb" hidden/>
               <label for="demote_cb">Demote User</label>
              </p>
              <p id="cb-p-promote" class="not_checked">
                <input type="checkbox" id="promote_cb" hidden/>
                <label for="promote_cb">Promote User</label>
              </p>
          </div>
          <form method="post" action="manager.php" id="delete" class="visible">
            <p>
              Total:
              <span id="delete_total"><?= count($delete_result)?></span>, select
              <span id="delete_id">0</span> Users and Administrators.
            </p>
            <div id="delete_result">
              <div id="delete-wrapper">
                <?php foreach ($delete_result as $user):?>
                <div>
                  <input type="checkbox" id="<?= $user['id'] ?>" name="delete_list[]"
                              value="<?= $user['id'] ?>" />
                  <label id="<?= $user['user_name'] ?>" for="<?= $user['id'] ?>">
                    <?= $user['user_name'] ?>
                    <?php if ($user['manager'] == 1): ?>
                      <span class="warning">: Administrator</span>
                    <?php else: ?>
                      <span>: User</span>
                    <?php endif; ?>
                  </label>
                </div>
                <?php endforeach;?>
              </div>
            </div>
            <div>
              <button id="delete_submit" type="submit" name="submit">
                Delete
              </button>
            </div>
          </form>
           <form method="post" action="manager.php" id="demote" class="invisible">
              <p>
                Total:
                <span id="demote_total"><?= count($demote_result)?></span>, select
                <span id="demote_id">0</span> Administrators.
              </p>
              <div id="demote_result">
                <div id="demote-wrapper">
                <?php foreach ($demote_result as $user ): ?>
                  <div>
                    <input type="checkbox" id="dem_<?= $user['id'] ?>" name="demote_list[]"
                              value="dem_<?= $user['id'] ?>" />
                    <label id="<?= $user['user_name'] ?>" for="dem_<?= $user['id'] ?>">
                      <?= $user['user_name'] ?>
                    </label>
                  </div>
                  <?php endforeach;?>
                </div>
              </div>
            <div>
              <button  id="demote_submit" type="submit" name="submit">
                Demote
              </button>
            </div>
          </form>
          <form method="post" action="manager.php" id="promote" class="invisible">
            <p>
              Total:
              <span id="promote_total"><?= count($promote_result)?></span>, select
              <span id="promote_id">0</span> Users.
            </p>
            <div id="promote_result">
              <div id="promote-wrapper">
              <?php foreach ($promote_result as $user ): ?>
                <div>
                  <input type="checkbox" id="prom_<?= $user['id'] ?>" name="promote_list[]"
                              value="prom_<?= $user['id'] ?>" />
                  <label id="prom_<?= $user['user_name'] ?>" for="prom_<?= $user['id'] ?>">
                    <?= $user['user_name'] ?>
                  </label>
                </div>
              <?php endforeach;?>
              </div>
            </div>
            <div>
              <button  id="promote_submit" type="submit" name="submit">
                Promote
              </button>
            </div>
          </form>
        </fieldset>
    <?php elseif ($loggedin && $managerin != 1): ?>
    <section>
      <h2>
          You are not manager! Go back to Home Page!
        </h2>
        <p>
          <button id="home" type="submit">Home</button>
        </p>
    </section>
    <?php else: ?>
      <section>
        <h2>
          Log in or sign up first!
        </h2>
          <p>
            <button id="signup" type="submit">Sign Up</button>
            &nbsp; &nbsp;
            <button id="login" type="button">Log In</button>
          </p>
      </section>
    <?php endif; ?>
    <script src="manager.js"></script>
  </body>
</html>
