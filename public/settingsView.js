var app = new Vue({
  el: "#app",
  data: {
      pic: "",
      desc: ""
  },
  methods: {},
  created: function() {
    this.pic = document.getElementById("formPicture").value;
    this.desc = document.getElementById("formDesc").value;
  }
});
