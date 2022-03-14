// Jingbo Wang

"use strict";

const $ = (id) => document.getElementById(id);

const  words_list = document.getElementsByClassName("words-list");

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

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("words").addEventListener("change", show_add_button);
  $("partofspeech").addEventListener("change", show_add_button);
  $("definition").addEventListener("change", show_add_button);

  $("newspeech").value = "";
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index++;
  }
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

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;
  $("newspeech").addEventListener("change", show_add_pos_button);

  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  let index = 0;
  while (index < words_list.length)
  {
    words_list[index].checked = false;
    index++;
  }
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

  $("add-submit").disabled = true;
  $("add-pos-submit").disabled = true;

  $("words").value = "";
  $("partofspeech").value = "";
  $("definition").value = "";
  $("newspeech").value = "";
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
