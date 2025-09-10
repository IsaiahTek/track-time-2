import { defineStore } from 'pinia'

export const useDurationStore = defineStore('duration', {
  state:():DurationState[]=>([]),
  actions:{
    add(newDuration:number) {
      this.$state.push({duration: newDuration});
    },
    remove(durationState:DurationState){
      console.log(`Removing ${durationState.duration}`);
      this.$state = this.filter((a)=> a.duration == durationState.duration)
    }
  }
})
