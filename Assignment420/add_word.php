<?php
/**
 * This program allows the user to add a new entry in DB.
 * @author Jingbo Wang
 * @version 20 April 2022
 */
error_reporting(E_ALL);
define( 'LOWER_CHARS', '/^[a-z]+$/');

/**
 * to get part_id by part value
 * @param $part part of speech will be chacked
 * @return the part_id
 */
function get_part_id($part)
{
  $part_list = array( "adjective",  "adverb", "noun", "verb");
  $index = 0;
  $done = false;
  while($index < count($part_list) && !$done)
  {
    if($part == $part_list[$index])
    {
      $done = true;
    }
    $index++;
  }
  return $index;
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

/**
 * to chack the word is duplicate or not
 * @param $db the word data base
 * @param $word the added word
 * @param $part the added word's part of speech
 * @return true if the input string is not printable; false is printable
 */
function is_duplicate($db, $word, $part)
{
  $duplicate = false;
  $query = 'select w.word, p.part from word as
                       w join part as p on w.part_id = p.id';
  $statement = $db->prepare($query);
  $statement->execute();
  $continents = $statement->fetchAll();
  $index = 0;
  while ($index < count($continents) && !$duplicate)
  {
    if (strcmp($word, $continents[$index][0]) == 0
         && strcmp($part, $continents[$index][1]) == 0)
    {
      $duplicate = true;
    }
    $index++;
  }
  return $duplicate;
}

$word_ok = false;
$part_ok = false;
$defn_ok = false;
$duplicate = false;

if (isset($_POST) && isset($_POST['payload']))
{
  $data = json_decode($_POST['payload']);

  $data[0] = trim($data[0]);
  $data[1] = trim($data[1]);
  $data[2] = str_replace(["\r\n", "\r", "\n"], ' ', $data[2]);
  $data[2] = trim($data[2]);

  if (isset($data[0]) && preg_match(LOWER_CHARS, $data[0]))
  {
    $word = $data[0];
    $word_ok = true;
  }

  if (isset($data[1]) && preg_match(LOWER_CHARS, $data[1]))
  {
    $part = $data[1];
    $part_id = get_part_id($part);
    $part_ok = true;
  }

  if (isset($data[2]) && !is_not_printable($data[2]))
  {
    $defn = htmlentities($data[2]);
    $defn_ok = true;
  }
}
else
{
  exit();
}

if ($word_ok && $part_ok && $defn_ok)
{
  require('../../cs315/dblogin/dblogin.php');
  $db = new PDO("mysql:host=$db_host; dbname=jw6347; charset=utf8mb4",
                                   $db_user, $db_pass,
                            array(PDO::ATTR_EMULATE_PREPARES => false,
                   PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $duplicate = is_duplicate($db, $word, $part);
  if (!$duplicate)
  {
    $query = 'insert into word (word, part_id, definition)
                      values (:word, :part_id, :defn)';
    $statement = $db->prepare($query);

    $statement->bindValue(':word', $word, PDO::PARAM_STR);
    $statement->bindValue(':part_id', $part_id, PDO::PARAM_INT);
    $statement->bindValue(':defn', $defn, PDO::PARAM_STR);

    $statement->execute();
  }
}
?>
<?= json_encode($duplicate); ?>
