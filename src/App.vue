<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSettingsStore } from './stores/settings';
import { ref, watch } from 'vue';

const useDarkTheme = ref<boolean>(false);
useDarkTheme.value = useSettingsStore().useDarkTheme;

// window.document.pr

watch(useSettingsStore(), ()=>{
  console.log(useDarkTheme.value, useSettingsStore().useDarkTheme)
  useDarkTheme.value = useSettingsStore().useDarkTheme;
});



</script>

<template>  
  <RouterView :class="useDarkTheme? 'dark-theme': 'light-theme'" />
</template>

<style>
/* Light theme */
:root {
  --background-color: rgb(247, 249, 250);
  --text-color: #000000;
  --dark-color: #010722;
  --primary-color:blue;
  --light-color: rgb(247, 249, 250);
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: var(--dark-color);
    --text-color: var(--light-color);
  }
}

@media (prefers-color-sheme: light){
  :root {
    --background-color: var(--light-color);
    --text-color: var(--dark-color);
  }
}

.dark-theme{
  background-color: var(--dark-color);
  color: var(--light-color);
}

.light-theme{
  background-color: var(--light-color);
  color: var(--dark-color);
}

.theme {
  background-color: var(--background-color);
  color: var(--text-color);
}

input{
  width: 60px;
  height: 30px;
  text-align: center;
  outline: unset;
  border: 1px solid gainsboro;
  border-radius: 5px
}

button, .btn{
  cursor: pointer;
  text-align: center;
  background-color: var(--primary-color);
  color: white;
}
button.disabled{
  cursor: not-allowed;
}
button.f-w, .btn.f-w{
  width: 100%;
  text-align: center
}
button:hover{
  background-color: color-mix(
    in srgb,
    var(--primary-color) 80%,
    black 20%
  );
  color: color-mix(
    in srgb,
    var(--primary-color) 5%,
    white 90%
  );
}

body{
  /* background-color: var(--background-color); */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
.t-center{
  text-align: center;
}
.f-row{
  display: flex;
  flex-direction: row;
}
.f-col{
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: space-between;
}

.f-a-c-c{
  align-items: center;
}
.f-j-c-c{justify-content: center;}
.f-j-c-s-b{
  justify-content: space-between;
}
.f-w-2{width: 20%;}
.f-w-3{width: 30%;}
.f-w-4{width: 40%;}
.f-w-5{width: 50%;}
.f-w-6{width: 60%;}
.f-w-7{width: 70%;}
.f-w-8{width: 80%;}

.m-l-5{margin-left: 5ch;}
.m-b-5{margin-bottom: 5ch;}

.card{
    display: block;
    border-radius:5px;
    padding: 20px;
    background-color: color-mix(in srgb, var(--background-color) 50%, white 50%);
    margin-bottom: 20px;
    margin-top: 10px;
}
.outlined{border: 1px solid gainsboro;}
.elevated{
  box-shadow: 1px 2px 2px gainsboro;
}
.elevated:hover{
  box-shadow: 1px 2px 20px gainsboro;
}
.t-bold{
  font-weight: 550;
  font-size: larger;
}
.t-blue{color:blue}
.t-red{color:red}
.bg-none{background-color: transparent; color: var(--primary-color);}
.f-h{height: 100%;}
</style>
