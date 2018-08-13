
// ------------------ For Preferences Search ---------------------
var prefSearchDiv = document.querySelector('#preferences_search');
prefSearchDiv.innerHTML = '<input type="text" id="myPrefSearch" placeholder="Search here for preferences ...">'

prefSearchDiv.onkeyup = function() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.querySelector("#myPrefSearch");
  filter = input.value.toUpperCase();
  table = document.querySelector("#preftable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    if (tr[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

// ---------------------------- For Autocomplete functionality -------------------------------

function splitInputValuesForAutoComplete(inp) {
  // To get the value from current caret position.
  let curCaretPos = (inp.selectionStart || inp.selectionStart == 0) ? inp.selectionStart : 0;
  let fieldValue = inp.value;
  let leftPartFromCurCaret = fieldValue.substring(0,curCaretPos);

  let lastPosInleftPart = leftPartFromCurCaret.lastIndexOf(CHAR_SEPARATOR_FOR_MULTI_SEARCH);
  let leftPart = leftPartFromCurCaret.substring(0,lastPosInleftPart);
  let rightPart = fieldValue.substring(curCaretPos, fieldValue.length+1);
  if (rightPart.startsWith(CHAR_SEPARATOR_FOR_MULTI_SEARCH)) rightPart = rightPart.substring(1, rightPart.length+1);

  let curVal = fieldValue.substring(lastPosInleftPart+1, curCaretPos);

  return {
    "curVal": curVal,
    "leftPart" : leftPart,
    "rightPart": rightPart
  };
}

function autocomplete(inp, listArrFunction) {

  function showSuggesstions(e, inp, listArrFunction) {
    let arr = listArrFunction(inp);

    let splitInputObj = splitInputValuesForAutoComplete(inp);
    var a, b, i, val = splitInputObj.curVal;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { val="";}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    inp.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && arr[i].trim() != "") {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              let splitInputObj = splitInputValuesForAutoComplete(inp);
              /*insert the value for the autocomplete text field:*/
              let selectedVal = this.getElementsByTagName("input")[0].value;
              let calculatedVal = (splitInputObj.leftPart == "") ? "" : splitInputObj.leftPart + CHAR_SEPARATOR_FOR_MULTI_SEARCH;
              calculatedVal += selectedVal;
              calculatedVal += (splitInputObj.rightPart == "") ? "" : CHAR_SEPARATOR_FOR_MULTI_SEARCH + splitInputObj.rightPart;
              inp.value = calculatedVal;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
        });
        a.appendChild(b);
      }
    }
  }

  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    showSuggesstions(e, inp, listArrFunction);
  });

  /* when focus is in the field */
  inp.addEventListener("focusin", function(e) {
    if (!this.value || this.value.trim() == "") {
      showSuggesstions(e, inp, listArrFunction);
    }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        e.preventDefault();
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        if (currentFocus !== undefined && currentFocus > -1) {
          e.preventDefault();
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      } else if (e.keyCode == 9) { //tab out
        closeAllLists();
      }
  });

  /* On Lost Focus */
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[0].parentElement.getElementsByTagName("input")[0]) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
