<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  methods:{
    
  }

};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  widows: 100%;
  height: 100%;
}
.ke-container{
  width: 400px !important;
}
.video-player {
  width: 500px;
}

.clearfix:after {
   content:""; 
   display: block; 
   clear:both; 
}
ul li {
  list-style: none;
  padding: 0px;
  margin: 0px;
}
a{
  text-decoration: none;
  color: #606266;
}
</style>
