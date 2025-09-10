<script setup lang="ts">
import { useNoteStore } from '../stores/note';
import { onBeforeMount, ref, watch } from 'vue';
import ViewNote from './ViewNote.vue';
const props = defineProps({
    date: {
        type: Number,
        required: true
    },
    buildKey: {
        type: Number,
        required: true
    },
    openAddNote:{
        type: Function,
        required: true,
    }
})

const notes = ref<Note[]>([]);

const date = ref(props.date);

function fetchNotes(date:number){
    useNoteStore().getNoteByDate(date).then((v)=>{
        notes.value = []
        notes.value = Array.from(new Set(v))
    });
}

onBeforeMount(()=>{
    fetchNotes(date.value)
})

watch(props, async(prop)=>{
    fetchNotes(prop.date)
})


</script>
<template>
    <div v-if="notes.length">
        <div class="f-row f-j-c-s-b f-a-c-c">
            <span @click="props.openAddNote()" class="add btn">+</span>
            <h1>All Notes on {{ new Date(props.date).toDateString() }}</h1>
            <div class="e"></div>
        </div>
        <div :key="note.id.toString()" v-for="note in notes">
            <ViewNote :note="note" :date="date" ></ViewNote>
        </div>
    </div>
    <div class="centered f-col f-a-c-c f-j-c-c" v-else>
        <div class="t-center mb-1">
            <h2>No Note</h2>
            <p>You've not added a note on this day</p>
        </div>
        <div class="t-center">
            <span class="add btn" @click="props.openAddNote()">+</span>
        </div>
    </div>
</template>
<style>
.centered{
    border: 1px solid gainsboro;
    border-radius: 5px;
    width: 100%;
    height: 45vh;
}
</style>