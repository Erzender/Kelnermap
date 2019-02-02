var app = new Vue({
  el: "#app",
  data: {
    pic: ""
  },
  methods: {},
  created: function() {
    this.pic = document.getElementById("formPicture").value;
  }
});
