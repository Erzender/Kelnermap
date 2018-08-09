var app = new Vue({
  el: "#app",
  data: {
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
    searchArea: function(x, z, event) {
      if (event) event.preventDefault();
      var supx = Math.round((x / 512 + 7) / 33 * 40);
      var supz = Math.round((z / 512 + 11) / 33 * 40);
      this.mouseMap = { left: Math.round(x), top: Math.round(z) };
      this.updateArea(supx, supz);
    },
    toggleGrid: function() {
      this.grid = !this.grid;
    },
    toggleControl: function() {
      this.displayControl = !this.displayControl;
    },
    getArea: function(x, z) {
      for (empire of this.control) {
        for (area of empire.areas) {
          if (area.x === x && area.z === z) {
            return {
              color: empire.color,
              name: empire.name,
              leader: empire.leader,
              x: x,
              z: z
            };
          }
        }
      }
      return { color: "transparent", name: "???", leader: "aucun", x: x, z: z };
    },
    getColor: function(x, z) {
      if (!this.displayControl) {
        return "transparent";
      }
      if (this.area.x === x && this.area.z === z) {
        return "white";
      }
      for (empire of this.control) {
        var color = empire.color;
        for (area of empire.areas) {
          if (area.x === x && area.z === z) {
            return color;
          }
        }
      }
      return "transparent";
    },
    updateArea: function(x, z) {
      this.area = this.getArea(x, z);
    },
    updateMouseMap: function(e) {
      var offset = {
        left:
          document.getElementById("map").offsetLeft -
          document.getElementById("mapCnt").scrollLeft,
        top:
          document.getElementById("map").offsetTop -
          document.getElementById("mapCnt").scrollTop,
        width: document.getElementById("map").offsetWidth,
        height: document.getElementById("map").offsetHeight
      };
      this.mouseMap = {
        left: Math.round(
          ((e.pageX - offset.left) / offset.width * 33 - 7) * 512
        ),
        top: Math.round(
          ((e.pageY - offset.top) / offset.height * 33 - 11) * 512
        )
      };
    }
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
