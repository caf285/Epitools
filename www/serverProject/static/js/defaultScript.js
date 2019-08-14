function main() {
  let sideWindow = document.getElementById("sideWindow")
  let sideContent = document.getElementById("sideContent")

  if (sideContent.innerHTML.replace(/\s+/g, '') == "") {
    sideWindow.style.visibility = "hidden"
  } else {
    sideWindow.classList.add("toggle")
  }

  document.getElementById("sideButton").addEventListener('click', function(e) {
    if (sideWindow.classList.contains("toggle")) {
      sideWindow.classList.remove("toggle");
    } else {
      sideWindow.classList.add("toggle")
    }
  });

  function getYear() {
    var d = new Date();
    var n = d.getFullYear();
    document.getElementById("cr").innerHTML = n + document.getElementById("cr").innerHTML;
  }
 
  function redirect(timeout, loc) {
    setTimeout(function(){ window.location.href = loc; }, timeout);
  }

  getYear();
}

function proper(text) {
  if (typeof text == 'string') {
    return text.split(" ").map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(" ")
  } else {
    return ""
  }
}
