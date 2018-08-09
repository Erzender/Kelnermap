var app = new Vue({
  el: "#app",
  data: {
    navBar: ["Map", "Nations"],
    route: "Map",
    search: { x: 0, z: 0 },
    control: [],
    mouseMap: { left: 0, top: 0 },
    map: Array().fill(40),
    area: { color: "transparent", name: "???", leader: "aucun" },
    grid: true,
    displayControl: true
  },
  computed: {
    border: function() {
      return this.grid ? "1px" : "0px";
    }
  },
  methods: {
    setRoute: function(route) {
      this.route = route
    },
    searchArea: methodsMap.searchArea,
    toggleGrid: methodsMap.toggleGrid,
    toggleControl: methodsMap.toggleControl,
    getArea: methodsMap.getArea,
    getColor: methodsMap.getColor,
    updateArea: methodsMap.updateArea,
    updateMouseMap: methodsMap.updateMouseMap
  },
  mounted: function() {
    fetch("data.json").then(
      function(response) {
        response.json().then(
          function(json) {
            this.control = json;
          }.bind(this)
        );
      }.bind(this)
    );
  }
});
