Array.prototype.fill = function(n, v) {
  n = n || this.length;
  for (var i = 0; i < n; i++) this[i] = v === void 0 ? i : v;
  return this;
};
