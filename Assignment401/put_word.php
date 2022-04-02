<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

/**
 * This program allows the user to add a new entry in the words file.
 *
 * @author Jingbo Wang
 * @version 1 April 2022
 */
define('DEFINITION_FILENAME', 'words.txt');
define( 'LOWER_CHARS', '/^[a-z]+$/');

/**
 * get get the each lines from file into array
 * @param  $filename  the file will be open
 * @return array the array include words  in the file
 */
function get_line_into_array($filename)
{
  $file = fopen($filename, 'r');
  $array = array();
  while (($line = fgets($file)) !== false)
  {
    $array[] = rtrim($line);
  }
  fclose($file);
  return $array;
}

/**
 * could search the key word in the input file
 * @param $file_name  name of the input file
 * @param $searched_word the input word need to be search
 * @param $part the part of speech of input word
 * in the words dictionary.
 * @return true if the word is found; false otherwise
 */
function search_word($lines, $searched_word, $part)
{
  $index = 0;
  $done = false;
  while ($index < count($lines) && !$done)
  {
    $result[] = explode("\t", rtrim($lines[$index]));
    if (strcmp($result[0][0], $searched_word) == 0
                && strcmp($result[0][1], $part) == 0)
    {
      $done = true;
    }
    $index++;
  }
  return $done;
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

$word_list = get_line_into_array(DEFINITION_FILENAME);

if (isset($_POST) && isset($_POST['payload']))
{
  $json_data = json_decode($_POST['payload']);
  // get word
  $word = $json_data[0];
  $word = trim($word);
  // get part of speech
  $pos = $json_data[1];
  $pos = trim($pos);
  // get definition
  $definition = str_replace(["\r\n", "\r", "\n"], ' ', $json_data[2]);
  $definition = str_replace("∆", "&", $definition);
  $definition = str_replace("ß", "+", $definition);
  $definition = trim($definition);

  if (preg_match(LOWER_CHARS, $word)
       && !search_word($word_list, $word, $pos)
       && !is_not_printable($definition))
  {
    $definition = htmlspecialchars($definition);
    $added_word = "$word\t$pos\t$definition";

    $done = false;
    $index = 0;
    while ($index < count($word_list) && !$done)
    {
      if (strcmp($added_word, $word_list[$index]) > 0)
      {
        $index++;
      }
      else
      {
        array_splice($word_list, $index, 0, $added_word);
        $done = true;
      }
      if (strcmp($added_word, $word_list[count($word_list) - 1]) > 0)
      {
        $word_list[count($word_list)] = $added_word;
        $done = true;
      }
    }
    $file = fopen(DEFINITION_FILENAME, 'w');
    foreach ($word_list as $row)
    {
      fwrite($file, $row . PHP_EOL);
    }
  }
}
?>
