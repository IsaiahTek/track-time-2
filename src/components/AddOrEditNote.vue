<script lang="ts">
import { useNoteStore } from '../stores/note';

export default{
    props: {
        date: {
            type: Number,
            required: true,
        },
        onAddNote: {
            type: Function,
            required: true
        },
        note: {
            type: Object as ()=>Note,
            required: false
        }
    },
    data(){
        return {
            title: this.note?.title ?? '',
            details: this.note?.details.toString() ?? '',
            actionText: this.note != undefined ? 'Update': 'Add',
        }
    },
    methods:{
        add(){
            useNoteStore().add({title: this.title, details: this.details, date: this.date});
            this.title = '';
            this.details = '';
            this.onAddNote();
        },
        update(){
            if(this.note != undefined){
                useNoteStore().update({ ...this.note!, title: this.title, details: this.details})
                this.onAddNote();
            }
        },
        submit(){
            if(this.note != undefined){
                this.update();
            }else{
                this.add();
            }
        }
    }
}
</script>

<template>
    <div class="add-note-wrapper">
        <div class="add-note-backdrop" @click="()=>onAddNote()">
        </div>
        <div class="add-note-dialog">
            <h2 class="mb-1">{{actionText}} Note</h2>
            <div class="mb-1">
                <input placeholder="Title" class="f-w" type="text" name="" id="title" v-model="title">
            </div>
            <div class="mb-1">
                <textarea contenteditable="true" placeholder="Note" class="contenteditable" type="text" name="" id="title" v-model="details" >
                </textarea>
            </div>
            <div>
                <button :disabled="title.length < 1 && details.length < 1" :class="title.length < 1 && details.length < 1 ? 'disabled':null" class="add" @click="submit">{{actionText}}</button>
            </div>
        </div>
    </div>
</template>
<style>
.placeholder{
    position: relative;
    top: 30px;
}
.contenteditable, .f-w{
    border: 1px solid gainsboro;
    height: 100px;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    resize: vertical;
}

.contenteditable:focus, .f-w:focus{
    outline: none;
}
.mb-1{
    margin-bottom: 10px;
}
.add{
    padding: 8px 15px;
    background-color: blue;
    outline: none;
    border-radius: 5px;
    border-width: 0px;
    color: white
}
button.disabled{
    background-color: gainsboro !important;
    /* color:blue */
}
</style>