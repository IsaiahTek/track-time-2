<script lang="ts">
import { useNoteStore } from '../stores/note';
import AddOrEditNote from './AddOrEditNote.vue';
export default{
    components: {AddOrEditNote},
    name:"NoteView",
    props: {
        note: {
            type: Object as ()=> Note,
            required: true,
        },
        date: {
            type: Number,
            required: true
        },
    },
    data(){
        return {
            isEditing: false,
            showMenu: false,
        }
    },
    methods:{
        handleDelete(id:number){
            useNoteStore().delete(id);
        }
    },
    computed: {
        xEC(){
            return useNoteStore().xE
        }
    },
    watch:{
        // Then I hide the showMenu whenever the value changes because it means somewhere on the document has been clicked.
        // Clicking on a component outside this component is not observable by default. So I have used this approach to circumvent such limitation
        xEC(){
            this.showMenu = false;
        }
    },
}
document.addEventListener('click', function(){
    // Here I have used xEC to watch for click on any part of the document
    // So by updating the xE I am listening to document click event. Then I will take action accordingly
    useNoteStore().updateXE(Math.random()*10000000000);
});
</script>

<template>
    <div class="card elevated" @click="()=>{
        if(showMenu){
            showMenu = false
        }
    }">
        <div class="f-row f-j-c-s-b">
            <div>
                <p class="t-bold text"># {{ note.title }}</p>
            </div>
            <div class="more">
                <span class="btn circle t-blue f-row" @click="(e)=> {
                    e.stopImmediatePropagation()
                    showMenu = true;
                }">
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                </span>
                <div v-if="showMenu" class="menu">
                    <span class="t-blue" @click="()=>isEditing = true">Edit</span>
                    <span class="t-red" @click="()=>handleDelete(note.id)">Delete</span>
                </div>
            </div>
        </div>
        <pre class="text">{{ note.details }}</pre>
        <small class="text">{{ note.date }}</small>
    </div>
    <AddOrEditNote v-if="isEditing" :date="date" :note="note" :on-add-note="()=>isEditing = false" ></AddOrEditNote>
</template>

<style>
/* normal | pre | nowrap | pre-wrap | pre-line | break-spaces | [ <'white-space-collapse'> || <'text-wrap'> || <'white-space-trim'> ] */
pre{
    white-space: pre-wrap;
}
.text{
    color: rgb(95, 95, 95);
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
.circle{
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding-inline: 1px;
    color: blue;
}
.circle:hover{
    background-color: blue;
    color:white;
    font-size: larger;
}
.dot{
    display: block;
    margin-top: -10px;
    font-size: larger;
}
.more{
    display: flex;
    flex-direction: column;
    align-items: last baseline;
}
.menu{
    /* right: 20px; */
    position:absolute;
    z-index: 20;
    margin-top: 30px;
    right: 5%;
}
.menu, .menu > span{
    display: block;
    width: 100px;
}
.menu > span{
    background-color: white;
    border: 1px solid gainsboro;
    padding: 8px 20px;
    
}
.menu > span:hover{
    cursor: pointer
}
.menu > span:nth-child(1){
    border-bottom: 0px;
    border-radius: 5px 5px 0px 0px;
}
.menu > span:nth-last-child(1){
    border-radius: 0px 0px 5px 5px;
}
</style>

