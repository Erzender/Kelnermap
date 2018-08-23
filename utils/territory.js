exports.freeTerritoryChecker = function(toCheck, nations) {
  for (area of toCheck) {
    for (nation of nations) {
      if (nation.areas.find(area, function(a, b) { return a.x === b.x && a.z === b.z })) {
        return false
      }
    }
  }
  return true
}
