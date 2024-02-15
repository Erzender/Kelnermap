<script setup>
import { ref } from "vue";

const cur = ref(0);
let url = new URL(location.href);
fetch("http://localhost:8081/auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ token: url.searchParams.get("token") })
}).then((res) => res.json().then((data) => console.log(data)));
window.history.pushState({}, document.title, "/");
</script>

<template>
  <div>hello</div>
</template>
