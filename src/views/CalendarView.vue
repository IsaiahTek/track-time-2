<script setup lang="ts">
import AddNote from '../components/AddOrEditNote.vue';
import ViewNotes from '../components/ViewNotes.vue';
import { onUpdated, ref, watch } from 'vue';
const days = ref<number>(0);

const currentDate = ref(new Date())
const monthIndex = ref<number>(currentDate.value.getMonth())
const year = ref<number>(currentDate.value.getFullYear());
const hours = ref(currentDate.value.getHours());
const minutes = ref(currentDate.value.getMinutes())
const second = ref(currentDate.value.getSeconds());

type tabNamesType = 'note' | 'compute'
type tabType = {name: tabNamesType}
const tabs:tabType[] = [{name:'note'}, {name:'compute'}]

const tab = ref<tabType>(tabs[0]);

function setTab(name:tabNamesType){
  tab.value = {name:name}
}

const isAddingNote = ref<boolean>(false)

function closeAddNote(){
  isAddingNote.value = false;
}

const generateRandomNumber = () =>{
  return Math.random() * 10000000000;
}

const buildKey = ref<number>(generateRandomNumber())

function setBuildKey(){
  buildKey.value = generateRandomNumber();
}

function onAddNote(){
  setBuildKey();
  closeAddNote();
}

setInterval(()=>{
  currentDate.value = new Date();
  hours.value = currentDate.value.getHours();
  minutes.value = currentDate.value.getMinutes();
  second.value = currentDate.value.getSeconds();
}, 500)

const daysName = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function incrementMonth(){
  if(monthIndex.value >= 11){
    year.value += 1;
    monthIndex.value = 0
  }else{
    monthIndex.value += 1;
  }
}
function decrementMonth(){
  if(monthIndex.value <= 0){
    year.value -= 1;
    monthIndex.value = 11
  }else{
    monthIndex.value -= 1;
  }
}

// Function to calculate the future date
function getFutureDate(startDate:Date, days:number) {
    // Create a Date object from the start date
    const date = new Date(startDate);
    
    // Add the specified number of days
    date.setDate(date.getDate() + days);
    
    return date;
}
// // Function to calculate the future date
// function getPastDate(startDate:number, days:number) {
//     // Create a Date object from the start date
//     const date = new Date(startDate);
    
//     // Add the specified number of days
//     date.setDate(date.getDate() - days);
    
//     return date;
// }

// function getWeekDay(year:number, month:number, date:number){
//   return new Date(`${date} ${monthsName[month]} ${year}`).getDay();
// }

// function calculateDaysDifference(date1:number | string | Date, date2:number | string | Date) {
//     // Convert dates to milliseconds
//     const date1Ms = new Date(date1).getTime();
//     const date2Ms = new Date(date2).getTime();

//     // Calculate the difference in milliseconds
//     const differenceMs = Math.abs(date1Ms - date2Ms);

//     // Convert milliseconds to days (1000 ms/s * 60 s/min * 60 min/h * 24 h/day)
//     const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

//     return differenceDays;
// }
  
// Function to get the last day of a given month and year
function getLastDayOfMonth(year:number, month:number) {
    // Create a date for the first day of the next month
    const date = new Date(year, month, 1);
    
    // Set the date to the first day of the next month
    date.setMonth(date.getMonth() + 1);
    
    // Subtract one day to get the last day of the given month
    date.setDate(date.getDate() - 1);
    return date;
}


function getWeekDayName(day:number){
  return daysName[day?day-1:daysName.length-1]
}

type CalendarConstraint = {
  lastDayOfPreviousMonth: Date,
  firstDayOfThisMonth: Date,
  lastDayOfThisMonth: Date
}

function views(vYear:number = year.value, vMonth:number = monthIndex.value):CalendarConstraint{
  let lastDayOfThisMonth = getLastDayOfMonth(vYear, vMonth)
  let firstDayOfThisMonth = new Date(vYear, vMonth, 1);
  let lastDayOfPreviousMonth = getLastDayOfMonth(vYear, vMonth-1)
  return {
    lastDayOfPreviousMonth: lastDayOfPreviousMonth,
    firstDayOfThisMonth: firstDayOfThisMonth,
    lastDayOfThisMonth: lastDayOfThisMonth
  }
}


function getDayIndex(day:number){
  return daysName.findIndex(a=>a == getWeekDayName(day)) +1
}
const indexOfLastDayName = (daysName.length);
function isNotEndOfView(day:number){
  return getDayIndex(day) != indexOfLastDayName
}

function isPositionInMonthOfYear(row:number, day:number){
  const position = positionIndexOf(row, day);
  const constraint = views()
  return isNotEndOfView(constraint.lastDayOfPreviousMonth.getDay()) 
    ? position > getDayIndex(constraint.lastDayOfPreviousMonth.getDay()) && position <= constraint.lastDayOfThisMonth.getDate() + getDayIndex(constraint.lastDayOfPreviousMonth.getDay())
    : position >= constraint.firstDayOfThisMonth.getDate() && position <= constraint.lastDayOfThisMonth.getDate()
}

function getDateAt(row:number, day:number):Date{
  const index = positionIndexOf(row, day);
  let constraint = views();
  if(
    isNotEndOfView(constraint.lastDayOfPreviousMonth.getDay())
    && index <= getDayIndex(constraint.lastDayOfPreviousMonth.getDay())
  ){
    // Last month extra
    return new Date(
      monthIndex.value >= 0? year.value: year.value - 1,
      monthIndex.value >= 0? monthIndex.value-1: 11,
      constraint.lastDayOfPreviousMonth.getDate() - (getDayIndex(constraint.lastDayOfPreviousMonth.getDay()) - index))
  }else if(isPositionInMonthOfYear(row, day)){
    // Day in view month
    return new Date(
      year.value,
      monthIndex.value,
      isNotEndOfView(constraint.lastDayOfPreviousMonth.getDay()) 
        ? (index - getDayIndex(constraint.lastDayOfPreviousMonth.getDay()))
        : (index)
    );
  }else{
    // Next Month Overlap
    return new Date(
      monthIndex.value <= 10 ? year.value: year.value+1,
      monthIndex.value <= 10 ? monthIndex.value + 1: 0,
      isNotEndOfView(constraint.lastDayOfPreviousMonth.getDay())
        ? (index - getDayIndex(constraint.lastDayOfPreviousMonth.getDay()))%constraint.lastDayOfThisMonth.getDate()
        : (index%constraint.lastDayOfThisMonth.getDate())
    );
  }
}

const focusedDate = ref<Date|null>(null)
function isFocused(row:number, day:number){
  const date = getDateAt(row, day);
  return focusedDate.value?.valueOf() == date.valueOf();
}

function isPositionToday(row:number, day:number):boolean{
  return getDateAt(row, day).getFullYear() == currentDate.value.getFullYear() && getDateAt(row, day).getMonth() == currentDate.value.getMonth() && getDateAt(row, day).getDate() == currentDate.value.getDate();
}

function setFocusedCell(row:number, day:number){
  const date = getDateAt(row, day);
  if(date.getMonth() < monthIndex.value){
    decrementMonth();
  }else if(date.getMonth() > monthIndex.value){
    incrementMonth();
  }
  if(focusedDate.value?.getMonth() == date.getMonth() && focusedDate.value?.getDate() == date.getDate() && focusedDate.value.getFullYear() == date.getFullYear()){
      focusedDate.value = null
    }else{
      focusedDate.value = date;
    }
}
const targetElement = ref<HTMLElement|null>(document.getElementById('calendarView'))
onUpdated(()=>{
  if(!hasFoundCalendarView.value){
    targetElement.value = document.getElementById('calendarView');
    hasFoundCalendarView.value = true;
  }
})

const positionIndexOf = (row:number, day:number)=> ((row-1)*7 + day);

const hasFoundCalendarView = ref(false);

watch(hasFoundCalendarView, (e)=>{
  if(e){
    targetElement.value!.addEventListener('wheel', (event: WheelEvent) => {
      const deltaY = event.deltaY;
      const deltaX = event.deltaX;

      if(deltaX >= 4 || deltaY >= 4){
        incrementMonth()
      }else if(deltaX <= -4 || deltaY <= -4){
        decrementMonth()
      }
    });
  }
})

</script>

<template>
  <section class="mb-3">
    <h1>Calendar</h1>
    <h2>{{ views().lastDayOfThisMonth.getDate() }}/{{ views().lastDayOfThisMonth.getMonth() }}</h2>
  </section>
  <div class="row">
    <div class="calendar mr-5">
      <span>{{ daysName[currentDate.getDay()-1] }} [{{ String(hours).padStart(2, '0') }}:{{ String(minutes).padStart(2, '0') }}:{{ String(second).padStart(2, '0') }}]</span>
      <h2>{{ currentDate.getDate() }} {{ monthsName[currentDate.getMonth()] }}, {{ currentDate.getFullYear() }}</h2>
      <div class="view" id="calendarView">
        <div class="controls">
          <span @click="decrementMonth" class="control"><img width="100%" src="../components/chevron_left_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png" alt=""></span>
          <span>{{ monthsName[monthIndex] }} {{ (year == currentDate.getFullYear())?null:year }}</span>
          <span @click="incrementMonth" class="control"><img width="100%" src="../components/chevron_right_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png" /></span>
        </div>
        <div class="header">
          <span class="cell" v-for="dayName in daysName" :key="dayName">{{ dayName }}</span>
        </div>
        <div class="week-row" v-for="row in 6" :key="row">
          <span :key="day" @click="setFocusedCell(row, day)" class="cell date" :class="[
              isPositionToday(row, day)?'today':null,
              isPositionInMonthOfYear(row, day)?null:'blur-cell',
              isFocused(row, day)?'focused':null
            ]" v-for="day in 7">{{getDateAt(row, day).getDate()}}</span>
        </div>
      </div>
    </div>
    <div class="tabs" v-if="focusedDate">
      <div class="tools">
        <button :class="tab.name=='note'?'active':''" @click="setTab('note')">Note</button>
        <button :class="tab.name=='compute'?'active':''" @click="setTab('compute')">Compute</button>
      </div>
      <hr class="mb-3">
      <div class="scrollable">
        <div class="note mb-3" v-if="tab.name.toUpperCase() == 'NOTE'">
          <div>
            <ViewNotes :date="focusedDate.getTime()" :open-add-note="()=>{isAddingNote = true}" :build-key="buildKey" :on-add-note="onAddNote" ></ViewNotes>
                      
            <AddNote v-if="isAddingNote" :date="focusedDate.getTime()" :on-add-note="onAddNote" />
            
          </div>
        </div>
        <div class="compute" v-else-if="tab.name.toUpperCase() == 'COMPUTE'">
          <h2>Date of Days From Today</h2>
          <div>
            <input v-model="days" type="number" name="days" id="days" placeholder="0" min="0" />
          </div>
          <div>
            <p>
              {{ getFutureDate(focusedDate, days) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="unfocused-date-view" v-else>
      <div>
        <h2>No Date Picked</h2>
      </div>
      <div>
        <p>Pick a date to see note or compute date</p>
      </div>
    </div>
  </div>
</template>

<style>
div.calendar{
  max-width: 360px;
}
div.calendar div.header, div.calendar div.week-row{
  display: flex;
  justify-content: space-between;
}

div.calendar div.controls{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
span.control{
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
span.control:hover{
  background-color: rgb(240, 240, 240);
  cursor: pointer;
}
.cell{
  display: inline-block;
  padding: 7px;
  width: 40px;
  text-align: center;
  margin: 2px;
  border-radius: 10px;
  border: solid 1px transparent;
}
.today{
  background-color: rgb(208, 233, 255);
}
.blur-cell{
  color: gray;
}
.focused{
  border: solid 1.5px rgb(221, 221, 221);
}
.date{
  cursor: pointer;
}
h2{margin-top: -10px;}
.row{
  display: flex;
  align-items: start;
}
.calendar{
  /* margin-right: ; */
  background-color: color-mix(in srgb, var(--background-color) 90%, white 10%);
  padding: 20px;
  border-radius: 10px;
  transition: all ease-in-out .5s;
}
.calendar:hover{
  border-radius: 5px;
  box-shadow: color-mix(in srgb, var(--background-color) 90%, white 10%) 0px 20px 20px;
  transition: all ease-in-out .5s;
  background-color: color-mix(in srgb, var(--background-color) 80%, white 20%);
}
.mr-5{
  margin-right: 50px;
}
.mb-3{
  margin-bottom: 30px;
}
.f-w{
  width: 100%;
  text-align: left;
  padding-inline: 10px;
  height: 40px;
}
.tabs{
  width:55%
}
.add-note-wrapper{
  display: flex;
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.add-note-backdrop{
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(44, 44, 44, 0.37);
  /* display: flex;
  align-items: center;
  justify-content: center; */
}
.add-note-dialog{
  width: 35%;
  max-width: 500px;
  padding: 30px;
  background-color: rgb(239, 243, 245);
  border-radius: 5px;
  position: inherit;
  z-index: 10;
}
.tools .active{
  background-color: blue;
  color: white;
}
button{
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}
.tools{
  margin-bottom: 20px;
}
.unfocused-date-view{
  display: flex;
  flex-direction: column;
  height: 60vh;
  width: 55%;
  align-items: center;
  justify-content: center;
}
.scrollable{
  max-height: 70vh;
  overflow-y: scroll;
}
hr{color: aliceblue;}
</style>