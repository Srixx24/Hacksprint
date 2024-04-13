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

  // Depending on the type of widget, set the appropriate mousedown event listener
  if (widgetElement.id == "timeWidget")
    document.getElementById("time").onmousedown = startDrag;
  if (widgetElement.id == "searchWidget")
    document.getElementById("searchDiv").onmousedown = startDrag;
  if (widgetElement.id == "todoWidget")
    document.getElementById("todoDiv").onmousedown = startDrag;
  if (widgetElement.id == "infoWidget")
    document.getElementById("info").onmousedown = startDrag;


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

  // Make the content editable and spellcheck
  textSpan.setAttribute("contenteditable", "true");
  textSpan.setAttribute("spellcheck", "true");
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
  loadBackgroundMenuSwitches();
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
];

// Initialize default time settings
window.newTab.clock.military = false;

// Make elements draggable
dragElement(document.getElementById("timeWrapper"));
dragElement(document.getElementById("searchWrapper"));
dragElement(document.getElementById('infoWrapper'));

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
};

// Add event listeners for switches
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
