function getYear() {
    var d = new Date();
    var n = d.getFullYear();
    document.getElementById("cr").innerHTML = n + document.getElementById("cr").innerHTML;
}

function main() {
  getYear();
}

function redirect(timeout, loc) {
  setTimeout(function(){ window.location.href = loc; }, timeout);
}
