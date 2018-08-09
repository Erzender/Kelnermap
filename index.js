var app = new Vue({
  el: "#app",
  data: {
    route: "map.html",
    navBar: [{name: "Map", route: "map.html"}, {name: "Empires", route: "empires.html"}]
  },
  computed: {
  },
  methods: {
    setRoute: function(route) {
      this.route = route
    }
  }
});
