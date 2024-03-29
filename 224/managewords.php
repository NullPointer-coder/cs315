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
define('PARTS_OF_SPEECH', 'parts.txt');

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

  $line_count = 0;
  $line = array($result[$line_count][0]);
  $oneword = $line[0];
  if (strcmp($oneword, "") != 0)
  {
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition" . PHP_EOL;
    file_put_contents(DEFINITION_FILENAME, $words);
  }
  else
  {
    $line_count++;
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition" . PHP_EOL;
    file_put_contents(DEFINITION_FILENAME, $words);
  }

  $line_count++;
  while ($line_count < count($lines))
  {
    $line = array($result[$line_count][0]);
    $oneword = $line[0];
    list($word, $partofspeech, $definition) = explode("\t", $oneword);

    $words = "$word\t$partofspeech\t$definition" . PHP_EOL;
    file_put_contents(DEFINITION_FILENAME, $words,
      LOCK_EX | FILE_APPEND);
    $line_count++;
  }
}

/**
 * to delete the input word
 * @param $array the each line in the words.txt
 * @param $delete_count the number of lines deleted
 */
function delete_word($array, $delete_count)
{
  $index = 0;
  $done = false;
  $left_sum = count($array) + $delete_count;
  while ($index < $left_sum && !$done)
  {
    if (!array_key_exists($index, $array))
    {
      $index++;
    }
    else
    {
      list($word, $partofspeech, $definition) = explode("\t", $array[$index]);
      $words = "$word\t$partofspeech\t$definition" . PHP_EOL;
      file_put_contents(DEFINITION_FILENAME, $words);
      $done = true;
      $index++;
    }
  }
  while ($index < $left_sum)
  {
    if (!array_key_exists($index, $array))
    {
      $index++;
    }
    else
    {
      list($word, $partofspeech, $definition)
          = explode("\t", $array[$index]);

      $words = "$word\t$partofspeech\t$definition" . PHP_EOL;
      file_put_contents(DEFINITION_FILENAME, $words,
                        LOCK_EX | FILE_APPEND);
      $index++;
    }
  }
}

/**
 * could search the part of speech in the input file
 * @param $file_name  name of the input file
 * @param $part the part of speech of input word
 * in the words dictionary.
 * @return true if the part of speech is found; false otherwise
 */
function search_part($file_name, $searched_part)
{
  $lines = file($file_name, FILE_IGNORE_NEW_LINES);
  $index = 0;
  
  while ($index < count($lines))
  {
    if (strcmp($lines[$index], $searched_part) == 0)
    {
      return true;
    }
    $index++;
  }
  return false;
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
    return $done = true;
  }
  return $done;
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Words Manager</title>
    <meta name="author" content="Jingbo Wang" />
    <meta charset="utf-8" />
    <link rel="stylesheet" href="managewords.css">
  </head>
  <body>
    <h1>Manage Words</h1>
    <?php
      $addstatement = "Add a new word you want!";
      if (isset($_POST) &&
          isset($_POST['words']) &&
          preg_match('|^[A-Za-z]+$|', $_POST['words']) &&
          isset($_POST['definition']))
      {
        $word = strtolower($_POST['words']);
        $part_of_speech = $_POST['partofspeech'];
        $definition = $_POST['definition'];
        $definition = str_replace("\n", '', $definition);
        if (!search_word(DEFINITION_FILENAME, $word, $part_of_speech)
            && !empty($part_of_speech) 
            && !is_not_printable($definition))
        {
          $definition = htmlspecialchars($definition);
          $definition = strtolower($definition);
          $definition = ltrim($definition);
          $definition = trim($definition);
          $words = "$word\t$part_of_speech\t$definition" . PHP_EOL;

          $addstatement = "Successfully added!";
          file_put_contents(DEFINITION_FILENAME, $words,
                       LOCK_EX | FILE_APPEND);
          store_words(DEFINITION_FILENAME);
        }
        else
        {
          if (empty($part_of_speech))
          {
            $addstatement = "Fail to add the new word!\n 
                            No part of speech!";
          }
          elseif (search_word(DEFINITION_FILENAME, $word, $part_of_speech))
          {
            $addstatement = "Fail to add the new word!\n 
                             Having a same word with part of speech!";
          }
          elseif (is_not_printable($definition))
          {
            $addstatement = "Fail to add the new word!\n 
                             Difination is not printable!";
          }
        }
      }
      
      $lines = file(DEFINITION_FILENAME, FILE_IGNORE_NEW_LINES);
   
      $deletestatement = "delete a word you want!";
      if (isset($_POST) && isset($_POST['delete']))
      {
        
        $delete_word_lines = $_POST['delete'];
       
        $index = 0;
        while ($index < count($delete_word_lines))
        {
          $position = $delete_word_lines[$index];
          unset($lines[$position]);
          $index++;
        }
        delete_word($lines, count($delete_word_lines));
        $deletestatement = "Successfully delete!";
      }
      
      $addpartofspeech = "* Add a part of speech that 
                           does not exist in the list and submit";
      
      if (isset($_POST) &&  isset($_POST['newspeech']) &&
           preg_match('|^[A-Za-z]+$|', $_POST['newspeech']))
      {
        $new_part_of_speech = strtolower($_POST['newspeech']);
        if (!(search_part(PARTS_OF_SPEECH, $new_part_of_speech)))
        {
          file_put_contents(PARTS_OF_SPEECH, $new_part_of_speech . PHP_EOL,
                            LOCK_EX | FILE_APPEND);
          $addpartofspeech = "scuccessfully added in the list!";
        }
      }
    ?>
    <p>
      Part of speech list:
    </p>
    <p id="partsofspeech">
      <?php
        $index = 0;
        $lines = file(PARTS_OF_SPEECH, FILE_IGNORE_NEW_LINES);
        while ($index < count($lines)):
          $part_of_speech = $lines[$index];
      ?>
        
          <?php  if($index == count($lines) - 1):?>
            <?= $part_of_speech ?>.
          <?php else: ?>
            <?= $part_of_speech ?>,
          <?php endif; ?>
      <?php
        $index++;
      endwhile;
      ?>
    </p>
    <form method="post" action="managewords.php">
      <p>
        <label for="newspeech">
          Add new part of speech(Do not exist in list):
        </label>
        <input type="text" id="newspeech" name="newspeech"/>
      </p>
      <p>
        <input type="submit" value="Submit" name="submit" />
      </p>
      <h3 id="partstatement">
        <?= $addpartofspeech ?>
      </h3>
      <hr />
      <h2>Add New word</h2>
      <p>
        <label for="words">Word:</label>
        <input type="text" id="words" name="words" /> &ast;
      </p>
      <p>
        <label for="partofspeech">Parts of speech:</label>
        <select name="partofspeech" id="partofspeech">
          <option value="">--- Choose the part of speech ---</option>
          <?php
            $lines = file(PARTS_OF_SPEECH, FILE_IGNORE_NEW_LINES);
            $part_of_speech = null;
            $line_count = 0;
            while ($line_count < count($lines)):
              $part_of_speech = $lines[$line_count];
          ?>
            <option value="<?= $part_of_speech ?>">
              <?= $part_of_speech ?>
            </option>
          <?php
              $line_count++;
           endwhile;
          ?>
        </select> &ast;
      </p>
      <p>
        <label for="definition">Definition:</label>
        <textarea id="definition" name="definition"
                  placeholder="Add definition here"></textarea> &ast;
      </p>
      <p>
        <input type="submit" value="Submit Report" name="submit" />
      </p>
    </form>
    <h3 class="statement">
      <?= $addstatement ?>
    </h3>
    
    <hr />
    <h2>Delete word</h2>
    <h3 class="statement">
      <?= $deletestatement ?>
    </h3>
    <form action="managewords.php" method="post">
      <form id="container">
        <section id="dictionary">
          <dl>
            <?php
              $line_count = 0;
              $lines = file(DEFINITION_FILENAME, FILE_IGNORE_NEW_LINES);
              $wordlist = array();
              while ($line_count < count($lines)):
                $wordlist[] = explode("\t", rtrim($lines[$line_count]));
                $line_count++;
              endwhile;
              $index = 0;
              foreach ($wordlist as $row):
            ?>
            <dt>
              <input type="checkbox" name="delete[]" value="<?= $index ?>" />
              <?= $row[0] ?> :
              <span class="partofspeech"><?= $row[1] ?></span>
            </dt>
            <dd class="definition">
              <?= $row[2] ?>
            </dd>
            <?php
                $index++;
              endforeach;
            ?>
          </dl>
        </section>
        <section id="submitbutton">
          <p>
            <input type="submit" value="Delete Words" name="submit" />
          </p>
        </section>
      </div>
    </form>
  </body>
</html>
