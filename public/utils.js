Array.prototype.fill = function(n, v) {
  n = n || this.length;
  for (var i = 0; i < n; i++) this[i] = v === void 0 ? i : v;
  return this;
};

var saveData = (function() {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function(data, fileName) {
    (blob = new Blob([data], { type: "text/plain;charset=utf-8" })),
      (url = window.URL.createObjectURL(blob));
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();
