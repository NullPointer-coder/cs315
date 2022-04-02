/*
 Jingbo Wang
*/

"use strict";

const white_space = /\s/g;
const words_list = document.getElementsByClassName("wordslist");
const printable_chars = /^[A-Za-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
const newline = ["\r\n", "\r", "\n"];
const $ = (id) => document.getElementById(id);

/**
 * always test words, part of speech, and definition
 */
window.onchange = function ()
{
  add_test();
  cb_test();
};

/**
 * when all cb checked are false, they are invisible
 */
function cb_test()
{
  if ($("add-cb").checked === false
      && $("add-pos-cb").checked === false  && $("del-cb").checked === false)
  {
    $("add-wrapper").classList.remove("visible");
    $("add-wrapper").classList.add("invisible");
    $("add-pos-wrapper").classList.remove("visible");
    $("add-pos-wrapper").classList.add("invisible");
    $("del-wrapper").classList.remove("visible");
    $("del-wrapper").classList.add("invisible");
    $("statement").style.color = "darkblue";
    $("statement").innerHTML = "Select one to add a word, add part " +
                               "of speech or delete words!";
  }

  if ($("learn-cb").checked === false
      && $("test-cb").checked === false  && $("manage-cb").checked === false)
  {
    $("choose-cb").classList.remove("visible");
    $("choose-cb").classList.add("invisible");
  }
}

/**
 * click different chosen checkbox to show different perform
 */
window.onload = function ()
{
  $("learn-cb").onclick= click_learn;
  $("test-cb").onclick = click_test;
  $("manage-cb").onclick = click_manage;

};

function click_learn()
{
  $("manage-cb").checked = false;
  $("test-cb").checked = false;
  $("choose-cb").classList.remove("visible");
  $("choose-cb").classList.add("invisible");
  $("test-wrapper").classList.remove("visible");
  $("test-wrapper").classList.add("invisible");
}

function click_test()
{
  $("learn-cb").checked = false;
  $("manage-cb").checked = false;
  $("choose-cb").classList.remove("visible");
  $("choose-cb").classList.add("invisible");
  $("test-wrapper").classList.remove("invisible");
  $("test-wrapper").classList.add("visible");
}

function click_manage()
{
  $("learn-cb").checked = false;
  $("test-cb").checked = false;
  $("choose-cb").classList.remove("invisible");
  $("choose-cb").classList.add("visible");
  $("test-wrapper").classList.remove("visible");
  $("test-wrapper").classList.add("invisible");

  $("add-cb").onclick = click_add;
  $("add-pos-cb").onclick = click_add_pos;
  $("del-cb").onclick = click_del;
}

/**
 * To add, test a legal words, part of speech and definition
 */
function click_add()
{
  $("del-cb").checked = false;
  $("add-pos-cb").checked = false;
  $("add-wrapper").classList.remove("invisible");
  $("add-wrapper").classList.add("visible");
  $("add-pos-wrapper").classList.remove("visible");
  $("add-pos-wrapper").classList.add("invisible");
  $("del-wrapper").classList.remove("visible");
  $("del-wrapper").classList.add("invisible");

  // clean
  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("newspeech").value = "";
  $("submit-success-statement").innerHTML = "";
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index += 1;
  }

  // disable the submit button
  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;

  // add a new word
  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Add a new word you want!";
  $("words").addEventListener("change", show_add_button);
  $("partofspeech").addEventListener("change", show_add_button);
  $("definition").addEventListener("change", show_add_button);

  $("definition").addEventListener("change", definition_test);
  $("words").addEventListener("change", word_test);
}

/**
 * test the new word is valid or not
 */
function add_test()
{

  $("partofspeech").addEventListener("change", part_of_speech_test);

}

/**
 * To add, test a new legal part of speech
 */
function click_add_pos()
{
  $("del-cb").checked = false;
  $("add-cb").checked = false;
  $("add-pos-wrapper").classList.remove("invisible");
  $("add-pos-wrapper").classList.add("visible");
  $("add-wrapper").classList.remove("visible");
  $("add-wrapper").classList.add("invisible");
  $("del-wrapper").classList.remove("visible");
  $("del-wrapper").classList.add("invisible");

  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("submit-success-statement").innerHTML = "";
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index += 1;
  }

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Add a new part of speech if it " +
                                 "does not exist in the list and submit!";
  $("newspeech").addEventListener("change", show_add_pos_button);

  $("newspeech").addEventListener("change", new_pos_test);
}

/**
 * To delete words in the dictionary
 */
function click_del()
{
  $("add-cb").checked = false;
  $("add-pos-cb").checked = false;
  $("del-wrapper").classList.remove("invisible");
  $("del-wrapper").classList.add("visible");
  $("add-pos-wrapper").classList.remove("visible");
  $("add-pos-wrapper").classList.add("invisible");
  $("add-wrapper").classList.remove("visible");
  $("add-wrapper").classList.add("invisible");

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;

  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("newspeech").value = "";
  $("submit-success-statement").innerHTML = "";

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Delete a word you want!";
  $("word-list").addEventListener("change", show_del_button);
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
    $("add-submit").disabled = true;
  }
  else
  {
    $("add-submit").disabled = false;
  }
}

/**
 * To show add-pos-button when all elements are valid and not null
 */
function show_add_pos_button()
{
  if ($("newspeech").value === "")
  {
    $("add-pos-submit").disabled = true;
  }
  else
  {
    $("add-pos-submit").disabled = false;
  }
}

/**
 * To show del-button when checkbox is not null
 */
function show_del_button()
{
  let done = false;
  let index = 0;
  while(index < words_list.length && !done)
  {
    if(words_list[index].checked === true)
    {
      done = true;
    }
    index += 1;
  }

  if(!done)
  {
    $("del-submit").disabled = true;
  }
  else
  {
    $("del-submit").disabled = false;
  }
}

/**
 * To test word is valid or not
 */
function word_test()
{
  let lower_chars = /^[a-z]+$/;
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
    while (index < words_list.length && !done)
    {
      let word = $("id-"+index.toString()).innerText;
      let row = word.split(":");
      row[0] = row[0].replace(white_space,"");
      row[1] = row[1].replace(white_space,"");
      if (new_word === row[0] && $("partofspeech").value === row[1])
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
      index += 1;
    }
  }
}

/**
 * To test definition is valid or not
 */
function definition_test()
{
  let string = $("definition").value;
  string = string.replace(newline," ");
  let done = false;
  let  index = 0;
  if (string !== "")
  {
    while (index < string.length && !done)
    {
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
 * To test the new part of speech is valid or not
 */
function new_pos_test()
{
  let lower_chars = /^[a-z]+$/;
  if (!lower_chars.test($("newspeech").value))
  {
    $("statement").style.color = "red";
    $("statement").innerHTML = "New part of speech has some ILLEGAL symbols!"
                               +" Or upper case character! Try again!";
    $("newspeech").value = "";
  }
  else
  {
    $("statement").style.color = "green";
    $("statement").innerHTML = "Correct style!";

    let part_of_speech_list = $("partofspeech-list").innerText;
    let part = part_of_speech_list.split(",");
    let index = 0;
    let done = false;
    let new_pos = $("newspeech").value;
    new_pos = new_pos.toLowerCase();
    while (index < part.length && !done)
    {
      part[index] = part[index].replace(white_space,"");
      if (new_pos === part[index])
      {
        $("statement").style.color = "red";
        $("statement").innerHTML = "Already has this part of speech! "
                                      + "Try again!";
        $("newspeech").value = "";
        done = true;
      }
      else
      {
        $("statement").style.color = "green";
        $("statement").innerHTML = "Not duplicate!";
      }
      index += 1;
    }
  }
}
