/*
Jingbo Wang
*/

"use strict";

const $ = (id) => document.getElementById(id);

/**
 * To click to button go where you want
 */
window.onload = function ()
{
  if ($("home"))
  {
    $("home").onclick = function ()
    {
      location.href = "home.php";
    };
  }

  if ($("ok"))
  {
    $("ok").onclick = function ()
    {
      location.href = "home.php";
    };
  }
};
