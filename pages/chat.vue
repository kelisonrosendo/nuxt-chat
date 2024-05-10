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
                      @click="onLeave"
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
                    background: `${user.currentUser && 'bg-blue-200'}`,
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
            :class="getMessageClass(message.userType)"
          >
            <UAlert
              :class="getAlertClass(message.userType)"
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
          />
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const toast = useToast();

type User = {
  id: string;
  username: string;
  room: string;
  currentUser: boolean;
};

type Message = {
  username: string;
  time: string;
  text: string;
  room: string;
  userType: string;
};

type UserType = {
  admin: string;
  external: string;
  local: string;
};

const users = ref<User[]>([
  {
    id: "1",
    username: "kelison.rocha",
    room: "Vue",
    currentUser: true,
  },
  {
    id: "2",
    username: "john.doe",
    room: "Vue",
    currentUser: false,
  },
]);

const messages = ref<Message[]>([
  {
    username: "admin",
    time: "14:28",
    text: "<span class='font-medium'>kelison.rocha</span> entrou no chat",
    room: "Vue",
    userType: "admin",
  },
  {
    username: "kelison.rocha",
    time: "14:30",
    text: "Olá, bom dia!",
    room: "Vue",
    userType: "local",
  },
  {
    username: "john.doe",
    time: "14:34",
    text: "Olá, bom dia, tudo certo?",
    room: "Vue",
    userType: "external",
  },
]);

const getMessageClass = (userType: string) => {
  const types = {
    admin: "flex justify-center",
    external: "flex justify-start",
    local: "flex justify-end",
  };

  return types[userType as keyof UserType];
};

const getAlertClass = (userType: string) => {
  const types = {
    admin: "w-1/2 bg-red-200",
    external: "w-1/2 bg-zinc-200",
    local: "w-1/2 bg-blue-200",
  };

  return types[userType as keyof UserType];
};

onMounted(() => {
  const { username, room } = route.query as Partial<User>;

  if (!username || !room) {
    toast.add({
      title: "Atenção",
      description: "Usuário ou sala não encontrados.",
      color: "red",
    });
    navigateTo("/");
  }
});

const onLeave = () => {
  navigateTo("/");
};
</script>
