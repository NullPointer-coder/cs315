/*
Jingbo Wang
 */

"use strict";

const printable_chars = /[A-Za-z0-9!"#$%&'()*+,.\\\/:;<=>?@\[\] ^_`{|}~-]/;
const  punctuations = /[!"#%&'()*,.\\\/:;?@\[\]_{}-]+/;
const upper_chars = /[A-Z]+/;
const lower_chars = /[a-z]+/;
const digits = /\d+/;
const $ = (id) => document.getElementById(id);

/**
 * onload all function for sign up user
 */
window.onload = function ()
{
  if ($("submit") && $("username") && $("password")
    && $("re_password") && $("displayname"))
  {
    $("submit").disabled = true;
    $("username").onkeyup = username_test;
    $("password").onkeyup = password_test;
    $("re_password").onkeyup = re_password_test;
    $("displayname").onkeyup = displayname_test;
  }
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

/**
 *  user name test
 */
function username_test()
{
  $("test").classList.remove("visible");
  $("test").classList.add("invisible");
  const re = /\w/;
  let result = "";
  $("username").value.split("").forEach(function(char)
  {
    if (re.test(char))
    {
      result += char;
    }
  });
  $("username").value = result;

  if ($("username").value !== "")
  {
    $("name_test").classList.remove("warning");
    $("name_test").classList.add("correct");
    $("name_test").innerHTML = "&check;";
  }
  else
  {
    $("name_test").classList.add("warning");
    $("name_test").classList.remove("correct");
    $("name_test").innerHTML = "&cross;";
  }
  show_sign_button();
 }

/**
 *  To test the new_password is valid or not
 */
function password_test()
{
  $("test").classList.remove("invisible");
  $("test").classList.add("visible");

  let result = "";
  $("password").value.split("").forEach(function(char)
  {
    if (lower_chars.test(char))
    {
      result += char;
    }
    if (upper_chars.test(char))
    {
      result += char;
    }
    if (digits.test(char))
    {
      result += char;
    }
    if (punctuations.test(char))
    {
      result += char;
    }
  });
  $("password").value = result;

  let lower = false;
  if (lower_chars.test($("password").value))
  {
    lower = true;
    $("lowercase_test").classList.remove("warning");
    $("lowercase_test").classList.add("correct");
    $("lowercase_test").innerHTML = "&check;";
  }
  else
  {
    lower = false;
    $("lowercase_test").classList.add("warning");
    $("lowercase_test").classList.remove("correct");
    $("lowercase_test").innerHTML = "&cross;";
  }

  let upper = false;
  if (upper_chars.test($("password").value))
  {
    upper = true;
    $("uppercase_test").classList.remove("warning");
    $("uppercase_test").classList.add("correct");
    $("uppercase_test").innerHTML = "&check;";
  }
  else
  {
    upper = false;
    $("uppercase_test").classList.add("warning");
    $("uppercase_test").classList.remove("correct");
    $("uppercase_test").innerHTML = "&cross;";
  }

  let digit = false;
  if (digits.test($("password").value))
  {
    digit = true;
    $("digit_test").classList.remove("warning");
    $("digit_test").classList.add("correct");
    $("digit_test").innerHTML = "&check;";
  }
  else
  {
    digit = false;
    $("digit_test").classList.add("warning");
    $("digit_test").classList.remove("correct");
    $("digit_test").innerHTML = "&cross;";
  }

  let punctuation = false;
  if (punctuations.test($("password").value))
  {
    punctuation = true;
    $("punctuation_test").classList.remove("warning");
    $("punctuation_test").classList.add("correct");
    $("punctuation_test").innerHTML = "&check;";
  }
  else
  {
    punctuation = false;
    $("punctuation_test").classList.add("warning");
    $("punctuation_test").classList.remove("correct");
    $("punctuation_test").innerHTML = "&cross;";
  }

  let length = false;
    if ($("password").value.length > 5)
  {
    length = true;
    $("length_test").classList.remove("warning");
    $("length_test").classList.add("correct");
    $("length_test").innerHTML = "&check;";
  }
  else
  {
    length = false;
    $("length_test").classList.add("warning");
    $("length_test").classList.remove("correct");
    $("length_test").innerHTML = "&cross;";
  }

  if (lower && upper && digit && punctuation && length)
  {
    $("test").classList.remove("visible");
    $("test").classList.add("invisible");
    $("password_test").classList.remove("warning");
    $("password_test").classList.add("correct");
    $("password_test").innerHTML = "&check;";
  }
  else
  {
    $("test").classList.remove("invisible");
    $("test").classList.add("visible");
    $("password_test").classList.add("warning");
    $("password_test").classList.remove("correct");
    $("password_test").innerHTML = "&cross;";
  }
  show_sign_button();
}

/**
 *  To test the re_enter password is same or not
 */
function re_password_test()
{
  $("test").classList.remove("visible");
  $("test").classList.add("invisible");
  if ($("re_password").value === $("password").value
        && $("re_password").value.length > 5)
  {
    $("repassword_test").classList.remove("warning");
    $("repassword_test").classList.add("correct");
    $("repassword_test").innerHTML = "&check;";
  }
  else
  {
    $("repassword_test").classList.add("warning");
    $("repassword_test").classList.remove("correct");
    $("repassword_test").innerHTML = "&cross;";
  }
  show_sign_button();
}

/**
 * To test the display name is valid or not
 */
function displayname_test()
{
  $("test").classList.remove("visible");
  $("test").classList.add("invisible");
  let result = "";
  $("displayname").value.split("").forEach(function(char)
  {
    if (printable_chars.test(char))
    {
      result += char;
    }
  });
  $("displayname").value = result;
  if ($("displayname").value !== "")
  {
    $("displayname_test").classList.remove("warning");
    $("displayname_test").classList.add("correct");
    $("displayname_test").innerHTML = "&check;";
  }
  else
  {
    $("displayname_test").classList.add("warning");
    $("displayname_test").classList.remove("correct");
    $("displayname_test").innerHTML = "&cross;";
  }
  show_sign_button();
}

function show_sign_button()
{
  if ($("username").value !== ""
    && $("password").value !== ""
    && $("re_password").value !== ""
    && $("password").value === $("re_password").value
    && $("displayname").value !== "")
  {
    $("submit").disabled = false;
  }
  else
  {
    $("submit").disabled = true;
  }
}
