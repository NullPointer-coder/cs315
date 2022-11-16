/*
Jingbo Wang
 */

"use strict";

const printable_chars = /^[A-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
const punctuations = /[!"#%&'()*,.\\\/:;?@\[\]_{}-]+/;
const upper_chars = /[A-Z]+/;
const lower_chars = /[a-z]+/;
const digits = /\d+/;
const $ = (id) => document.getElementById(id);

/**
 * click different chosen checkbox to show different perform
 */
window.onload = function ()
{
  if ($("name_cb") && $("submit") && $("name_cb") && $("pass_cb")
       && $("manage_chosen") && $("new_displayname"))
  {
    $("name_cb").checked = true;
    $("submit").disabled = true;
    $("name_cb").onclick = click_name;
    $("pass_cb").onclick = click_pass;
    $("manage_chosen").onchange = cb_test;
    $("new_displayname").onkeyup = new_displayname_test;
  }

  if ($("home"))
  {
    $("home").onclick = function ()
    {
      location.href = "home.php";
    };
  }

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
};

/**
 * when all cb checked are false, only change display
 * name is visible
 */
function cb_test()
{
  if (!$("name_cb").checked && !$("pass_cb").checked)
  {
    $("name_cb").checked = true;
    $("pass_cb").checked = false;

    $("new_displayname").value = "";
    $("new_password").value = "";
    $("re_password").value = "";

    $("cb-p-name").classList.remove("not_checked");
    $("cb-p-name").classList.add("checked");
    $("cb-p-pass").classList.remove("checked");
    $("cb-p-pass").classList.add("not_checked");

    $("new-displayname").classList.remove("invisible");
    $("new-displayname").classList.add("visible");

    $("new-password").classList.remove("visible");
    $("new-password").classList.add("invisible");

    $("re-password").classList.remove("visible");
    $("re-password").classList.add("invisible");

    $("submit").disabled = true;
  }
}

/**
 * To check pass is valid or not
 */
function click_pass()
{
  $("new_displayname").value = "";
  $("new_password").value = "";
  $("re_password").value = "";

  $("name_test").classList.add("worning");
  $("name_test").classList.remove("correct");
  $("name_test").innerHTML = "&cross;";

  $("name_cb").checked = false;
  $("cb-p-name").classList.remove("checked");
  $("cb-p-name").classList.add("not_checked");

  $("new-displayname").classList.remove("visible");
  $("new-displayname").classList.add("invisible");

  $("cb-p-name").classList.remove("checked");
  $("cb-p-name").classList.add("not_checked");
  $("cb-p-pass").classList.remove("not_checked");
  $("cb-p-pass").classList.add("checked");

  $("new-password").classList.remove("invisible");
  $("new-password").classList.add("visible");

  $("re-password").classList.remove("invisible");
  $("re-password").classList.add("visible");

  $("submit").disabled = true;
  $("new_password").onkeyup = new_password_test;
  $("re_password").onkeyup = re_password_test;
}

/**
 *  To test the new_password is valid or not
 */
function new_password_test()
{
  let result = "";
  $("new_password").value.split("").forEach(function(char)
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
  $("new_password").value = result;

  let lower = false;
  if (lower_chars.test($("new_password").value))
  {
    lower = true;
    $("lowercase_test").classList.remove("worning");
    $("lowercase_test").classList.add("correct");
    $("lowercase_test").innerHTML = "&check;";
  }
  else
  {
    lower = false;
    $("lowercase_test").classList.add("worning");
    $("lowercase_test").classList.remove("correct");
    $("lowercase_test").innerHTML = "&cross;";
  }

  let upper = false;
  if (upper_chars.test($("new_password").value))
  {
    upper = true;
    $("uppercase_test").classList.remove("worning");
    $("uppercase_test").classList.add("correct");
    $("uppercase_test").innerHTML = "&check;";
  }
  else
  {
    upper = false;
    $("uppercase_test").classList.add("worning");
    $("uppercase_test").classList.remove("correct");
    $("uppercase_test").innerHTML = "&cross;";
  }

  let digit = false;
  if (digits.test($("new_password").value))
  {
    digit = true;
    $("digit_test").classList.remove("worning");
    $("digit_test").classList.add("correct");
    $("digit_test").innerHTML = "&check;";
  }
  else
  {
    digit = false;
    $("digit_test").classList.add("worning");
    $("digit_test").classList.remove("correct");
    $("digit_test").innerHTML = "&cross;";
  }

  let punctuation = false;
  if (punctuations.test($("new_password").value))
  {
    punctuation = true;
    $("punctuation_test").classList.remove("worning");
    $("punctuation_test").classList.add("correct");
    $("punctuation_test").innerHTML = "&check;";
  }
  else
  {
    punctuation = false;
    $("punctuation_test").classList.add("worning");
    $("punctuation_test").classList.remove("correct");
    $("punctuation_test").innerHTML = "&cross;";
  }

  let length = false;
  if ($("new_password").value.length > 5)
  {
    length = true;
    $("length_test").classList.remove("worning");
    $("length_test").classList.add("correct");
    $("length_test").innerHTML = "&check;";
  }
  else
  {
    length = false;
    $("length_test").classList.add("worning");
    $("length_test").classList.remove("correct");
    $("length_test").innerHTML = "&cross;";
  }

  if (lower && upper && digit && punctuation && length)
  {
    $("test").classList.remove("visible");
    $("test").classList.add("invisible");
    $("newpassword_test").classList.remove("worning");
    $("newpassword_test").classList.add("correct");
    $("newpassword_test").innerHTML = "&check;";
  }
  else
  {
    $("test").classList.remove("invisible");
    $("test").classList.add("visible");
    $("newpassword_test").classList.add("worning");
    $("newpassword_test").classList.remove("correct");
    $("newpassword_test").innerHTML = "&cross;";
  }
}

/**
 *  To test the re_enter password is same or not
 */
function re_password_test()
{
  $("test").classList.remove("visible");
  $("test").classList.add("invisible");

  if ($("re_password").value === $("new_password").value
        && $("re_password").value.length > 5)
  {
    $("repassword_test").classList.remove("worning");
    $("repassword_test").classList.add("correct");
    $("repassword_test").innerHTML = "&check;";
  }
  else
  {
    $("repassword_test").classList.add("worning");
    $("repassword_test").classList.remove("correct");
    $("repassword_test").innerHTML = "&cross;";
  }
  if ($("new_password").value !== ""
    && $("re_password").value !== ""
    && $("new_password").value === $("re_password").value)
  {
    $("submit").disabled = false;
  }
  else
  {
    $("submit").disabled = true;
  }
}

/**
 * To test the displayname is valid or not
 */
function click_name()
{
  $("test").classList.add("invisible");
  $("test").classList.remove("visible");

  $("new_displayname").value = "";
  $("new_password").value = "";
  $("re_password").value = "";

  $("pass_cb").checked = false;
  $("cb-p-name").classList.remove("not_checked");
  $("cb-p-name").classList.add("checked");

  $("new-displayname").classList.remove("invisible");
  $("new-displayname").classList.add("visible");

  $("cb-p-pass").classList.remove("checked");
  $("cb-p-pass").classList.add("not_checked");

  $("new-password").classList.remove("visible");
  $("new-password").classList.add("invisible");

  $("re-password").classList.remove("visible");
  $("re-password").classList.add("invisible");

  $("new_displayname").onkeyup = new_displayname_test;

}

/**
 * To test the display name is valid or not
 */
function new_displayname_test()
{
  if ($("new_displayname").value !== "")
  {
    $("name_test").classList.remove("worning");
    $("name_test").classList.add("correct");
    $("name_test").innerHTML = "&check;";

    $("submit").disabled = false;
  }
  else
  {
    $("name_test").classList.add("worning");
    $("name_test").classList.remove("correct");
    $("name_test").innerHTML = "&cross;";
    $("submit").disabled = true;
  }
  let result = "";
  $("new_displayname").value.split("").forEach(function(char)
  {
    if (printable_chars.test(char))
    {
      result += char;
    }
  });
  $("new_displayname").value = result.trim();
}
