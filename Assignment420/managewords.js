/*
Jingbo Wang
 */

"use strict";
let xhr = null; // a global variable to prevent race
const white_space = /\s/g;
const printable_chars = /^[A-Za-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
const newline = ["\r\n", "\r", "\n"];
const upper_chars = /^[A-Z]+$/;
const lower_chars = /^[a-z]+$/;
const $ = (id) => document.getElementById(id);
const words_list = document.getElementsByClassName("wordslist");
const getByName = (name) => document.getElementsByName(name);

/**
 * click different chosen checkbox to show different perform
 */
window.onload = function ()
{
  $("add-cb").onclick = click_add;
  $("del-cb").onclick = click_del;
  $("choose-action").onchange = cb_test;
};

/**
 * when all cb checked are false, they are invisible
 */
function cb_test()
{
  if (!$("add-cb").checked  &&  !$("del-cb").checked)
  {
    $("add-wrapper").classList.remove("visible");
    $("add-wrapper").classList.remove("hidden");
    $("add-wrapper").classList.add("invisible");

    $("del-wrapper").classList.remove("visible");
    $("del-wrapper").classList.remove("hidden");
    $("del-wrapper").classList.add("invisible");

    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.add("hidden");

    $("statement").classList.remove("valid");
    $("statement").classList.remove("warning");
    $("statement").classList.add("normal");
    $("statement").innerHTML = "Select one to begin!";
  }
}

/**
 * To add, test a legal words, part of speach and definition
 */
function click_add()
{
  // clean
  $("word").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("del_word").value = "";
  $("disp-wrapper").innerHTML = "";

  $("del-cb").checked = false;

  // add a new word
  $("add-xhr").disabled = true;

  $("add-wrapper").classList.remove("invisible");
  $("add-wrapper").classList.remove("hidden");
  $("add-wrapper").classList.add("visible");

  $("del-wrapper").classList.remove("visible");
  $("del-wrapper").classList.remove("hidden");
  $("del-wrapper").classList.add("invisible");

  $("disp-wrapper").classList.remove("invisible");
  $("disp-wrapper").classList.remove("visible");
  $("disp-wrapper").classList.add("hidden");

  $("statement").classList.remove("valid");
  $("statement").classList.remove("warning");
  $("statement").classList.add("normal");
  $("statement").innerHTML = "Add a new word you want!";

  $("add-wrapper").onchange = show_add_button;
  $("word").onkeyup = word_test;
  $("partofspeech").onchange = part_of_speech_test;
  $("definition").onchange = definition_test;
  $("add-xhr").onclick =  save_word;
}

/**
 * To test word is valid or not
 */
function word_test()
{
  const re = /[A-Za-z]/;
  let result = "";
  $("word").value.split("").forEach(function(char)
  {
    if (re.test(char))
    {
      result += char.toLowerCase();
    }
  });
  $("word").value = result;
  disp();
}

/**
 * To display words in the dictionary already havd in DB
 */
function disp()
{
  if (xhr)
  {
    xhr.abort();
    xhr = null;
  }
  const wordsearch = $("word").value;
  if (wordsearch.length === 0)
  {
    $("disp-wrapper").innerHTML = "";
    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.add("hidden");
  }
  else
  {
    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.remove("hidden");
    $("disp-wrapper").classList.add("visible");

    xhr = new XMLHttpRequest();
    const url = `get_words.php?search=${wordsearch}`;

    xhr.open("GET", url, true);
    xhr.onload = function ()
    {
      const results = JSON.parse(xhr.responseText);
      let word_list_HTML = "";
      results.forEach(function (wordpart)
      {
        word_list_HTML +=
`<div>
    <dl class="word-list">
      <dt>
        ${wordpart[1]} :
        <span class="partofspeech">
          ${wordpart[2]}
        </span>
      </dt>
      <dd class="definition">
        ${wordpart[3]}
      </dd>
   </dl>
  </div>
  <div class="wordpart" hidden>${wordpart[1]}${wordpart[2]}</div>
`;
      });
      $("disp-wrapper").innerHTML = word_list_HTML;
    };
    xhr.send();
  }
}

/**
 * To test whether they have duplicate word and part of speech or not
 */
function part_of_speech_test()
{
  if ($("word").value === "")
  {
    $("statement").classList.remove("valid");
    $("statement").classList.remove("normal");
    $("statement").classList.add("warning");
    $("statement").innerHTML = "Add word first! Try again!";
    $("word").value = "";
    $("partofspeech").value = "";
  }
  else
  {
    $("statement").classList.remove("warning");
    $("statement").classList.remove("normal");
    $("statement").classList.add("valid");
    $("statement").innerHTML = "Not duplicate!";

    // check duplicate
    let duplicate = false;
    let new_wordpart = $("word").value + $("partofspeech").value;
    const wordpartdivs =
      Array.from(document.getElementsByClassName("wordpart"));
    wordpartdivs.forEach(function (element)
    {
      const thiswordpart = element.textContent;
      if (thiswordpart === new_wordpart)
      {
        duplicate = true;
      }
    });
    if (duplicate)
    {
      $("statement").classList.remove("valid");
      $("statement").classList.remove("normal");
      $("statement").classList.add("warning");
      $("statement").innerHTML = "Already have this word! Try again!";
      $("partofspeech").value = "";
    }
  }
}

/**
 * To test definition is valid or not
 */
function definition_test()
{
  let result = "";
  $("definition").value.split("").forEach(function(char)
  {
    if (white_space.test(char))
    {
      char = " ";
    }
    if (printable_chars.test(char))
    {
      result += char;
    }
  });
  $("definition").value = result.trim();
}

/**
 * To show add-button when all checkboxs are valid and not null
 */
function show_add_button()
{
  if ($("word").value === ""
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
 *  To save word by xhr
*/
function save_word()
{
  if (xhr)
  {
    xhr.abort();
    xhr = null;
  }
  xhr = new XMLHttpRequest();
  const url = "add_word.php";

  const added_word = [$("word").value, $("partofspeech").value,
                                            $("definition").value];
  const payload = encodeURIComponent(JSON.stringify(added_word));
  const json_string = `payload=${payload}`;
  xhr.open("POST", url);
  xhr.setRequestHeader
    ("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  xhr.onload = function ()
  {
    let duplicate = JSON.parse(xhr.responseText);
    if (!duplicate)
    {
      $("statement").classList.remove("warning");
      $("statement").classList.remove("normal");
      $("statement").classList.add("valid");
      $("statement").innerHTML = "Successfully added!";
      $("word").value = "";
      $("partofspeech").value = "";
      $("definition").value = "";
      $("disp-wrapper").classList.remove("invisible");
      $("disp-wrapper").classList.remove("visible");
      $("disp-wrapper").classList.add("hidden");
      $("add-wrapper").classList.remove("visible");
      $("add-wrapper").classList.remove("hidden");
      $("add-wrapper").classList.add("invisible");
      $("add-cb").checked = false;
    }
    else
    {
      $("statement").classList.remove("valid");
      $("statement").classList.remove("normal");
      $("statement").classList.add("warning");
      $("statement").innerHTML = "Duplicate! Try again!";
      $("word").value = "";
      $("partofspeech").value = "";
      $("definition").value = "";
      $("disp-wrapper").classList.remove("invisible");
      $("disp-wrapper").classList.remove("visible");
      $("disp-wrapper").classList.add("hidden");
    }
  };
   xhr.send(json_string);
 }

/**
 * To delete words, part of speach and definition
 */
function click_del()
{
  $("add-cb").checked = false;
  // clean
  $("word").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("del_word").value = "";
  $("disp-wrapper").value = "";

  $("del-xhr").disabled = true;
  $("add-wrapper").classList.remove("visible");
  $("add-wrapper").classList.add("invisible");
  $("disp-wrapper").classList.remove("invisible");
  $("disp-wrapper").classList.remove("visible");
  $("disp-wrapper").classList.add("hidden");
  $("del-wrapper").classList.remove("invisible");
  $("del-wrapper").classList.add("visible");

  $("statement").classList.remove("valid");
  $("statement").classList.remove("warning");
  $("statement").classList.add("normal");
  $("statement").innerHTML = "Search words to delete!";
  $("del_word").onkeyup = del_word_disp;
  $("disp-wrapper").onchange = show_del_button;
  $("del-xhr").onclick = delete_word;
}

/**
 * To show the del button
 */
function show_del_button()
{
  let done = false;
  let index = 0;
  while (index < words_list.length && !done)
  {
    if (words_list[index].checked)
    {
      done = true;
    }
    index += 1;
  }
  $("del-xhr").disabled = !done? true : false;
}

/**
 *  To delete the words
 */
function delete_word()
{
  if (xhr)
  {
    xhr.abort();
    xhr = null;
  }

  let word_id_list = getByName("delete");
  let delete_id_list = [];
  let index = 0;
  let empty = true;
  while (index < word_id_list.length)
  {
    if (words_list[index].checked)
    {
      delete_id_list.push(word_id_list[index].value);
      empty = false;
    }
    index += 1;
  }
  if (!empty)
  {
    xhr = new XMLHttpRequest();
    const url = "delete_words.php";

    const payload = JSON.stringify(delete_id_list);
    const json_string = `payload=${payload}`;
    xhr.open("POST", url);
    xhr.setRequestHeader
      ("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    xhr.send(json_string);

    $("statement").classList.remove("warning");
    $("statement").classList.remove("normal");
    $("statement").classList.add("valid");
    $("statement").innerHTML = "Successfully deleted!";

    $("del_word").value = "";

    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.add("hidden");

    $("del-wrapper").classList.remove("visible");
    $("del-wrapper").classList.remove("hidden");
    $("del-wrapper").classList.add("invisible");
    $("del-cb").checked = false;
  }
  else
  {
    $("statement").classList.remove("valid");
    $("statement").classList.remove("normal");
    $("statement").classList.add("warning");
    $("statement").innerHTML = "Can't delete empty! Must have selections!";

    $("del_word").value = "";

    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.remove("hidden");
    $("disp-wrapper").classList.add("invisible");
   }
}

/**
 * show the searched word will be deleted
 */
function del_word_disp()
{
  const re = /[A-Za-z]/;
  let result = "";
  $("del_word").value.split("").forEach(function(char)
  {
    if (re.test(char))
    {
      result += char.toLowerCase();
    }
  });
  $("del_word").value = result;

  if (xhr)
  {
    xhr.abort();
    xhr = null;
  }
  const wordsearch = $("del_word").value;
  if (wordsearch.length === 0)
  {
    $("disp-wrapper").innerHTML = "";
    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.remove("visible");
    $("disp-wrapper").classList.add("hidden");
  }
  else
  {
    $("disp-wrapper").classList.remove("invisible");
    $("disp-wrapper").classList.remove("hidden");
    $("disp-wrapper").classList.add("visible");

    xhr = new XMLHttpRequest();
    const url = `get_words.php?search=${wordsearch}`;

    xhr.open("GET", url, true);
    xhr.onload = function ()
    {
      const results = JSON.parse(xhr.responseText);
      let word_list_HTML = "";
      results.forEach(function (wordpart)
      {
        word_list_HTML +=
`
<div>
  <dl class="word-list">
    <dt>
      <input type="checkbox" name="delete" class="wordslist"
                  id="${wordpart[0]}" value="${wordpart[0]}" />
      <label id="id_${wordpart[0]}" for="${wordpart[0]}">
        ${wordpart[1]} :
        <span class="partofspeech">${wordpart[2]}</span>
      </label>
    </dt>
    <dd class="definition">
      ${wordpart[3]}
    </dd>
  </dl>
</div>
`;
      });
      $("disp-wrapper").innerHTML = word_list_HTML;
    };
    xhr.send();
  }
}
