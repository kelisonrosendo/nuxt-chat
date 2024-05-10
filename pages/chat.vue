<template>
  <div class="h-[calc(100vh-64px)] flex items-center justify-center">
    <div class="w-full h-full grid grid-cols-4 gap-4">
      <UCard :ui="{ base: 'w-full' }">
        <template #header>
          <div class="flex items-center justify-between text-blue-600">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-chat-bubble-bottom-center"
                class="text-xl"
              />

              {{ $route.query.room }}
            </div>

            <div>
              <UButton label="Sair" @click="onLeave" />
            </div>
          </div>
        </template>

        <section></section>
      </UCard>

      <UCard
        class="col-span-3"
        :ui="{
          base: 'w-full flex flex-col justify-between',
          body: { base: 'h-full' },
        }"
      >
        <section class="flex flex-col gap-4">
          <div class="flex justify-center">
            <UAlert class="w-1/2 bg-red-200" title="admin - 18:43">
              <template #description>
                <span class="font-medium"> kelison.rocha </span>
                entrou no chat
              </template>
            </UAlert>
          </div>

          <div class="flex justify-start">
            <UAlert
              class="w-1/2 bg-zinc-200"
              title="kelison.rocha - 18:44"
              description="Olá pessoal, boa noite!"
            />
          </div>

          <div class="flex justify-end">
            <UAlert
              class="w-1/2 bg-blue-200"
              title="john.doe - 18:45"
              description="Boa noite galera!"
            />
          </div>
        </section>

        <template #footer>
          <UInput
            trailing
            icon="i-heroicons-paper-airplane"
            placeholder="Digite uma mensagem e pressione enter"
          />
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const onLeave = () => {
  navigateTo("/");
};
</script>
