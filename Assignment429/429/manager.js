/*
  Jingbo Wang
 */
const $ = (id) => document.getElementById(id);
const delete_id_list = document.getElementsByName("delete_list[]");
const demote_id_list = document.getElementsByName("demote_list[]");
const promote_id_list = document.getElementsByName("promote_list[]");

/**
 * click different chosen checkbox to show different perform
 */
window.onload = function ()
{
  if ($("delete-wrapper") && $("delete_submit") && $("demote_submit")
      && $("demote_submit") && $("promote_submit") && $("delete_cb")
      && $("manager_chosen") && $("delete_cb") && $("demote_cb")
      && $("promote_cb"))
  {
    $("delete-wrapper").onchange = show_del_button;
    $("delete_submit").disabled = true;
    $("demote_submit").disabled = true;
    $("promote_submit").disabled = true;
    $("delete_cb").checked = true;
    $("manager_chosen").onchange = cb_test;
    $("delete_cb").onclick = click_delete;
    $("demote_cb").onclick = click_demote;
    $("promote_cb").onclick = click_promote;
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
 * when all cb checked are false, only change delete
 * user is visible
 */
function cb_test()
{
  if (!$("delete_cb").checked && !$("demote_cb").checked
       && !$("promote_cb").checked)
  {
    clean_delete();
    clean_demote();
    clean_promote();

    $("delete_id").innerHTML = 0;
    $("demote_id").innerHTML = 0;
    $("promote_id").innerHTML = 0;

    $("delete_cb").checked = true;
    $("demote_cb").checked = false;
    $("promote_cb").checked = false;

    $("cb-p-delete").classList.remove("not_checked");
    $("cb-p-delete").classList.add("checked");

    $("cb-p-demote").classList.remove("checked");
    $("cb-p-demote").classList.add("not_checked");

    $("cb-p-promote").classList.remove("checked");
    $("cb-p-promote").classList.add("not_checked");

    $("delete").classList.remove("invisible");
    $("delete").classList.add("visible");

    $("demote").classList.add("invisible");
    $("demote").classList.remove("visible");

    $("promote").classList.add("invisible");
    $("promote").classList.remove("visible");
  }
}

function click_delete()
{
  clean_delete();
  clean_demote();
  clean_promote();

  $("delete_id").innerHTML = 0;
  $("demote_id").innerHTML = 0;
  $("promote_id").innerHTML = 0;

  $("demote_cb").checked = false;
  $("promote_cb").checked = false;

  $("cb-p-delete").classList.remove("not_checked");
  $("cb-p-delete").classList.add("checked");

  $("cb-p-demote").classList.remove("checked");
  $("cb-p-demote").classList.add("not_checked");

  $("cb-p-promote").classList.remove("checked");
  $("cb-p-promote").classList.add("not_checked");

  $("delete").classList.remove("invisible");
  $("delete").classList.add("visible");

  $("demote").classList.add("invisible");
  $("demote").classList.remove("visible");

  $("promote").classList.add("invisible");
  $("promote").classList.remove("visible");

  if (parseInt($("delete_total").innerHTML) > 0)
  {
    $("delete_result").classList.add("visible");
    $("delete_result").classList.remove("invisible");
  }
  else
  {
    $("delete_result").classList.add("invisible");
    $("delete_result").classList.remove("visible");
  }
  $("delete-wrapper").onchange = show_del_button;
}

/**
 * To show the del button
 */
function show_del_button()
{
  let done = false;
  let index = 0;
  while (index < delete_id_list.length && !done)
  {
    if (delete_id_list[index].checked)
    {
      done = true;
    }
    index += 1;
  }
  $("delete_submit").disabled = !done ? true : false;
  delete_ids();
}

/**
 *  to count the number of delete_id
 */
function delete_ids()
{
  let count = 0;
  let index = 0;
  while (index < delete_id_list.length)
  {
    if (delete_id_list[index].checked)
    {
      count += 1;
    }
    index += 1;
  }
  $("delete_id").innerHTML = count;
}

/**
 *  to clean delete_id list
 */
function clean_delete()
{
  let index = 0;
  while (index < delete_id_list.length)
  {
    if (delete_id_list[index].checked)
    {
      delete_id_list[index].checked = false;
    }
    index += 1;
  }
}

/**
 * To show the demote button
 */
function click_demote()
{
  clean_delete();
  clean_demote();
  clean_promote();

  $("delete_id").innerHTML = 0;
  $("demote_id").innerHTML = 0;
  $("promote_id").innerHTML = 0;

  $("delete_cb").checked = false;
  $("promote_cb").checked = false;

  $("cb-p-delete").classList.add("not_checked");
  $("cb-p-delete").classList.remove("checked");

  $("cb-p-demote").classList.add("checked");
  $("cb-p-demote").classList.remove("not_checked");

  $("cb-p-promote").classList.remove("checked");
  $("cb-p-promote").classList.add("not_checked");

  $("delete").classList.add("invisible");
  $("delete").classList.remove("visible");

  $("demote").classList.remove("invisible");
  $("demote").classList.add("visible");

  $("promote").classList.add("invisible");
  $("promote").classList.remove("visible");

  if (parseInt($("demote_total").innerHTML) > 0)
  {
    $("demote_result").classList.add("visible");
    $("demote_result").classList.remove("invisible");
  }
  else
  {
    $("demote_result").classList.add("invisible");
    $("demote_result").classList.remove("visible");
  }
  $("demote-wrapper").onchange = show_dem_button;
}

/**
 * To show the dem button
 */
function show_dem_button()
{
  let done = false;
  let index = 0;
  while (index < demote_id_list.length && !done)
  {
    if (demote_id_list[index].checked)
    {
      done = true;
    }
    index += 1;
  }
  $("demote_submit").disabled = !done ? true : false;
  demote_ids();
}

/**
 * To count the number of id in demote id list
 */
function demote_ids()
{
  let count = 0;
  let index = 0;
  while (index < demote_id_list.length)
  {
    if (demote_id_list[index].checked)
    {
      count += 1;
    }
    index += 1;
  }
  $("demote_id").innerHTML = count;
}

/**
 * To clean the demote id list
 */
function clean_demote()
{
  let index = 0;
  while (index < demote_id_list.length)
  {
    if (demote_id_list[index].checked)
    {
      demote_id_list[index].checked = false;
    }
    index += 1;
  }
}

function click_promote()
{
  clean_delete();
  clean_demote();
  clean_promote();

  $("delete_id").innerHTML = 0;
  $("demote_id").innerHTML = 0;
  $("promote_id").innerHTML = 0;

  $("delete_cb").checked = false;
  $("demote_cb").checked = false;

  $("cb-p-delete").classList.add("not_checked");
  $("cb-p-delete").classList.remove("checked");

  $("cb-p-demote").classList.remove("checked");
  $("cb-p-demote").classList.add("not_checked");

  $("cb-p-promote").classList.add("checked");
  $("cb-p-promote").classList.remove("not_checked");

  $("delete").classList.add("invisible");
  $("delete").classList.remove("visible");

  $("demote").classList.add("invisible");
  $("demote").classList.remove("visible");

  $("promote").classList.remove("invisible");
  $("promote").classList.add("visible");

  if (parseInt($("promote_total").innerHTML) > 0)
  {
    $("promote_result").classList.add("visible");
    $("promote_result").classList.remove("invisible");
  }
  else
  {
    $("promote_result").classList.add("invisible");
    $("promote_result").classList.remove("visible");
  }
  $("promote-wrapper").onchange = show_prom_button;
}

/**
 * To show the prom button
 */
function show_prom_button()
{
  let done = false;
  let index = 0;
  while (index < promote_id_list.length && !done)
  {
    if (promote_id_list[index].checked)
    {
      done = true;
    }
    index += 1;
  }
  $("promote_submit").disabled = !done ? true : false;
  promote_ids();
}

/**
 *  To count the number of id in promote id list
 */
function promote_ids()
{
  let count = 0;
  let index = 0;
  while (index < promote_id_list.length)
  {
    if (promote_id_list[index].checked)
    {
      count += 1;
    }
    index += 1;
  }
  $("promote_id").innerHTML = count;
}


/**
 *  To count the number of id in promote id list
 */
function clean_promote()
{
  let index = 0;
  while (index < promote_id_list.length)
  {
    if (promote_id_list[index].checked)
    {
      promote_id_list[index].checked = false;
    }
    index += 1;
  }
}
