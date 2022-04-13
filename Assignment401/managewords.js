/*
Jingbo Wang
 */

"use strict";

const white_space = /\s/g;
const printable_chars = /^[A-Za-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
const newline = ["\r\n", "\r", "\n"];
const lower_chars = /^[a-z]+$/;
const $ = (id) => document.getElementById(id);

/**
 * click different chosen checkbox to show different perform
 */
window.onload = function ()
{
  $("add-cb").onclick = click_add;
  $("disp-cb").onclick = click_disp;
  $("partofspeech").onchange = add_test;
  $("choose-action").onchange = cb_test;
};

/**
 * when all cb checked are false, they are invisible
 */
function cb_test()
{
  if ($("add-cb").checked === false && $("disp-cb").checked === false)
  {
    $("add-wrapper").classList.remove("visible");
    $("add-wrapper").classList.add("invisible");
    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.add("invisible");

    $("disp-wrapper").classList.add("hidden");

    $("statement").style.color = "darkblue";
    $("statement").innerHTML = "Select one to begin!";
  }
}


/**
 * To add, test a legal words, part of speach and definition
 */
function click_add()
{
  $("disp-cb").checked = false;
  $("disp-wrapper").classList.add("hidden");
  // clean
  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";

  // add a new word
  $("add-xhr").disabled = true;

  $("add-wrapper").classList.remove("invisible");
  $("add-wrapper").classList.add("visible");
  $("disp-wrapper").classList.remove("visible");
  $("disp-wrapper").classList.add("invisible");

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Add a new word you want!";
  $("words").addEventListener("change", show_add_button);
  $("partofspeech").addEventListener("change", show_add_button);
  $("definition").addEventListener("change", show_add_button);


  $("words").addEventListener("change", word_test);
  $("partofspeech").addEventListener("change", part_of_speech_test);
  $("definition").addEventListener("change", definition_test);
  $("add-xhr").onclick =  save_word;
}

/**
 *  To save word by xhr
*/
function save_word()
{
  const xhr = new XMLHttpRequest();
  const url = "put_word.php";
  let definition = $("definition").value;
  let index = 0;
  while (index < definition.length)
  {
    if (definition[index] === "&")
    {
      definition = definition.replace("&", "∆");
      index +=  1;
    }
    else if (definition[index] === "+")
    {
      definition = definition.replace("+", "ß");
      index +=  1;
    }
    else
    {
      index +=  1;
    }
  }
  const added_word =[$("words").value, $("partofspeech").value
                                              , definition];
  const json_string = `payload=${JSON.stringify(added_word)}`;
  xhr.open("POST", url);
  xhr.setRequestHeader
    ("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  xhr.send(json_string);
  $("statement").style.color = "green";
  $("statement").innerHTML = "Successfully added!";
 }

/**
 * test the new word is valid or not
 */
function add_test()
{
  $("partofspeech").addEventListener("change", part_of_speech_test);
}

/**
 * To test word is valid or not
 */
function word_test()
{
    if (!lower_chars.test($("words").value))
    {
      $("statement").style.color = "red";
      $("statement").innerHTML = "Word has some ILLEGAL symbols!"
            + " Or upper case character! Try again!";
      $("words").value = "";
    }
    else
    {
      $("statement").style.color = "green";
      $("statement").innerHTML = "Correct style!";
    }
}

/**
 * To test whether they have duplicate word and part of speech or not
 */
function part_of_speech_test()
{
  if ($("words").value === "")
  {
    $("statement").style.color = "red";
    $("statement").innerHTML = "Add word first! Try again!";
    $("words").value = "";
    $("partofspeech").value = "";
  }
  else
  {
    $("statement").style.color = "green";
    $("statement").innerHTML = "Correct!";

    let index = 0;
    let done = false;
    let new_word = $("words").value;
    new_word = new_word.toLowerCase();

    const xhr = new XMLHttpRequest();
    const url = `get_words.php?`;
    xhr.open("GET", url, true);
    xhr.onload = function ()
    {
      const results = JSON.parse(xhr.responseText);
      while (index < results.length && !done)
      {
        if (new_word === results[index][0]
            && $("partofspeech").value === results[index][1])
        {
          $("statement").style.color = "red";
          $("statement").innerHTML = "Already have this word! Try again!";
          $("words").value = "";
          $("partofspeech").value = "";
          done = true;
        }
        else
        {
          $("statement").style.color = "green";
          $("statement").innerHTML = "Not duplicate!";
        }
        index +=  1;
      }
    };
    xhr.send();
  }
}

/**
 * To test definition is valid or not
 */
function definition_test()
{
  let string = $("definition").value;
  let string_index = 0;
  while (string_index < string.length)
  {
    if (string[string_index] === "&")
    {
      string = string.replace(newline, " ");
      string_index += 1;
    }
    else
    {
      string_index += 1;
    }
  }

  let done = false;
  let  index = 0;
  if (string !== "")
  {
    while (index < string.length && !done)
    {
      if ( white_space.test(string[0]))
      {
        done = true;
      }
      if (white_space.test(string[index]))
      {
        index += 1;
      }
      else
      {
        if (!printable_chars.test(string[index]))
        {
          done = true;
        }
        index += 1;
      }
    }
  }
  else
  {
    done = true;
  }
  if (done)
  {
    $("statement").style.color = "red";
    $("statement").innerHTML = "Definition has invalid characters! " +
            "Try again!";
    $("definition").value = "";
  }
  else
  {
    $("statement").style.color = "green";
    $("statement").innerHTML = "Correct style!";
  }
}

/**
 * To show add-button when all checkboxs are valid and not null
 */
function show_add_button()
{
  if ($("words").value === ""
        || $("partofspeech").value === ""
        || $("definition").value === "")
  {
    $("add-xhr").disabled = true;
  }
  else
  {
    $("add-xhr").disabled = false;
  }
}

/**
 * To display words in the dictionary
 */
function click_disp()
{
  $("add-cb").checked = false;
    $("disp-wrapper").classList.remove("hidden");
    $("disp-wrapper").classList.add("visible");
  // clean
  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";

  // add a new word
  $("add-xhr").disabled = true;

  $("add-wrapper").classList.remove("visible");
  $("add-wrapper").classList.add("invisible");
  $("disp-wrapper").classList.remove("invisible");
  $("disp-wrapper").classList.add("visible");


  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "All words in the file!";

  const xhr = new XMLHttpRequest();
  const url = `get_words.php?`;
  xhr.open("GET", url, true);
  xhr.onload = function ()
  {
    const results = JSON.parse(xhr.responseText);
    let word_list_HTML = "";
    results.forEach (function (wordpart)
    {
      word_list_HTML +=
`  <dl class="word-list">
      <dt>
        ${wordpart[0]} :
        <span class="partofspeech">
          ${wordpart[1]}
        </span>
      </dt>
      <dd class="definition">
        ${wordpart[2]}
      </dd>
    </dl>
`;
    });
    $("disp-wrapper").innerHTML = word_list_HTML;
  };
  xhr.send();
}
