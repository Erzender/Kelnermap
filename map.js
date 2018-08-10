var app = new Vue({
  el: "#app",
  data: {
    navBar: ["Map", "Nations"],
    route: "Map",
    navNation: "L'Empire",
    nav : {
      nationPanel: 'desc'
    },
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
    nation: function() {
      var res = this.control.find(nation => nation.name === this.navNation)
      var soutiens = []
      for (soutien of this.soutiens) {
        var rank = soutien.soutiens.findIndex((elem) => elem === res.leader)
        if (rank >= 0) {
          soutiens.push({name: soutien.player, rank: rank + 1})
        }
      }
      return {...res, description: markdown.toHTML(res?res.description:""), soutiens: soutiens}
    },
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
    setNavNation: function(nation) {
      this.route = "Nation"
      this.navNation = nation
      this.nav.nationPanel = "desc"
    },
    navNationPanel: function(panel) {
      this.nav.nationPanel = panel
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
