<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

/**
 * This program allows the user to add a new entry in the words file.
 * @author Jingbo Wang
 * @version 1 April 2022
 */
define('DEFINITION_FILENAME', 'words.txt');

/**
 * get the words from file into array
 * @param  $filename  the file will be open
 * @return array the array include words  in the file
 */
function get_word_into_array($filename)
{
  $file = fopen($filename, 'r');
  $array = array();
  while (($line = fgets($file)) !== false)
  {
    $array[] = explode("\t", rtrim($line));
  }
  fclose($file);
  return $array;
}

$word_list = get_word_into_array(DEFINITION_FILENAME);
?>
<?= json_encode($word_list) ?>
