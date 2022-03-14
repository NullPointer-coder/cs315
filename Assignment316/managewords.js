// Jingbo Wang

"use strict";

function $(id)
{
  return document.getElementById(id);
}

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
}
