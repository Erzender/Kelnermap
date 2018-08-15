methodsMap = {
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
  updateArea: function(x, z, click) {
    if (click && this.nav.mapEdit) {
      var area = this.mapEdition.findIndex(elem => {return elem.x === x && elem.z===z})
      console.log(area);
      if (area >= 0) {
        this.mapEdition.splice(area, 1)
      }
      else {
        this.mapEdition.push(this.getArea(x, z));
      }
    }
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
      left: Math.round(((e.pageX - offset.left) / offset.width * 33 - 7) * 512),
      top: Math.round(((e.pageY - offset.top) / offset.height * 33 - 11) * 512)
    };
  },
  toggleEdit: function() {
    if (this.nav.mapEdit) {
      var copyText = document.getElementById("mapEditInput");
      copyText.select();
      document.execCommand("copy");
      this.message = "🌐 La liste des régions a été copiée dans le presse-papier, collez-là dans #territoires pour déclarer votre territoire 🌐"
      this.mapEdition = [];
    }
    else {
      this.message = ""
    }
    this.nav.mapEdit = !this.nav.mapEdit;
  }
};