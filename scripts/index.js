// Function: Converts HTML string to DOM node
function convertHTMLToNode(htmlString) {
  var wrapperDiv = document.createElement('div');
  wrapperDiv.innerHTML = htmlString.trim();

  // Return the first child of the wrapper div
  return wrapperDiv.firstChild;
}

// Function: Sets the cursor to the end of editable content
function setCursorToEndOfContent(contentElement) {
  var range, selection;
  range = document.createRange(); // Create a range object
  range.selectNodeContents(contentElement); // Select the entire contents of the element
  range.collapse(false); // Collapse the range to the end point (end of the content)
  selection = window.getSelection(); // Get the selection object
  selection.removeAllRanges(); // Remove any existing selections
  try {
    selection.addRange(range); // Set the created range as the visible selection
  } catch (error) {
    console.error(error);
  }
}

// Function: Inserts an element after another
function insertElementAfter(newElement, referenceElement) {
  referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

// Function: Formats the minute with leading zero
function formatMinute(i) {
  return i < 10 ? '0' + i : i;
}

// Function: Formats the hour for standard (12hr) time
function formatHour(i) {
  i = i % 12;
  return i == 0 ? 12 : i;
}

// Function: Starts the time display
function displayTime() {
  // Clear the timer if it's already running
  if (window.newTab.clock.nextMinute)
    clearTimeout(window.newTab.clock.nextMinute);

  // Get current time
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let period = "";

  // Set period (AM/PM) if not using 24-hour format
  if (!window.newTab.clock.military) {
    period = hours > 11 ? " PM" : " AM";
    hours = formatHour(hours);
  }

  // Display the time
  document.getElementById('time').innerHTML = hours + ":" + formatMinute(minutes);
  document.getElementById("period").innerHTML = period;

  // Calculate time until the next minute
  today = new Date();
  let seconds = today.getSeconds();
  let milliseconds = today.getMilliseconds();
  let timeUntilNextMinute = (60 - seconds) * 1000 + (1000 - milliseconds);

  // Set timeout to update minutes display
  window.newTab.clock.nextMinute = setTimeout(function() {
    updateMinutes(hours, minutes + 1);
  }, timeUntilNextMinute);
}

// Function: Updates the minutes display
function updateMinutes(hours, minutes) {
  if (minutes % 10 == 0) {
    // Sync time (roughly every 10 minutes)
    displayTime();
  } else {
    // Update minutes display
    document.getElementById('time').innerHTML = hours + ":" + formatMinute(minutes);

    // Call self recursively to update the time every minute
    window.newTab.clock.nextMinute = setTimeout(function() {
      updateMinutes(hours, minutes + 1);
    }, 60000);
  }
}

// Function: Makes an element draggable (customized for specific widgets like time, search bar, todo list)
function makeElementDraggable(widgetElement) {
  let startX = 0,
    startY = 0,
    deltaX = 0,
    deltaY = 0;

  // Depending on the type of widget, set the appropriate mousedown event listener
  if (widgetElement.id == "timeWidget")
    document.getElementById("time").onmousedown = startDrag;
  if (widgetElement.id == "searchWidget")
    document.getElementById("searchDiv").onmousedown = startDrag;
  if (widgetElement.id == "todoWidget")
    document.getElementById("todoDiv").onmousedown = startDrag;
  if (widgetElement.id == "infoWidget")
    document.getElementById("info").onmousedown = startDrag;

  // Function: Handles the start of dragging
  function startDrag(event) {
    event = event || window.event;
    event.preventDefault();
    // Get the mouse cursor position at the start:
    startX = event.clientX;
    startY = event.clientY;
    document.onmouseup = endDrag;
    // Call a function whenever the cursor moves:
    document.onmousemove = dragElement;
  }

  // Function: Drags the element
  function dragElement(event) {
    event = event || window.event;
    event.preventDefault();
    // Calculate the new cursor position:
    deltaX = startX - event.clientX;
    deltaY = startY - event.clientY;
    startX = event.clientX;
    startY = event.clientY;
    // Set the element's new position:
    widgetElement.style.top = (widgetElement.offsetTop - deltaY) + "px";
    widgetElement.style.left = (widgetElement.offsetLeft - deltaX) + "px";
    // Set window.dragged to true to indicate that an element was moved
    if (!window.newTab.dragged)
      window.newTab.dragged = true;
  }

  // Function: Handles the end of dragging
  function endDrag() {
    // Clear mouse event listeners when dragging ends
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Function: Stop dragging the element when the mouse button is released
function stopDraggingElement(element) {
  // Reset the dragged flag to false
  if (window.newTab.dragged) {
    window.newTab.dragged = false;

    // Save the current location for the elements
    if (element.id == "timeWrapper") {
      // Save time widget position to local storage
      chrome.storage.local.set({
        time_top_data: element.style.top,
        time_left_data: element.style.left
      }, function() {});
      // Toggle between 12-hour and 24-hour time format
      window.newTab.clock.military = !window.newTab.clock.military;
    }
    if (element.id == "searchWrapper") {
      // Save search widget position to local storage
      chrome.storage.local.set({
        search_top_data: element.style.top,
        search_left_data: element.style.left
      }, function() {});
    }
    if (element.id == "todoWrapper") {
      // Save todo widget position to local storage
      chrome.storage.local.set({
        todo_top_data: element.style.top,
        todo_left_data: element.style.left
      }, function() {});
    }
    if (element.id == "infoWrapper") {
      // Decrement info mode and save info widget position to local storage
      window.newTab.infoMode -= 1;
      chrome.storage.local.set({
        info_top_data: element.style.top,
        info_left_data: element.style.left
      }, function() {});
    }
  }
  // Clear mouse event listeners
  document.onmouseup = null;
  document.onmousemove = null;
}

// Function: Toggle between 12-hour and 24-hour time format
function toggleMilitaryTime() {
  window.newTab.clock.military = !window.newTab.clock.military;
  // Save the state of the military time switch to local storage
  if (window.newTab.clock.military)
    chrome.storage.local.set({
      military_switch: 'on'
    }, function() {});
  else
    chrome.storage.local.set({
      military_switch: 'off'
    }, function() {});
  // Start updating the time display
  startTime();
}

// Function: Toggles the visibility of the search bar
function toggleSearchVisibility() {
  // Get the search wrapper and the search switch elements
  let searchWrapper = document.getElementById("searchWrapper");
  let searchSwitch = document.getElementById("searchSwitch");

  // Remove the 'firstStart' class to ensure smooth transition
  searchWrapper.classList.remove("firstStart");

  // Check the state of the search switch and toggle visibility accordingly
  if (searchSwitch.checked) {
    // If search switch is checked, hide the search bar
    searchSwitch.checked = false;
    searchWrapper.classList.add("exit");
    searchWrapper.classList.remove("entrance");
    // Save the state of the search switch to local storage
    chrome.storage.local.set({
      search_switch: "off"
    }, function() {});
  } else {
    // If search switch is not checked, show the search bar
    searchSwitch.checked = true;
    searchWrapper.classList.add("entrance");
    searchWrapper.classList.remove("exit");
    // Save the state of the search switch to local storage
    chrome.storage.local.set({
      search_switch: "on"
    }, function() {});
  }
}

// Function: Changes the search engine
function changeSearchEngine() {
  // Retrieve the current search engine index from local storage
  chrome.storage.local.get({
    search_engine: 0
  }, function(data) {
    // Increment the index to change the search engine
    let newIndex = data.search_engine + 1;
    // Reset index to 0 if it exceeds the length of available search engines
    if (newIndex === window.newTab.searchEngines.length)
      newIndex = 0;

    // Get the search input element
    let searchInput = $('#searchInput');
    // Set the action attribute of the search form to the new search engine's action
    searchInput.parent().attr('action', window.newTab.searchEngines[newIndex].action);

    // Store the current value of the search input
    let inputValue = (searchInput.val() == searchInput.attr('data-placeholder') ? "" : searchInput.val());

    // Update the placeholder attribute of the search input
    searchInput.attr('data-placeholder', window.newTab.searchEngines[newIndex].placeholder);

    // Restore the previous value of the search input
    searchInput.val(inputValue);

    // Focus and blur the search input to update the display
    searchInput.focus();
    searchInput.blur();

    // Save the new search engine index to local storage
    chrome.storage.local.set({
      search_engine: newIndex
    }, function() {});
  });
}

// Function: Toggles the visibility of the time display
function toggleTimeDisplay() {
  // Get the time display wrapper and the time switch checkbox
  let timeDisplayWrapper = document.getElementById("timeWrapper");
  let timeSwitch = document.getElementById("timeSwitch");

  // Remove the 'firstStart' class to ensure smooth transition
  timeDisplayWrapper.classList.remove("firstStart");

  // Toggle the visibility based on the state of the switch
  if (timeSwitch.checked) {
    timeSwitch.checked = false;
    timeDisplayWrapper.classList.add("exit");
    timeDisplayWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      time_switch: "off"
    }, function() {});
  } else {
    timeSwitch.checked = true;
    timeDisplayWrapper.classList.add("entrance");
    timeDisplayWrapper.classList.remove("exit");
    chrome.storage.local.set({
      time_switch: "on"
    }, function() {});
  }
}

// Function: Toggles the visibility of the info display
function toggleInfoDisplay() {
  // Get the info display wrapper and the info switch checkbox
  let infoDisplayWrapper = document.getElementById("infoWrapper");
  let infoSwitch = document.getElementById("infoSwitch");

  // Remove the 'firstStart' class to ensure smooth transition
  infoDisplayWrapper.classList.remove("firstStart");

  // Toggle the visibility based on the state of the switch
  if (infoSwitch.checked) {
    infoSwitch.checked = false;
    infoDisplayWrapper.classList.add("exit");
    infoDisplayWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      info_switch: "off"
    }, function() {});
  } else {
    infoSwitch.checked = true;
    infoDisplayWrapper.classList.add("entrance");
    infoDisplayWrapper.classList.remove("exit");
    chrome.storage.local.set({
      info_switch: "on"
    }, function() {});
  }
}

// Function: Toggles the visibility of the todo list
function toggleTodoList() {
  // Get the todo list wrapper and the todo switch checkbox
  let todoWrapper = document.getElementById("todoWrapper");
  let todoSwitch = document.getElementById("todoSwitch");

  // Remove the 'firstStart' class to ensure smooth transition
  todoWrapper.classList.remove("firstStart");

  // Toggle the visibility based on the state of the switch
  if (todoSwitch.checked) {
    todoSwitch.checked = false;
    todoWrapper.classList.add("exit");
    todoWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      todo_switch: "off"
    }, function() {});
  } else {
    todoSwitch.checked = true;
    todoWrapper.classList.add("entrance");
    todoWrapper.classList.remove("exit");
    chrome.storage.local.set({
      todo_switch: "on"
    }, function() {});
  }
}

// Function: Toggles the visibility of the todo list
function toggleTodoVisibility() {
  // Get the todo wrapper and the todo switch checkbox
  let todoWrapper = document.getElementById("todoWrapper");
  let todoSwitch = document.getElementById("todoSwitch");

  // Remove the 'firstStart' class to ensure smooth transition
  todoWrapper.classList.remove("firstStart");

  // Toggle the visibility based on the state of the switch
  if (todoSwitch.checked) {
    todoSwitch.checked = false;
    todoWrapper.classList.add("exit");
    todoWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      todo_switch: "off"
    }, function() {});
  } else {
    todoSwitch.checked = true;
    todoWrapper.classList.add("entrance");
    todoWrapper.classList.remove("exit");
    chrome.storage.local.set({
      todo_switch: "on"
    }, function() {});
  }
}

// Function: Updates the filter effects based on slider values
function updateFilterEffects() {
  // Get slider values for different filter effects
  let brightnessValue = document.getElementById("darkSlider").value;
  let saturationValue = document.getElementById("satuSlider").value;
  let contrastValue = document.getElementById("conSlider").value;
  let blurValue = document.getElementById("blurSlider").value;

  // Apply the filter effects to the background loader element
  document.getElementById("backloader").style = "filter: brightness(" + brightnessValue / 100 + ") " +
    "saturate(" + saturationValue / 100 + ") " +
    "contrast(" + contrastValue / 100 + ") " +
    "blur(" + blurValue / 10 + "px);";

  // Store the filter values in Chrome storage
  let filterValues = [brightnessValue, saturationValue, contrastValue, blurValue];
  chrome.storage.local.set({
    filter: filterValues
  }, function() {});
}

// Function: Saves the todo list to Chrome storage
function saveTodoList() {
  // Get all the todo list items
  let todoListItems = document.getElementById("myUL").getElementsByTagName("LI");
  let todoListData = "";

  // Loop through each todo list item and concatenate the text content
  for (let i = 0; i < todoListItems.length; i++) {
    if (todoListItems[i].classList.contains('checked'))
      todoListData += "☑" + todoListItems[i].innerText.trim(); // Checked item indicator
    else
      todoListData += todoListItems[i].innerText.trim();
  }

  // Store the todo list data in Chrome storage
  chrome.storage.local.set({
    todo_data: todoListData
  }, function() {});
}

// Function: Resets selected data
function resetUserData() {
  // Show confirmation dialog
  $.confirm({
    title: 'Are you sure you want to reset your data?',
    content: '<span style="font-size: 16px;">Choose what data you would like to reset: </span><br>' +
      '<br><label class="reset-container""> Widgets Location' +
      '<input type="checkbox" id="reset-input-loc" checked="checked">' +
      '<span class="reset-checkmark"></span></label>' +
      '<br><label class="reset-container"> Widgets Preferences/Data' +
      '<input type="checkbox" id="reset-input-pref" checked="checked">' +
      '<span class="reset-checkmark"></span></label>' +
      '<br><label class="reset-container"> Favorite Backgrounds' +
      '<input type="checkbox" id="reset-input-fav" checked="checked">' +
      '<span class="reset-checkmark"></span></label>' +
      '<br><label class="reset-container"> Removed Backgrounds' +
      '<input type="checkbox" id="reset-input-rem" checked="checked">' +
      '<span class="reset-checkmark"></span></label>' +
      '<br>This action cannot be undone!',
    boxWidth: '25%',
    useBootstrap: false,
    type: 'blue',
    escapeKey: 'cancel',
    theme: 'dark',
    animation: window.newTab.confirmSettings.animation,
    closeAnimation: window.newTab.confirmSettings.animation,
    animateFromElement: false,
    scrollToPreviousElement: false,
    buttons: {
      ok: {
        text: "Got it, reset",
        btnClass: 'btn-blue',
        keys: ['enter'],
        action: function() {
          // Reset selected data based on checkboxes
          if (this.$content.find('#reset-input-loc').is(":checked")) {
            chrome.storage.local.set({
                time_top_data: '',
                time_left_data: '',
                info_top_data: '',
                info_left_data: '',
                todo_top_data: '',
                todo_left_data: '',
                search_top_data: '',
                search_left_data: '',
              },
              function() {});
          }
          if (this.$content.find('#reset-input-pref').is(":checked")) {
            chrome.storage.local.set({
                military_switch: 'off',
                time_switch: 'on',
                info_mode: 0,
                info_switch: 'on',
                search_switch: 'on',
                todo_switch: 'on',
                todo_data: ''
              },
              function() {});
          }
          if (this.$content.find('#reset-input-fav').is(":checked")) {
            chrome.storage.local.set({
                fav_switch: 'off',
                fav_list: []
              },
              function() {});
          }
          if (this.$content.find('#reset-input-rem').is(":checked")) {
            chrome.storage.local.set({
                black_list: []
              },
              function() {});
          }
          // Reload the page after resetting data
          location.reload();
        }
      },
      cancel: function() {
        setTimeout(function() {
          document.getElementById("menu").classList.remove("delay")
        }, 250);
      }
    }
  });
}

// Function: Assign event listeners to list items
function assignListItemEventListeners(item) {
  // Click event handler
  item.onclick = function() {
    if (document.activeElement == null || !document.activeElement.classList.contains('listText')) {
      $(this).find('.listText').focus();
      setEndOfEditableContent(this.firstChild);
    } else {
      $(this).find('.listText').focus();
    }
    // Disable sorting when clicking on a list item
    $(this).parent().sortable("disable");
  }

  // Mouse down event handler
  item.onmousedown = function(evt) {
    if (evt.button === 2) {
      evt.preventDefault();
      window.getSelection().empty();
    }
  }

  // Context menu event handler
  item.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    this.classList.toggle('checked');
    window.getSelection().empty();
    saveTodoList();
  });

  // Key up event handler
  item.addEventListener('keyup', (evt) => {
    if (evt.keyCode === 8) {
      if (item.innerText == "\u00D7") {
        evt.preventDefault();
        let node = createHTMLElement("<br>");
        item.firstChild.appendChild(node);
      }
    }
  });

  // Key down event handler
  item.addEventListener('keydown', (evt) => {
    if (evt.which === 13) {
      let item = document.activeElement.parentElement;
      let newItem = createListItem("", false);
      insertAfter(newItem, item);
      document.getElementById("todoInput").style = "display: none;";
      saveTodoList();
      item.nextElementSibling.firstChild.focus();
      evt.preventDefault();
    } else if (evt.keyCode === 8) {
      let item = document.activeElement.parentElement;
      if (item.innerText.trim() == "\u00D7") {
        evt.preventDefault();
        let previous = item.previousElementSibling.firstChild;
        if (previous != null) {
          previous.focus();
          setEndOfEditableContent(previous);
        }
        item.parentNode.removeChild(item);
        if (document.getElementById("myUL").getElementsByTagName("li").length == 0)
          document.getElementById("todoInput").style = "";
        saveTodoList();
      }
    } else if (evt.keyCode === 38) {
      let previous = item.previousElementSibling.firstChild;
      if (previous != null) {
        previous.focus();
      }
    } else if (evt.keyCode === 40) {
      let next = item.nextElementSibling.firstChild;
      if (next != null) {
        next.focus();
      }
    }
  });

  // Blur event handler
  item.firstChild.addEventListener("blur", function() {
    $(this).parent().parent().sortable("enable");
  }, false);

  // Input event handler
  item.firstChild.addEventListener("input", function() {
    saveTodoList();
  });
}

// Function: Creates a new list item and returns it
function createNewListItem(text, checked) {
  let listItem = document.createElement("li");

  // Toggle checked class if specified
  if (checked) {
    listItem.classList.toggle('checked');
  }

  let content;
  if (text !== "") {
    content = document.createTextNode(text);
  } else {
    content = document.createElement("br");
  }

  let textSpan = document.createElement("span");
  textSpan.appendChild(content);
  listItem.appendChild(textSpan);

  // Make the content editable and disable spellcheck
  textSpan.setAttribute("contenteditable", "true");
  textSpan.setAttribute("spellcheck", "false");
  textSpan.classList.add('listText');

  // Append the new list item to the list
  document.getElementById("myUL").appendChild(listItem);

  // Set event listeners for the new list item
  assignListItemEventListeners(listItem);

  // Create and append the close button
  let closeButton = document.createElement("SPAN");
  let closeButtonText = document.createTextNode("\u00D7");
  closeButton.className = "close";
  closeButton.appendChild(closeButtonText);
  listItem.appendChild(closeButton);

  // Set click event listener for the close button
  closeButton.addEventListener('click', function() {
    let listItem = this.parentElement;
    if (listItem.parentElement !== null) {
      listItem.parentElement.removeChild(listItem);
    }
    if (document.getElementById("myUL").getElementsByTagName("li").length == 0) {
      document.getElementById("todoInput").style = "";
    }
    saveTodoList();
  });

  return listItem;
}

// Function: Loads the background information
function loadBackgroundInfo() {
  // Check if background information is available
  if (window.newTab.backgroundInfo != null) {
    let infoChosen = window.newTab.backgroundInfo[window.newTab.infoMode];
    let infoText = "";

    // Generate HTML for each piece of background information
    for (let i = 0; i < infoChosen.length; i++) {
      let fontSize = "";

      // Set the font size based on the specified size
      if (infoChosen[i].size == null) {
        fontSize = "";
      } else if (infoChosen[i].size == "small") {
        fontSize += "calc(6px + .6vw)";
      } else if (infoChosen[i].size == "large") {
        fontSize += "calc(16px + .6vw)";
      } else {
        fontSize += "calc(10px + .6vw)";
      }

      // Construct the HTML for the background information
      infoText += '<span style="' + fontSize + '; white-space: nowrap;"' + '>' + window.newTab.backgroundData[infoChosen[i].name] + '</span><br>';
    }

    // Set the inner HTML of the info element
    document.getElementById('info').innerHTML = infoText;

    // Calculate the position of the info element
    let infoX = document.getElementById("infoWrapper").offsetLeft;
    let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Adjust text alignment and position based on info element's position
    if (infoX > 3 * windowWidth / 4) {
      $('#info').css('text-align', 'right');
      $('#info').css('transform', 'translate(-100%, 0%)');
    } else if (infoX > windowWidth / 4) {
      $('#info').css('text-align', 'center');
      $('#info').css('transform', 'translate(-50%, 0%)');
    } else {
      $('#info').css('text-align', 'left');
      $('#info').css('transform', 'translate(0%, 0%)');
    }
  } else {
    // Hide the info menu item and wrapper if background information is not available
    $('#infoMenuItem').css("display", "none");
    $('#infoWrapper').css("display", "none");
  }
}

// Function: Toggles the display mode of the background information panel
function toggleInfoPanelMode() {
  // Increment the info mode and loop back to the beginning if reaching the end
  window.newTab.infoMode += 1;
  if (window.newTab.infoMode == window.newTab.infoDisplay.length) {
    window.newTab.infoMode = 0;
  }

  // Save the updated info mode to local storage and reload the info panel
  chrome.storage.local.set({
    info_mode: window.newTab.infoMode
  }, function() {
    loadBackgroundInfo();
  });
}

// Function: Toggles UI animation behavior
function toggleUiAnimation() {
  // Toggle the 'noanimate' class for UI elements
  document.getElementById("timeWrapper").classList.toggle('noanimate');
  document.getElementById("todoWrapper").classList.toggle('noanimate');
  document.getElementById("searchWrapper").classList.toggle('noanimate');
  document.getElementById("infoWrapper").classList.toggle('noanimate');
  document.getElementById("menu").classList.toggle('noanimate');
  document.getElementById("rightMenus").classList.toggle('noanimate');
  window.newTab.uiAnimation = !window.newTab.uiAnimation;

  // Update UI animation setting in local storage
  if (window.newTab.uiAnimation) {
    document.getElementById("uianiswitch").checked = true;
    window.newTab.confirmSettings.animation = 'opacity';
    chrome.storage.local.set({
      animation: true
    }, function() {});
  } else {
    document.getElementById("uianiswitch").checked = false;
    window.newTab.confirmSettings.animation = 'none';
    chrome.storage.local.set({
      animation: false
    }, function() {});
  }
}

// Function: Toggles auto pause behavior
function toggleAutoPause() {
  // Toggle auto pause setting
  window.newTab.autoPause = !window.newTab.autoPause;

  // Update auto pause setting in local storage
  if (window.newTab.autoPause) {
    document.getElementById("autopauseswitch").checked = true;
    chrome.storage.local.set({
      autopause: true
    }, function() {});
  } else {
    document.getElementById("autopauseswitch").checked = false;
    chrome.storage.local.set({
      autopause: false
    }, function() {});
  }
}

// Function: Toggles background repeat
function toggleBackgroundRepeat() {
  // Toggle background repeat setting
  window.newTab.avoidRepeat = !window.newTab.avoidRepeat;

  // Update background repeat setting in local storage
  if (window.newTab.avoidRepeat) {
    document.getElementById("repeatswitch").checked = true;
    chrome.storage.local.set({
      repeat: true
    }, function() {});
  } else {
    document.getElementById("repeatswitch").checked = false;
    chrome.storage.local.set({
      repeat: false
    }, function() {});
  }
}

// Function: Loads a random background from the provided JSON data
function loadRandomBackground(backgroundJson) {
  console.log("Loaded background.json:");
  console.log(backgroundJson.sources);
  window.newTab.backgroundList = [];

  // Load the background information panel data
  window.newTab.infoDisplay = backgroundJson.info;
  let infoTitle = ""; // Initialize the info title variable
  if (backgroundJson.info_title) {
    infoTitle = backgroundJson.info_title;
    $('#infoMenuText').text(infoTitle);
    $('#infoMenuItem').attr('data', "Toggles the " + infoTitle);
  }
}


// Function: Sets the background image
function setBackgroundImage() {
  // let videoElement = document.getElementById("backdropvid");
  let imageElement = document.getElementById("backdropimg");
  let backgroundImageUrl = window.newTab.background.link;

  // Console logging for debugging purposes
  console.log("Default background:");
  console.log(backgroundImageUrl);

  let fileExtension = backgroundImageUrl.substring(backgroundImageUrl.length - 3).toLowerCase();
  // if (fileExtension == 'jpg' || fileExtension == 'png' || fileExtension == 'gif') { // If the file type is an image
    window.newTab.background.fileType = "image";
    imageElement.src = backgroundImageUrl;
    imageElement.style = "";
    imageElement.onload = function() {
      imageElement.style.opacity = 100;
      $('#progress-line').css("opacity", "0");
      // To counteract a bug that makes the background start from the bottom
      window.scrollTo(0, 0);
    }
}

// Function: Creates a background menu switch and adds it to the background menu
function createBackgroundMenuSwitch(name, key, bkMenu, index, backList) {
  // Create HTML elements for the menu item, text, and switch
  var menuItemNode = createHTMLElement("<div class=\"menuItem\" data=\"" + "\"></div>");
  var textNode = createHTMLElement("<div class=\"menuText\">" + name + "</div>");
  var switchWrapperNode = createHTMLElement("<div class=\"sliderWrapper\"> <label class=\"switch\"> <input type=\"checkbox\" ID=\"" + key + "\" checked> <span class=\"slider round\"></span> </label> </div>");
  menuItemNode.appendChild(textNode);
  menuItemNode.appendChild(switchWrapperNode);
  bkMenu.insertBefore(menuItemNode, document.getElementById("favoriteSlider"));

  // Adding an onClick event listener for the switches
  document.getElementById(key).parentElement.onclick = function() {
    var switchElement = this.firstElementChild;
    var storageObject = {};
    var switchKey = switchElement.id;
    if (switchElement.checked) {
      switchElement.checked = false;
      storageObject[switchKey] = "off";
      chrome.storage.local.set(storageObject, function() {});
    } else {
      switchElement.checked = true;
      storageObject[switchKey] = "on";
      chrome.storage.local.set(storageObject, function() {});
    }
  }

  // Add source to each element of the list
  let listToPush = backList[index].list;
  for (var i = 0; i < listToPush.length; i++) {
    listToPush[i]["source"] = name;
  }

  // Store and retrieve data from Chrome to determine whether it was on or off
  chrome.storage.local.get(storageObject, function(data) {
    if (data[key] == 'off') {
      document.getElementById(key).checked = false;
    } else {
      window.newTab.backlist.push(...listToPush);
    }
    index += 1;
    loadSource(backList);
  });
}

// Call the function to create and load the background menu switches
loadBackgroundMenuSwitches();


// Function: Load language strings into the UI
function loadLanguageStrings(langJson) {
  window.newTab.langStrings = langJson;
}

// Function: Set the language and load language strings
function setLanguage(lang) {
  return new Promise(function(resolve, reject) {
    const langUrl = chrome.runtime.getURL('locales/' + lang + '.json');
    fetch(langUrl)
      .then((response) => response.json())
      .then((json) => {
        loadLanguageStrings(json);
        resolve(lang);
      });
  });
}

// Function: Get and determine the language to use
function getLanguage(configJson) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get({
      lang: ""
    }, function(data) {
      let lang = navigator.language;

      // Default language (find user locale)
      if (data.lang === "") {
        window.newTab.config = configJson;

        // If navigator.language not found
        if (configJson.locales.indexOf(lang) == -1) {
          // Drop area code
          lang = lang.substring(0, lang.indexOf('-'))
        }

        // If language still not found, default to default locale
        if (configJson.locales.indexOf(lang) == -1) {
          lang = configJson.default_locale;
        }
      } else {
        lang = data.lang;
      }
      setLanguage(lang)
        .then((lang) => resolve(lang));
    });
  });
}

// When the document is ready
$(document).ready(function() {
  // Define custom global objects
  window.newTab = {};
  window.newTab.clock = {};
  window.newTab.confirmSettings = {};
  window.newTab.confirmSettings.animation = 'opacity';

  // Print console warning
  console.log("%c--- Danger Zone ---", "color: red; font-size: 25px");
  console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or \"hack\", it is likely a scam.", "font-size: 16px;");
  console.log("%cIf you ARE a developer, feel free to check this project out here:", "font-size: 16px;");
  console.log("%chttps://github.com/Srixx24/", "font-size: 16px;");

  // $('#progress-line').css("display", "flex");
  const configUrl = chrome.runtime.getURL('resources/config.json');
  fetch(configUrl)
    .then((response) => response.json())
    .then((json) => getLanguage(json))
    .then((lang) => {

      // If Chrome is online
      if (window.navigator.onLine) {
        // Load the background JSON
        const jsonUrl = chrome.runtime.getURL('resources/background_' + lang + '.json');
        fetch(jsonUrl)
          .then((response) => response.json())
          .then((json) => loadBackground(json));

      } else {
        // Send an error alert for no internet connection
        $.alert({
          title: 'Error',
          content: 'No internet access. Please check your connection and try again.',
          type: 'red',
          boxWidth: '25%',
          backgroundDismiss: true,
          useBootstrap: false,
          typeAnimated: true,
          theme: 'dark',
          animation: window.newTab.confirmSettings.animation,
          closeAnimation: window.newTab.confirmSettings.animation,
          animateFromElement: false,
          scrollToPreviousElement: false,
          buttons: {
            close: {
              text: "Close",
              action: function() {
                $('#progress-line').css("opacity", "0");
              }
            }
          }
        });
      }
    });
});

// Define the list of search engines
window.newTab.searchEngines = [
  {
    "action": "https://www.google.com/search",
    "placeholder": "Google Search"
  },
  {
    "action": "https://www.bing.com/search",
    "placeholder": "Bing Search"
  },
  {
    "action": "https://search.yahoo.com/search",
    "placeholder": "Yahoo Search"
  }
];


// Prevent right-click context menu
// document.addEventListener('contextmenu', event => event.preventDefault());

// Initialize default time settings
window.newTab.clock.military = false;

// Make elements draggable
dragElement(document.getElementById("timeWrapper"));
dragElement(document.getElementById("searchWrapper"));
dragElement(document.getElementById("todoWrapper"));
dragElement(document.getElementById('infoWrapper'));

// Load data/settings from Chrome storage

// Load clock settings
chrome.storage.local.get({
  time_switch: 'on',
  time_top_data: '',
  time_left_data: '',
  military_switch: 'off'
}, function(data) {
  // Check clock settings and apply
  if (data.time_switch == 'off') {
    document.getElementById("timeSwitch").checked = false;
    document.getElementById("timeWrapper").classList.add("exit");
    document.getElementById("timeWrapper").classList.add("firstStart");
  } else {
    document.getElementById("timeSwitch").checked = true;
    document.getElementById("timeWrapper").classList.add("entrance");
  }
  // Set clock position
  if (data.time_top_data != '') {
    document.getElementById("timeWrapper").style.top = data.time_top_data;
  }
  if (data.time_left_data != '') {
    document.getElementById("timeWrapper").style.left = data.time_left_data;
  }
  // Set military time format
  window.newTab.clock.military = (data.military_switch == 'on');

  // Start the clock
  startTime();
});


 //getting the searchbar settings
  chrome.storage.local.get({
    search_switch: 'on',
    search_top_data: '',
    search_left_data: '',
    search_engine: 0
  }, function(data) {
    if (data.search_switch == 'off') {
      document.getElementById("searchSwitch").checked = false;
      document.getElementById("searchWrapper").classList.add("exit");
      document.getElementById("searchWrapper").classList.add("firstStart");
    } else {
      document.getElementById("searchSwitch").checked = true;
      document.getElementById("searchWrapper").classList.add("entrance");
    }
    if (data.search_top_data != '') {
      document.getElementById("searchWrapper").style.top = data.search_top_data;
    }
    if (data.search_left_data != '') {
      document.getElementById("searchWrapper").style.left = data.search_left_data;
    }

    let searchInput = $('#searchInput');
    searchInput.parent().attr('action', window.newTab.searchEngines[data.search_engine].action);
    searchInput.attr('data-placeholder', window.newTab.searchEngines[data.search_engine].placeholder);
    searchInput.val(window.newTab.searchEngines[data.search_engine].placeholder);
  });


  //load the background filters
  chrome.storage.local.get({
    filter: [35, 90, 100, 0]
  }, function(data) {
    document.getElementById("darkSlider").value = data.filter[0];
    document.getElementById("satuSlider").value = data.filter[1];
    document.getElementById("conSlider").value = data.filter[2];
    document.getElementById("blurSlider").value = data.filter[3];
    updateFilter();
  });


// Load todo list data from Chrome storage and parse it
chrome.storage.local.get({
  todo_switch: 'on',
  todo_top_data: '',
  todo_left_data: '',
  todo_data: ''
}, function(data) {
  // Check todo list settings and apply
  if (data.todo_switch == 'off') {
    document.getElementById("todoSwitch").checked = false;
    document.getElementById("todoWrapper").classList.add("exit");
    document.getElementById("todoWrapper").classList.add("firstStart");
  } else {
    document.getElementById("todoSwitch").checked = true;
    document.getElementById("todoWrapper").classList.add("entrance");
  }
  // Set todo list position
  if (data.todo_top_data != '') {
    document.getElementById("todoWrapper").style.top = data.todo_top_data;
  }
  if (data.todo_left_data != '') {
    document.getElementById("todoWrapper").style.left = data.todo_left_data;
  }
  // Parse todo list data and populate
  if (data.todo_data != '') {
    let arr = data.todo_data.split("×");
    for (i = 0; i < arr.length - 1; i++) {
      let li;
      if (arr[i].indexOf("☑") != -1) {
        li = newListItem(String(arr[i]).slice(1), true); // Create list item with checkbox checked
      } else {
        li = newListItem(arr[i], false); // Create list item with checkbox unchecked
      }
      document.getElementById("myUL").appendChild(li);
    }
  } else {
    document.getElementById("todoInput").style = ""; // Show todo input if no data
  }
});


// Add event listeners for switches
document.getElementById("searchSwitch").parentElement.addEventListener('click', function() {
  updateSearch(); // Update search settings
});
document.getElementById("searchChange").addEventListener("click", function() {
  changeSearch(); // Change search engine
});
document.getElementById("timeSwitch").parentElement.addEventListener('click', function() {
  updateTime(); // Update time settings
});
document.getElementById("infoSwitch").parentElement.addEventListener('click', function() {
  updateinfo(); // Update info settings
});
document.getElementById("info").addEventListener("click", function() {
  updateInfoMode(); // Update info mode
});
document.getElementById("favSwitch").parentElement.addEventListener('click', function() {
  updateFav(); // Update favorite settings
});
document.getElementById("todoSwitch").parentElement.addEventListener('click', function() {
  updateTodo(); // Update todo settings
});
document.getElementById("time").addEventListener("click", function() {
  updateMilitary(); // Update military time
});

// Add event listeners for filter sliders
document.getElementById("darkSlider").addEventListener("input", function() {
  updateFilter(); // Update dark filter
});
document.getElementById("satuSlider").addEventListener("input", function() {
  updateFilter(); // Update saturation filter
});
document.getElementById("conSlider").addEventListener("input", function() {
  updateFilter(); // Update contrast filter
});
document.getElementById("blurSlider").addEventListener("input", function() {
  updateFilter(); // Update blur filter
});

// Window focus and blur listeners
chrome.tabs.onActivated.addListener(autoPause); // Automatically pause on window blur

// Make the todo list sortable
$("#myUL").sortable({
  start: function() {
    document.activeElement.blur(); // Remove focus from active element
    document.getElementById("myUL").style = "cursor: -webkit-grabbing !important; cursor: grabbing !important;"; // Change cursor style
  },
  update: function() {
    saveTodo(); // Save todo list changes
  },
  stop: function() {
    document.getElementById("myUL").style = ""; // Reset cursor style
  }
});

// Set placeholders for input elements
let inputs = [];
inputs.push(document.getElementById("todoInput"));
inputs.push(document.getElementById("searchInput"));
for (let i = 0; i < inputs.length; i++) {
  inputs[i].value = inputs[i].getAttribute('data-placeholder'); // Set initial value as placeholder
  inputs[i].addEventListener('focus', function() {
    if (this.value == this.getAttribute('data-placeholder')) {
      this.value = ''; // Clear placeholder value on focus
    }
  });
  inputs[i].addEventListener('blur', function() {
    if (this.value == '') {
      this.value = this.getAttribute('data-placeholder'); // Restore placeholder value on blur if empty
    }
  });
}


// Event listener for adding todo items when Enter key is pressed
$(".todoInput").on('keyup', function(e) {
  if (e.keyCode == 13) { // Check if Enter key is pressed
    let inputValue = document.getElementById("todoInput").value.trim(); // Get input value
    if (inputValue != '') { // Check if input value is not empty
      let li = newListItem(inputValue, false); // Create new todo list item
      document.getElementById("todoInput").value = ""; // Clear input value
      document.getElementById("todoInput").style = "display: none;"; // Hide input element
      document.getElementById("myUL").appendChild(li); // Append new list item to todo list
      setEndOfContenteditable(li); // Set focus at the end of list item
      li.focus(); // Focus on new list item
      saveTodo(); // Save todo list
    }
  }
});
