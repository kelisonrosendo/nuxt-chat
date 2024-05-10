<template>
  <div class="h-screen flex items-center justify-center">
    <UCard :ui="{ base: 'w-[400px]' }">
      <template #header>
        <h1 class="flex items-center justify-center gap-2 font-medium text-lg">
          <UIcon dynamic name="i-ph:chat-centered-text-duotone" size="22" />
          Tech Chat
        </h1>
      </template>

      <UForm
        class="space-y-4"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
      >
        <UFormGroup label="Usuário" name="username">
          <UInput v-model="state.username" placeholder="Digite um usuário" />
        </UFormGroup>

        <UFormGroup label="Sala" name="room">
          <USelect v-model="state.room" :options="rooms" />
        </UFormGroup>

        <UButton block type="submit">
          Entrar na sala <span class="font-semibold">{{ state.room }}</span>
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  username: z.string({ required_error: "Campo obrigatório" }),
  room: z.string(),
});

const rooms = ["Vue", "Node", "Java"];

const state = reactive({
  username: undefined,
  room: rooms[0],
});

async function onSubmit() {
  navigateTo(`/chat?username=${state.username}&room=${state.room}`);
}
</script>
