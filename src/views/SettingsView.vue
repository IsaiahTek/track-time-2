<script setup lang="ts">
import { useSettingsStore } from '../stores/settings';
import { ref, watch } from 'vue';
const theme = ref<String>('light');
const settingsStore = useSettingsStore();
theme.value = settingsStore.themeName;
watch(settingsStore, ()=>{
    theme.value = settingsStore.themeName;
});
</script>
<template>
    <h1>Settings</h1>
    <div>
        <p>Using default <span @click="settingsStore.toggleUseDefaultTheme()">{{ theme }}</span></p>
    </div>
</template>