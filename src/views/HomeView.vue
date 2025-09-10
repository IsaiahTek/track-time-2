<script setup lang="ts">
import { ref } from "vue";
import Calendar from './CalendarView.vue';
import SettingsView from "./SettingsView.vue";
import TimerSetup from "./TimerSetup.vue";
import { useSettingsStore } from "../stores/settings";

import { invoke } from '@tauri-apps/api/core';
// import {  } from '@tauri-apps/api/window';

function toSentenceCase(text:String){
  return text.split('').map((val, index)=>(index==0)?val.toUpperCase():val).join('');
}
type Page = 'alarm' | 'calendar' | 'settings';
const tabs:Page[] = ['alarm', 'calendar', 'settings'];
const currentTab = ref<Page>('alarm');

// function showAlertEveryTwoSeconds(){
//   console.log("SHOWING ALERT NOW");
//   setInterval(()=>useSettingsStore().sendDefaultNotification(), 1000);
// }
async function openWindowPicker(){
  // await Window.ready(); // Ensure the window is ready before invoking the backend
  // setInterval(async()=>{
    try {
      const windowMetadata:Array<{name:String, exec: String}> = await invoke('get_all_apps');
      console.log("All installed apps:", windowMetadata);
    } catch (error) {
      console.error("Error selecting window:", error);
    }

  // }, 1000)
}

async function pollForActiveWindow(){
  setInterval(async()=>{
    const activeWindow = await invoke('select_window');
    console.log("ACTIVE WINDOW: ", activeWindow);
  }, 1000)
}

</script>

<template>
  <section class="flex">
    <header>
      <div class="wrapper">
        <nav>
          <div class="m-b-5">
            <button @click="useSettingsStore().toggleUseDefaultTheme">{{ useSettingsStore().themeName }}</button>
            <button @click="openWindowPicker()">Select Window</button>
            <button @click="pollForActiveWindow()">Monitor</button>
          </div>
          <div :key="`${tab}-${index}`" @click="()=>{currentTab = tab}" v-for="(tab, index) in tabs" class="link" :class="currentTab==tab?'active':null">
            <span>{{toSentenceCase(tab)}}</span>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <section v-if="currentTab=='alarm'" class="main-body">
        <TimerSetup />
      </section>
      <section v-if="currentTab=='calendar'" class="main-body">
        <Calendar />
      </section>
      <section v-if="currentTab=='settings'" class="main-body">
        <SettingsView />
      </section>
    </main>
  </section>
</template>

<style scoped>
section.flex{
  display: flex;
  min-height: 100vh;
  max-width: 100%;
  flex-wrap: wrap;
}
header{
  background-color: color-mix(in srgb, var(--background-color) 90%, black 10%);
  width: 20%;
  color: var(--text-color);
  /* z-index: 0; */
}
header nav{
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  margin-top: 20px;
}
nav div.link{
  padding: 10px 30px;
  background-color: color-mix(in srgb, var(--background-color) 75%, black 25%);
  margin-bottom: 10px;
  margin-right: 20px;
}
nav div.link.active{
  margin-right: 0px;
}
nav div.link:hover{
  cursor: pointer;
  box-shadow:  rgb(235, 235, 235) -5px 1px 5px;
}
main{
  background-color: color-mix(in srgb, var(--background-color) 60%, black 10%);
  /* overflow-wrap: break-word;
  word-wrap:break-word;
  word-break: break-all;
  text-wrap: wrap; */
  width: 80%;
}
main .main-body{
  padding: 20px;
  /* background-color: red; */
}
button{
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
}

</style>
