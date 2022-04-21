<?php
/**
 * This program allows the user to delete words in DB.
 * @author Jingbo Wang
 * @version 20 April 2022
 */
error_reporting(E_ALL);
define( 'NUMBER', '/^[0-9]+$/');

$data = [];
$id_list = [];
$id_list_ok = true;

if (isset($_POST) && isset($_POST['payload']))
{
  $data = json_decode($_POST['payload']);
  foreach ($data as $id)
  {
    if (!isset($id) || !preg_match(NUMBER, $id))
    {
      $id_list_ok = false;
    }
  }
}
else
{
  exit();
}

if ($id_list_ok)
{
  require('../../cs315/dblogin/dblogin.php');
  $db = new PDO("mysql:host=$db_host; dbname=jw6347; charset=utf8mb4",
              $db_user, $db_pass,
              array(PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
  $id_list = $data;
  foreach ($id_list as $id)
  {
    $query = 'delete from word where id = :id';
    $statement = $db->prepare($query);
    $statement->bindValue(':id', $id, PDO::PARAM_INT);
    $statement->execute();
  }
}
?>
