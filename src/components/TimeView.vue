<script lang="ts">
export default {
    name:"TimeView",
    props: {
        duration:{
            type: Object as ()=> Duration,
            required:true
        }
    }
}
</script>
<template>
    <div class="f-row">
        <div v-if="duration.weeks" class="time-cell">
            <span>wks</span>
            {{ Math.floor(duration?.weeks) }}
        </div>
        <div v-if="duration.days" class="time-cell">
            <span>days</span>
            {{ Math.floor(duration?.days) }}
        </div>
        <div class="time-cell">
            <span>hr</span>
            {{ Math.floor(duration?.hours??0) }}
        </div>
        <div class="time-cell">
            <span>min</span>
            {{ Math.floor(duration?.minutes||0) }}
        </div>
        <div class="time-cell">
            <span>sec</span>
            {{ Math.floor(duration?.seconds||0) }}
        </div>
        <div class="time-cell counter"><span class="milliseconds">{{ Math.floor(duration?.milliseconds??0).toString().substring(0,1) }}</span></div>
    </div>
</template>

<style>
div.f-row{
    display: flex;
    flex-direction: row;
    align-items: center;
    /* align-self: center; */
    /* align-content: center; */
    justify-content: center;
    /* justify-items: center; */
    /* justify-self: center; */
    /* height: 100vh; */
}
div.time-cell span{
    font-size: small;
    color: rgb(4, 112, 0);
    position: relative;
    top: -5px;
    /* bottom: -20px; */
    margin-bottom: -20px;
}
div.time-cell span.milliseconds{
    position: unset;
    top: unset;
    margin-bottom: unset;
}
div.f-row div.counter{
    box-shadow: 0px 1px 5px gray;
    margin-left: 10px;
    width: 30px !important;
    height: 30px !important;
}
div.f-row div.time-cell{
    box-shadow: 0px 1px 5px gray;
    display: inline-flex;
    flex-direction: column;
    width: 60px;
    height: 60px;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  border-radius: 15px;
  margin-right: 5px;
  background-color: white;
  top: 20px;
  margin-bottom: 5px;
}
</style>