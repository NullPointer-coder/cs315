// Jingbo Wang

"use strict";

const $ = (id) => document.getElementById(id);
const printable_chars = /^[A-Za-z0-9!"#$%&'()*+,.\/:;<=>?@\[\]^_`{|}~-]*$/;
const white_space = /\s/g;
const WORD_PATTERN = /^[A-Za-z]+$/;
const  fail = /^F/;
const  success = /^S/;
const  words_list = document.getElementsByClassName("wordslist");

window.onload = function ()
{
  $("add-cb").onclick = click_add;
  $("add-pos-cb").onclick = click_add_pos;
  $("del-cb").onclick = click_del;
}

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
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index++;
  }

  // add a new word
  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Add a new word you want!";
  $("words").addEventListener("change", show_add_button);
  $("partofspeech").addEventListener("change", show_add_button);
  $("definition").addEventListener("change", show_add_button);


  $("words").addEventListener("change", word_test);
  $("partofspeech").addEventListener("change", part_of_speech_test);
  $("definition").addEventListener("change", definition_test);
  $("add-submit").addEventListener("click", show_result);
}

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
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index++;
  }

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Add a new part of speech if it " +
                                 "does not exist in the list and submit!";

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;
  $("newspeech").addEventListener("change", show_add_pos_button);
  $("newspeech").addEventListener("change", new_pos_test);

  $("add-pos-submit").addEventListener("click", show_result);
}

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
  $("sub-statement").classList.remove("visible");
  $("sub-statement").classList.add("invisible");

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("del-submit").disabled = true;

  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("newspeech").value = "";

  $("statement").style.color = "darkblue";
  $("statement").innerHTML = "Delete a word you want!";
  $("word-list").addEventListener("change", show_del_button);
  $("del-submit").addEventListener("click", show_result);
}

function show_result()
{
  console.log($("sub-statement").firstChild);
  if(fail.test($("sub-statement").textContent))
  {
    $("sub-statement").style.color = "red";
  }
  else if(success.test($("sub-statement").textContent))
  {
    $("sub-statement").style.color = "green";
  }
}

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

function show_del_button()
{
  let done = false;
  let index = 0;
  while(index < words_list.length && !done)
  {
    if(words_list[index].checked == true)
    {
      done = true;
    }
    index++;
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

function word_test()
{
  if (!WORD_PATTERN.test($("words").value))
  {
    $("statement").style.color = "red";
    $("statement").innerHTML = "Word has some ILLEGAL symbols! Try again!";
  }
  else
  {
    $("statement").style.color = "darkblue";
    $("statement").innerHTML = "";
  }
}

function part_of_speech_test()
{
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
      done = true;
    }
    else
    {
      $("statement").style.color = "darkblue";
      $("statement").innerHTML = "";
    }
    index++;
  }
}

function definition_test()
{
  let string = $("definition").value;
  string = string.replace("\n"," ");
  let done = false;
  let  index = 0;
  if (string != "")
  {
    while (index < string.length && !done)
    {
      if (white_space.test(string[index]))
      {
        index++;
      }
      else
      {
        if (!printable_chars.test(string[index]))
        {
          done = true;
        }
        index++;
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
    $("statement").innerHTML = "Definition has unprintable characters! " +
                                   "Try again!";
  }
  else
  {
    $("statement").style.color = "darkblue";
    $("statement").innerHTML = "";
  }
}

function new_pos_test()
{
  if (!WORD_PATTERN.test($("newspeech").value))
  {
    $("statement").style.color = "red";
    $("statement").innerHTML = "New part of speech has some ILLEGAL symbols! "
                                    + "Try again!";
  }
  else
  {
    $("statement").style.color = "darkblue";
    $("statement").innerHTML = "";
  }
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
      done = true;
    }
    else
    {
      $("statement").style.color = "darkblue";
      $("statement").innerHTML = "";
    }
    index++;
  }
}
