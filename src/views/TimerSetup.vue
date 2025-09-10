<script setup lang="ts">

// import { Duration } from "@/models/duration";
import { Duration as DurationModel } from "../models/duration";
// import { invoke } from "@tauri-apps/api/core";
// import { Webview } from "@tauri-apps/api/webview";
// import { Window } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ref } from "vue";

const allWindows = ref<{id:String, window:WebviewWindow}[]>([])

function createWindow(id:string, duration:Duration){
  const url = `/countdown/${JSON.stringify(duration)}`;
  const label = `Countdown Timer ${allWindows.value.length + 1}`;
  const window = new WebviewWindow(id, {
    title:label,
    width:300,
    height:100,
    url:url,
    x: 0,
    alwaysOnTop:true,
    y:allWindows.value.length != 1 ? allWindows.value.length *150 : allWindows.value.length * 180,
    visible:false,
  });
  window.once('tauri://created', function () {
    allWindows.value?.push({id: label, window: window});
    window.show();
  });
  window.once('tauri://error', function () {
    window.setFocus();
  });
  window.once('tauri://destroyed', ()=>{
    allWindows.value = allWindows.value.filter((wind)=>wind.id != label);
  });
  
}

const duration = ref<Duration>({hours:0, minutes:0, seconds:0});

function openFloatingWindow(presetDuration:Duration|null = null){
  // let durationToString = JSON.stringify(presetDuration??duration.value);
  if(presetDuration != null){
    createWindow(new DurationModel(presetDuration).toMilliseconds().toString(), presetDuration)
  }else{
    createWindow(new DurationModel(duration.value).toMilliseconds().toString(), duration.value)
    // invoke('show_floating_window', {duration:durationToString}).catch(err => console.error("Failed to invoke show_floating_window:", err));
  }
}

type Pomo = {duration:Duration, break:Duration}

const pomos: Pomo[] = [
  {duration: {minutes:5}, break:{seconds:5}},
  {duration: {minutes:10}, break:{seconds:5}},
  {duration: {minutes:15}, break:{seconds:5}},
  {duration: {minutes:20}, break:{seconds:5}},
  {duration: {minutes:25}, break:{seconds:5}},
  {duration: {minutes:30}, break:{seconds:5}},
  // {duration: {minutes:35}, break:{seconds:5}},
  {duration: {minutes:45}, break:{seconds:5}},
  {duration: {hours:1}, break:{seconds:5}},
]
</script>

<template>
    <div>
      <h1>Set Alarm</h1>
    </div>
    <section class="f-row">
      <div class="card elevated f-w-3">
        <div class="duration-box f-j-c-s-b">
          <div class="input-controller">
            <label for="hour">Hr</label>
            <input name="hour" v-model="duration.hours" placeholder="hr" type="number" max="24" min="0" />
          </div>
          <div class="input-controller">
            <label for="minutes">Min</label>
            <input name="minutes" v-model="duration.minutes" placeholder="min" type="number" max="59" min="0" />
          </div>
    
          <div class="input-controller">
            <label for="seconds">Sec</label>
            <input name="seconds" v-model="duration.seconds" placeholder="sec" type="number" max="59" min="0" />
          </div>
        </div>
        <div>
          <button class="f-w" @click="()=>openFloatingWindow()">Start</button>
        </div>
      </div>
      <div class="f-w-7 m-l-5 card outlined">
        <div class="f-col f-j-c-s-b f-h">
          <div>
            <h1 class="t-bold">Quick Start</h1>
          </div>
          
          <div class="f-row f-j-c-s-b">
            <div v-for="(pomo, id) in pomos" :key="id">
              <h3 class="t-center">{{ new DurationModel(pomo.duration).inMinutes }} mins</h3>
              <button class="f-w bg-none btn" @click="()=>openFloatingWindow(pomo.duration)">Start</button>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<style>
div.duration-box{
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
div.input-controller{
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>