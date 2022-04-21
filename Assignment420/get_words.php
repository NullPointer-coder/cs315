<?php
/**
 * This program allows the user to get words from DB
 * @author Jingbo Wang
 * @version 20 April 2022
 */
error_reporting(E_ALL);

if (!isset($_GET) ||
    !isset($_GET['search']) || !preg_match('/^[a-z]+$/', $_GET['search']))
{
  exit();
}

require('../../cs315/dblogin/dblogin.php');
$db = new PDO("mysql:host=$db_host; dbname=jw6347; charset=utf8mb4",
              $db_user, $db_pass,
              array(PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

$search = $_GET['search'];
$search = "^$search.*";

$query = 'select w.id, w.word, p.part, w.definition from word as
                    w join part as p on w.part_id = p.id where w.word regexp
                     ?  order by w.word, p.part';
$statement = $db->prepare($query);
$statement->bindValue(1, $search, PDO::PARAM_STR);
$statement->execute();
$continents = $statement->fetchAll();

$result = [];
foreach ($continents as $row)
{
  $result[] = array($row[0], $row[1], $row[2], $row[3]);
}
?>
<?= json_encode($result); ?>
