<template>
  <div class="h-[calc(100vh-64px)] flex items-center justify-center">
    <div class="w-full h-full grid grid-cols-4 gap-4">
      <UCard :ui="{ base: 'w-full' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon dynamic name="ph:chat-centered-text-duotone" size="22" />

              {{ $route.query.room }}
            </div>

            <UPopover>
              <UButton label="Sair" variant="solid" color="gray" />

              <template #panel="{ close }">
                <div
                  class="flex flex-col items-center text-center gap-2 px-10 py-4"
                >
                  <UIcon
                    dynamic
                    name="ph:info"
                    size="35"
                    class="text-primary"
                  />

                  <p class="text-sm">
                    Tem certeza que deseja <br />sair da sala?
                  </p>

                  <div class="flex gap-4">
                    <UButton
                      label="Sim"
                      variant="outline"
                      size="sm"
                      @click="navigateTo('/')"
                    />

                    <UButton
                      label="Não"
                      size="sm"
                      variant="outline"
                      color="black"
                      @click="close"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </template>

        <section>
          <div class="flex flex-col gap-2">
            <div v-for="user in users" :key="user.id">
              <UCard
                :ui="{
                  body: {
                    background: `${
                      user.username === currentUser && 'bg-blue-200'
                    }`,
                    padding: 'p-2 sm:p-2',
                  },
                }"
              >
                <div class="flex items-center gap-2">
                  <UIcon dynamic name="i-ph-star-bold" size="18" />
                  {{ user.username }}
                </div>
              </UCard>
            </div>
          </div>
        </section>
      </UCard>

      <UCard
        class="col-span-3"
        :ui="{
          base: 'w-full flex flex-col justify-between',
          body: { base: 'h-full', padding: 'p-0 sm:py-6 sm:pl-6 sm:pr-3' },
        }"
      >
        <section
          class="h-[calc(100vh-188px)] overflow-auto pr-3 flex flex-col gap-4"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="getMessageClass(message.username)"
          >
            <UAlert
              :class="getAlertClass(message.username)"
              :title="`${message.username} - ${message.time}`"
            >
              <template #description>
                <span v-html="message.text" />
              </template>
            </UAlert>
          </div>
        </section>

        <template #footer>
          <UInput
            trailing
            icon="i-heroicons-paper-airplane"
            placeholder="Digite uma mensagem e pressione enter"
            @keyup.enter="sendMessage"
          />
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io, type Socket } from "socket.io-client";
const route = useRoute();
const toast = useToast();

type User = {
  id: string;
  username: string;
  room: string;
};

type Message = {
  username: string;
  time: string;
  text: string;
  room: string;
  userType: string;
};

const users = ref<User[]>([]);
const messages = ref<Message[]>([]);
const currentRoom = ref<string>("");
const currentUser = ref<string>("");
const socket = ref<Socket>();

const getMessageClass = (user: string) => {
  if (user === "Admin") {
    return "flex justify-center";
  }

  if (user === route.query.username) {
    return "flex justify-end";
  }

  return "flex justify-start";
};

const getAlertClass = (user: string) => {
  if (user === "Admin") {
    return "w-1/2 bg-red-200";
  }

  if (user === route.query.username) {
    return "w-1/2 bg-blue-200";
  }

  return "w-1/2 bg-zinc-200";
};

onMounted(() => {
  const { username, room } = route.query as Partial<User>;

  // @ts-ignore
  currentUser.value = username;

  if (!username || !room) {
    toast.add({
      title: "Atenção",
      description: "Usuário ou sala não encontrados.",
      color: "red",
    });
    navigateTo("/");
  }

  socket.value = io({
    path: "/api/socket.io",
  });

  socket.value?.emit("joinRoom", { username, room });

  socket.value?.on("message", (response: Message) => {
    messages.value.push(response);
  });

  socket.value?.on("roomUsers", (response: { room: string; users: User[] }) => {
    currentRoom.value = response.room;
    users.value = response.users;
  });
});

onBeforeUnmount(() => {
  socket.value?.disconnect();
});

const sendMessage = (event: { target: { value: string } }) => {
  if (event.target.value) {
    socket.value?.emit("chatMessage", event.target.value);
    event.target.value = "";
  }
};
</script>
