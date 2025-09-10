<script setup lang="ts">
import { sendNotification } from '@tauri-apps/plugin-notification';

import { listen } from '@tauri-apps/api/event';
import { computed, onMounted, ref, watch } from "vue";
import TimeView from '../components/TimeView.vue';
import { Duration } from '../models/duration';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '../stores/settings';
const duration = ref<Duration>();
const isTimeUp = ref<boolean>(false);
const isTiming = ref<boolean>(false);
const intervalId = ref<undefined|number>(undefined);

type NotificationType = {
  title:string,
  body:string,
  show:boolean
}

const notification = ref<NotificationType>({title:'', body:'', show:false});

let permissionGranted = ref<boolean>(useSettingsStore().permissionGranted);

watch(()=>useSettingsStore().permissionGranted, ()=>{
  permissionGranted.value = useSettingsStore().permissionGranted;
});

// function _sendNotification(notification:{title:string, body:string}){
//   const {title, body} = notification;
//   if (useSettingsStore().permissionGranted) {
//     console.log("SENDING NOTIFICATION", JSON.stringify(notification))
//     sendNotification({ title: title, body: body });
//   }else{
//     useSettingsStore().requestPermissionIfNotGranted().then(()=>{
//       _sendNotification(notification);
//     })
//   }
// }

const audioFile = ref<HTMLAudioElement|undefined>(undefined)

onMounted(()=>{
  if(useRoute()?.params?.duration != null){
    duration.value = new Duration(JSON.parse(useRoute().params.duration as string))
    pauseTracking();
    startTracking();
  }else{
    listen('duration', (event)=>{
      if(useRoute()?.params?.duration == undefined){
        // Cancel initial tracking
        pauseTracking();
      
        // Assign the new value to duration
        let durat = JSON.parse((event.payload as {duration:string}).duration as string);
        duration.value = new Duration(durat);
      
        // Reset the time-up-blinking indicator
        isTimeUp.value = false;
      
        // Start tracking/counting
        startTracking();
      }
    })
  }
  audioFile.value = document.getElementById('audio') as HTMLAudioElement
});

// const unlisten = await listen<string>('error', (event) => {
//   console.log(`Got error, payload: ${event.payload}`);
// });

// you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
// unlisten();

const startTracking = () =>{
  duration.value?.tickTime()
  intervalId.value = setInterval(()=>{
    if(duration.value != undefined && duration.value.toMilliseconds() > 0){
      duration.value = duration.value.now();
    }else{
      clearInterval(intervalId.value)
      // _sendNotification({title: "TIME UP", body:"The countdown has completed successfuly"})
    }
  }, 100);
  isTiming.value = true;
}

function handlePauseClicked(){
  pauseTracking();
  showNotification({title:'PAUSED', body:'The timer has been paused'});
}

const pauseTracking = ()=>{
  clearInterval(intervalId.value)
  duration.value?.pauseTick()
  isTiming.value = false;
  // repeatEveryTwoSeconds(()=>showNotification({title:'PAUSED', body:'The timer has been paused'}))
}

const isZeroOrNull = (val:number|undefined) => !((typeof val === 'number') && val > 0)

const isEmptyDuration = computed(()=>isZeroOrNull(duration.value?.seconds) && isZeroOrNull(duration.value?.minutes) && isZeroOrNull(duration.value?.hours) && isZeroOrNull(duration.value?.milliseconds))

watch(()=>duration.value?.isTimeUp, (newTimeUp, oldTimeUp)=>{
  if(newTimeUp != oldTimeUp){
    isTimeUp.value = duration.value?.isTimeUp!;
    if(isTimeUp.value){
      sendNotification({title:"TIME UP", body:"The countdown has completed"})
    }
    // if(isTimeUp.value){
    //   console.log("Playing")
    //   audioFile.value?.play();
    // }else{
    //   audioFile.value?.pause();
    //   audioFile.value!.currentTime! = 0;
    // }
  }
});

// function repeatEveryTwoSeconds(callback:Function){
//   callback()
// }

// Function to show notification
function showNotification(info:{title:string, body:string}) {
  const {title, body} = info;
  notification.value.title = title;
  notification.value.body = body;
  // Create a system tray notification
  // const notificationOptions = {
  //   body: body,
  //   // icon: 'path/to/icon.png', // Optional
  // };

  // Use the Notification API to create a system tray notification
  // Request permission for notifications
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // let notificationB = 
      new Notification(title, {
        body: body,
        icon: 'path/to/icon.png',
        requireInteraction:true,
        badge:"5",
        
        
      });
    
      // Auto-close the notification after 5 seconds
      // setTimeout(() => {
      //   notificationB.close();
      // }, 2000);
    }
  });
  // Create a system tray notification

  // Show the notification container
  notification.value.show = true;

  // Auto-hide the notification after 5 seconds
  // setTimeout(() => {
    // notification.value.show = false;
  // }, 2000);
}

</script>

<template>
  <!-- Notification container -->
  <!-- <div v-if="notification.show" id="notification-container">
    Notification element
    <div id="notification">
      <span id="notification-title">{{ notification.title }}</span>
      <span id="notification-body">{{ notification.body }}</span>
    </div>
  </div> -->


  <div class="timer" :class="isTimeUp?'time-up-blink':'timer'">
    <TimeView v-if="duration != undefined" :duration="duration"></TimeView>
    <div class="controls">
      <img class="button" v-if="!isEmptyDuration" @click="()=>isTiming ?handlePauseClicked(): startTracking()" :src="isTiming? '../pause_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png': '../play_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'" />
    </div>
    <!-- <audio id="audio" controls>
      <source src="/audios/Tchaikovsky-Waltz-op39-no8.mp3" type="audio/mpeg">
    </audio> -->
    </div>
  </template>

<style>

/* Notification container styles */
#notification-container {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 20px;
}

/* Notification element styles */
#notification {
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

img.button{
  width: 32px;
}
img.button:hover{
  cursor: pointer;
}
.timer{
  padding: 10px;
  height: 100vh;
  background-color: rgb(231, 231, 231);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.label{
  text-align: center;
  font-style: italic;
}
div.controls{
  margin: 2.5px auto;
}
div.time-up-blink{
  background-color: red;
  animation: time-up-blink .2s ease-in-out infinite;
}
div.remove-time-up-blinking{
  background-color: inherit;
  animation: time-up-blink none none none;
}
@keyframes time-up-blink{
  50%{
    background-color: white;
  }
}
</style>