var app = new Vue({
  el: "#app",
  data: {
    navBar: [
      "Map", "Nations"
    ],
    route: "Map",
    navNation: "L'Empire",
    nav: {
      nationPanel: "desc",
      mapEdit: false
    },
    descEdit: "",
    search: {
      x: 0,
      z: 0
    },
    control: [],
    soutiens: [],
    mouseMap: {
      left: 0,
      top: 0
    },
    map: Array().fill(40),
    area: {
      color: "transparent",
      name: "???",
      player: "aucun"
    },
    grid: false,
    displayControl: true,
    mapEdition: [],
    message: "",
    descriptions: [],
    editSoutiens: {
      list: []
    }
  },
  computed: {
    colors: function() {
      var colors = this.map.map(x => {
        return this.map.map(z => {
          if (this.area.x === x && this.area.z === z) {
            return "white";
          }
          return "transparent";
        });
      });
      for (area of this.mapEdition) {
        if (colors[area.x] && colors[area.x][area.z]) {
          colors[area.x][area.z] = colors[area.x][area.z] === "white" ? "white" : '#FFFF00'
        }
      }
      for (empire of this.control) {
        for (area of empire.areas) {
          if (colors[area.x] && colors[area.x][area.z]) {
            colors[area.x][area.z] = colors[area.x][area.z] === "white" || colors[area.x][area.z] === "#FFFF00"
              ? colors[area.x][area.z]
              : this.displayControl
                ? empire.color
                : "transparent";
          }
        }
      }
      return colors;
    },
    nation: function() {
      var res = this.control.find(nation => nation.name === this.navNation);
      var soutiens = [];
      for (soutien of this.soutiens) {
        var rank = soutien.soutiens.findIndex(elem => elem === res.player);
        if (rank >= 0) {
          soutiens.push({
            name: soutien.player,
            rank: rank + 1
          });
        }
      }
      return {
        ...res,
        description: res && res.desc && this.descriptions
          ? this.descriptions.find(function(desc) {
            return desc.area === res.desc
          }).text
          : "",
        soutiens: soutiens
      };
    },
    border: function() {
      return this.grid
        ? "1px"
        : "0px";
    },
    nations: function() {
      return this.control.map(nation => {
        var cpt = 0;
        for (soutien of this.soutiens) {
          if (soutien.soutiens.find(elem => elem === nation.player)) {
            cpt += 1;
          }
        }
        return {
          ...nation,
          soutiens: cpt
        };
      }).sort((a, b) => a.soutiens < b.soutiens);
    },
    textMapEdit: function() {
      return ("```" + JSON.stringify(this.mapEdition.map(area => {
        return {x: area.x, z: area.z};
      })) + "```");
    }
  },
  methods: {
    setRoute: function(route) {
      this.route = route;
    },
    setNavNation: function(nation) {
      this.route = "Nation";
      this.navNation = nation;
      this.nav.nationPanel = "desc";
    },
    navNationPanel: function(panel) {
      if (panel === "descEdit") {
        if (this.nav.nationPanel === "descEdit") {
          saveData(this.descEdit, "desc.md")
        }
        this.descEdit = this.nation.description
      }
      this.nav.nationPanel = panel;
    },
    searchArea: methodsMap.searchArea,
    toggleGrid: methodsMap.toggleGrid,
    toggleControl: methodsMap.toggleControl,
    getArea: methodsMap.getArea,
    getColor: methodsMap.getColor,
    updateArea: methodsMap.updateArea,
    updateMouseMap: methodsMap.updateMouseMap,
    toggleEdit: methodsMap.toggleEdit
  },
  mounted: function() {
    fetch("data").then(function(response) {
      response.json().then(function(json) {
        this.control = json;
        for (nation of this.control) {
          if (nation.desc !== undefined) {
            fetch("descriptions/" + nation.desc + ".md").then(function(res) {
              res.text().then(function(text) {
                this.vue.descriptions.push({area: this.nation.desc, text: text})
              }.bind(this))
            }.bind({nation: nation, vue: this}))
          }
        }
      }.bind(this));
    }.bind(this));
    fetch("soutiens.json").then(function(response) {
      response.json().then(function(json) {
        this.soutiens = json;
      }.bind(this));
    }.bind(this));
  }
});
