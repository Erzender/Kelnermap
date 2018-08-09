var app = new Vue({
  el: "#app",
  data: {
    navBar: ["Map", "Nations"],
    route: "Nations",
    search: { x: 0, z: 0 },
    control: [],
    soutiens: [],
    mouseMap: { left: 0, top: 0 },
    map: Array().fill(40),
    area: { color: "transparent", name: "???", leader: "aucun" },
    grid: true,
    displayControl: true
  },
  computed: {
    border: function() {
      return this.grid ? "1px" : "0px";
    },
    nations: function() {
      return this.control.map(nation => {
        var cpt = 0;
        for (soutien of this.soutiens) {
          if (soutien.soutiens.find((elem) => elem === nation.leader)) {
            cpt += 1;
          }
        }
        return {...nation, soutiens: cpt}
      });
    }
  },
  methods: {
    setRoute: function(route) {
      this.route = route;
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
    fetch("soutiens.json").then(
      function(response) {
        response.json().then(
          function(json) {
            this.soutiens = json;
          }.bind(this)
        );
      }.bind(this)
    );
  }
});
