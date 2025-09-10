import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { defineStore } from "pinia";


type Settings = {
    useDarkTheme:boolean,
    permissionGranted: boolean,
}
let permissionGranted = false;

async function requestPermissionIfNotGranted(){
    console.log("INSIDE THE REQUEST PERMISSION FUNCTION")
    permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        console.log("REQUESTING PERMISSION FUNCTION")
        try {
            requestPermission();
        } catch (error) {
            console.log("ERROR FOR PERMISSION REQUEST ", error);
        }
        const permission = await requestPermission().catch((e)=>console.log("ERROR ON PERMISSION REQUEST ", e));
        permissionGranted = permission === 'granted';
    }
    console.log("PERMISSION HERE ", permissionGranted)
    return permissionGranted;
}

export const useSettingsStore = defineStore('settings', {
    state:():Settings=>({
        useDarkTheme:false,
        permissionGranted: false,
    }),
    actions:{
        toggleUseDefaultTheme(){
            const darkBg = window.getComputedStyle(document.documentElement).getPropertyValue('--dark-color');
            const lightBg = window.getComputedStyle(document.documentElement).getPropertyValue('--light-color')
            const currentBgIsDark = this.useDarkTheme;
            currentBgIsDark
                ? document.body.style.setProperty('--background-color', lightBg)
                : document.body.style.setProperty('--background-color', darkBg)
            this.useDarkTheme = !this.useDarkTheme;
        },
        async requestPermissionIfNotGranted(){
            console.log("Should Request permission if not enabled");
            this.permissionGranted = await requestPermissionIfNotGranted();
            console.log("PERMISSION AFTER REQUEST ", this.permissionGranted);
        },
        sendDefaultNotification(){
            if(permissionGranted){
                console.log("PERMISSION ", permissionGranted, this.permissionGranted);
                sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' });
            }else{
                requestPermissionIfNotGranted();
            }
        }
    },
    getters:{
        themeName():String{
            return this.useDarkTheme?'dark':'light'
        }
    },
});