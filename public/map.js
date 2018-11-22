var app = new Vue({
  el: "#app",
  data: {
    navBar: [
      "Map", "Nations", "Options"
    ],
    route: "Map",
    navNation: "L'Empire",
    nav: {
      nationPanel: "desc",
      mapEdit: false
    },
    search: {x: 0, z: 0},
    control: [],
    mouseMap: {left: 0, top: 0},
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
    settings: {
      message: "",
      selectedPlayer: 0,
      name: "",
      soutiens: [],
      toAddSoutien: 0,
      color: "#FF00FF",
      desc:"",
      nationName: "",
      image: "https://s1.qwant.com/thumbr/0x0/2/f/07b6960b07cf13295400fe43e0c2822a5effc4b4591c082a964b8505ed79e9/33505.jpg?u=http%3A%2F%2Femblemsbf.com%2Fimg%2F33505.jpg&q=0&b=1&p=0&a=1"
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
      var res = this.control.find(nation => nation.id === this.navNation);
      var soutiens = [];
      for (candidate of this.control) {
        var rank = candidate.soutiens.findIndex(elem => elem === res.id);
        if (rank >= 0) {
          soutiens.push({
            image: candidate.image || "https://s1.qwant.com/thumbr/0x0/2/f/07b6960b07cf13295400fe43e0c2822a5effc4b4591c082a964b8505ed79e9/33505.jpg?u=http%3A%2F%2Femblemsbf.com%2Fimg%2F33505.jpg&q=0&b=1&p=0&a=1",
            name: candidate.player,
            rank: rank + 1
          });
        }
      }
      return {
        ...res,
        desc: res && res.desc !== undefined && res.desc !== null? res.desc
        : "",
        soutiens: soutiens.sort((a, b) => a.rank > b.rank)
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
        var cptHab = 0;
        for (candidate of this.control) {
          if (candidate.soutiens[0] === nation.id) {
            cptHab += 1
          }
          for (soutien of candidate.soutiens) {
            if (soutien === nation.id) {
              cpt+=1
              break
            }
          }
        }
        return {
          ...nation,
          inhabitants: cptHab,
          soutiens: cpt
        };
      }).sort((a, b) => a.inhabitants < b.inhabitants);
    },
    textMapEdit: function() {
      return ("```" + JSON.stringify(this.mapEdition.map(area => {
        return {x: area.x, z: area.z};
      })) + "```");
    },
    settingsCalc: function() {
      var ret = {
        nation: this.settings.soutiens.length<=0?"Aucune":this.settings.soutiens[0].nation
      }
      return ret
    }
  },
  methods: {
    settingsSave: function() {
      console.log(this.settings.desc);
      fetch("request/player", {
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "body": JSON.stringify({
          name: this.settings.name || "",
          soutiens: this.settings.soutiens.map(soutien => soutien.id) || [],
          color: this.settings.color || "#333333",
          desc: this.settings.desc || "",
          image: this.settings.image || "",
          nationName: this.settings.nationName || ""
        })
      }).then(function(response) {
        response.json().then(function(json) {
          console.log(json);
          this.settings.message = "ℹ La requête a été enregistré, recopier le numéro de commande dans #territoires pour valider : " + json.id
        }.bind(this));
      }.bind(this)).catch(err => {
        console.log(err);
      });
    },
    settingsPlayerChange: function () {
      var player = this.control.find(elem => elem.id === this.settings.selectedPlayer)
      this.settings.name = player?player.player:""
      this.settings.soutiens = player?player.soutiens.map(soutien => {
        var soutienP = this.control.find(elem => "" + elem.id === soutien)
        return {id: soutien, name: soutienP?soutienP.player:"unknown", nation: soutienP?soutienP.name:"Aucune"}
      }):[]
      this.settings.nationName = !player?"":player.name
      this.settings.color = !player?"#FF00FF":player.color
      this.settings.toAddSoutien = ""
      this.settings.desc = !player||player.desc===undefined?"":player.desc
      this.settings.image = !player||!player.image?"https://s1.qwant.com/thumbr/0x0/2/f/07b6960b07cf13295400fe43e0c2822a5effc4b4591c082a964b8505ed79e9/33505.jpg?u=http%3A%2F%2Femblemsbf.com%2Fimg%2F33505.jpg&q=0&b=1&p=0&a=1":player.image
    },
    settingsSoutienAdd: function(event) {
      event.preventDefault()
      var soutienP = this.control.find(elem => "" + elem.id === this.settings.toAddSoutien)
      this.settings.soutiens.push({id: this.settings.toAddSoutien, name: soutienP?soutienP.player:"", nation: soutienP?soutienP.name:"Aucune"})
    },
    settingsEditSoutien: function(event, option, id) {
      event.preventDefault()
      switch (option) {
        case "up":
        array_move(this.settings.soutiens, id, id - 1)
        break;
        case "del":
        this.settings.soutiens.splice(id, 1)
        break;
        default:
      }
    },
    setRoute: function(route) {
      this.route = route;
      if (route === "Options") {
        this.settings.message = ""
      }
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
      }.bind(this));
    }.bind(this));
  }
});
