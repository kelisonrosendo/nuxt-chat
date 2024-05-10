<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
body {
  color: #3f3f46;
  background: #f4f4f5;

  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    padding: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e4e4e7;
  }
}
</style>
