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
  if ($("login") && $("signup"))
  {
    $("login").onclick = function ()
    {
      location.href = "login.php";
    };
    $("signup").onclick = function ()
    {
      location.href = "signup.php";
    };
  }
  if ($("logout"))
  {
    $("logout").onclick = function ()
    {
      location.href = "logout.php";
    };
  }

  if ($("me"))
  {
    $("me").onclick = function ()
    {
      location.href = "aboutme.php";
    };
  }

  if ($("manager"))
  {
    $("manager").onclick = function ()
    {
      location.href = "manager.php";
    };
  }
};
