<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

/**
 * This program allows the user to add a new entry in the words file
 * and to delete an existing entry.
 * @author Jingbo Wang
 * @version 13 February 2022
 */
define('DEFINITION_FILENAME', 'words.txt');

/**
 * could sort words in alphabetical order in the input file
 * and store into the file
 * randomly choose one word, its part of speech, and its definition
 *
 * randomly choose (up to) n other definitions that match that part of
 * speech
 * @param $file_name name of the input file
 */
function store_words($file_name)
{
  $result = array();
  $index = 0;
  $lines = file($file_name, FILE_IGNORE_NEW_LINES);
  while ($index < count($lines))
  {
    array_push($result, array($lines[$index]));
    $index++;
  }
  
  sort($result);
  
  $index_2 = 0;
  $line = array($result[$index_2][0]);
  $oneword = $line[0];
  if (strcmp($oneword,"") != 0)
  {
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition\n";
    file_put_contents(DEFINITION_FILENAME, $words);
  }
  else
  {
    $index_2++;
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition\n";
    file_put_contents(DEFINITION_FILENAME, $words);
  }

  
  $index_2++;
  while ($index_2 < count($lines))
  {
    $line = array($result[$index_2][0]);
    $oneword = $line[0];
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition\n";
    file_put_contents(DEFINITION_FILENAME, $words,
      LOCK_EX | FILE_APPEND);
    $index_2++;
  }
}

/**
 * to delete the input word
 * @param $file_name name of the input file
 * @param $delete_words the word need to be deleted
 * @param $delete_part_of_speech the part of speech of deleted word
 */
function delete_word($file_name,$delete_words, $delete_part_of_speech)
{
  $position = get_position($file_name, $delete_words,
                           $delete_part_of_speech);
  $lines = file($file_name, FILE_IGNORE_NEW_LINES);
  unset($lines[$position]);
  
  $index = 0;
  if($position == $index)
  {
    $index++;
    list($word, $partofspeech, $definition) = explode("\t", $lines[$index]);
    $words = "$word\t$partofspeech\t$definition\n";

    file_put_contents(DEFINITION_FILENAME, $words);
  }
  else
  {
    list($word, $partofspeech, $definition) = explode("\t", $lines[$index]);
    $words = "$word\t$partofspeech\t$definition\n";

    file_put_contents(DEFINITION_FILENAME, $words);
  }
  
  $index++;
  while ($index < count($lines) + 1)
  {
    if($index != $position)
    {
      list($word, $partofspeech, $definition)
          = explode("\t", $lines[$index]);

      $words = "$word\t$partofspeech\t$definition\n";
      file_put_contents(DEFINITION_FILENAME, $words,
        LOCK_EX | FILE_APPEND);
      $index++;
    }
    else
    {
      $index++;
    }
  }
}

/**
 * could search the key word's position in the input file
 * @param $file_name name of the input file
 * @param $searched_word the part of speech of input word
 * @param $part the part of speech of input word
 * @return the key word's position
 */
function get_position($file_name, $searched_word, $part)
{
  $lines = file($file_name, FILE_IGNORE_NEW_LINES);
  $index = 0;

  while ($index < count($lines))
  {
    list($word, $partofspeech, $definition) = explode("\t", $lines[$index]);
    $result = array();
    array_push($result, array($word, $partofspeech, $definition));
    
    if (strcmp($result[0][0], $searched_word) == 0
          && strcmp($result[0][1], $part) == 0)
    {
      return $index;
    }
    
    $index++;
  }
  return -1;
}

/**
 * could search the key word in the input file
 * @param $file_name  name of the input file
 * @param $searched_word the input word need to be search
 * @param $part the part of speech of input word
 * in the words dictionary.
 * @return true if the word is found; false otherwise
 */
function search_word($file_name, $searched_word, $part)
{
  $lines = file($file_name, FILE_IGNORE_NEW_LINES);
  $index = 0;
  
  while ($index < count($lines))
  {
    list($word, $partofspeech, $definition) = explode("\t", $lines[$index]);

    $result = array();
    array_push($result, array($word, $partofspeech, $definition));
    
    if (strcmp($result[0][0], $searched_word) == 0
                && strcmp($result[0][1], $part) == 0)
    {
      return true;
    }
    $index++;
  }
  return false;
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Words Manager</title>
    <meta name="author" content="Jingbo Wang" />
    <meta charset="utf-8" />
    <link rel="stylesheet" href="214.css">
  </head>
  <body>
    <h1>Manage Words</h1>
    <h2>Add New word</h2>
    <?php
      $addstatement = "";
      if (isset($_POST) &&
          isset($_POST['words']) &&
          preg_match('|^[A-Za-z]+$|', $_POST['words']) &&
          isset($_POST['definition']) &&
          preg_match('|^[A-Za-z;( -]+|', $_POST['definition']))
      {
        $word = strtolower($_POST['words']);
        $part_of_speech = $_POST['partofspeech'];
        $definition = strtolower($_POST['definition']);
        $words = "$word\t$part_of_speech\t$definition\n";
        if (!search_word(DEFINITION_FILENAME, $word, $part_of_speech))
        {
          $addstatement = "Successfully add the new word!";
          file_put_contents(DEFINITION_FILENAME, $words,
                       LOCK_EX | FILE_APPEND);
          store_words(DEFINITION_FILENAME);
        }
        else
        {
          $addstatement = "Fail to add the new word!
                          This word already added!";
        }
      }
      
      $deletestatement = "";
      if (isset($_POST) &&
          isset($_POST['deleteword']) &&
          preg_match('|^[a-z]+$|', $_POST['deleteword']))
      {
        $delete_words = strtolower($_POST['deleteword']);
        $delete_part_of_speech = $_POST['deletepartofspeech'];
        if (search_word(DEFINITION_FILENAME, $delete_words,
                       $delete_part_of_speech))
        {
          delete_word(DEFINITION_FILENAME, $delete_words,
                      $delete_part_of_speech);
          $deletestatement = "Successfully delete!";
        }
        else
        {
          $deletestatement = "Do not Find it! Try again...";
        }
      }
    ?>
    <form method="post" action="managewords.php">
      <p>
        <label for="words">Word:</label>
        <input type="text" id="words" name="words"/>
      </p>
      <p>
        <label for="partofspeech">Parts of speech:</label>
        <select name="partofspeech" id="partofspeech">
          <option value="">--- Choose the part of speech ---</option>
          <option value="adjective">adjective</option>
          <option value="adverb">adverb</option>
          <option value="noun">noun</option>
          <option value="verb">verb</option>
        </select>
      </p>
      <p>
        <label for="definition">Definition:</label>
        <textarea id="definition" name="definition"
                  placeholder="Add definition here"></textarea>
      </p>
      <p>
        <input type="submit" value="Submit Report" name="submit" />
      </p>
    </form>
    <h3 class="statement">
      <?= $addstatement?>
    </h3>
    
    <hr />
    <h2>Delete word</h2>
    <form method="post" action="managewords.php">
      <p>
        <label for="deleteword">Which word need to delete:</label>
        <input type="text" id="deleteword" name="deleteword"/>
      </p>
      <p>
        <label for="deletepartofspeech">Parts of speech:</label>
        <select name="deletepartofspeech" id="deletepartofspeech">
          <option value="">--- Choose the part of speech ---</option>
          <option value="adjective">adjective</option>
          <option value="adverb">adverb</option>
          <option value="noun">noun</option>
          <option value="verb">verb</option>
        </select>
      </p>
      <p>
        <input type="submit" value="Submit Report" name="submit" />
      </p>
    </form>
    <h3 class="statement">
      <?= $deletestatement ?>
    </h3>
  </body>
</html>
