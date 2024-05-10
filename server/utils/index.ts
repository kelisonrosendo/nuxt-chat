import { Server, type ServerOptions, type Socket } from "socket.io";
import type { H3Event } from "h3";
import type { User } from "../types";

import { userJoin, getRoomUsers, userLeave } from "./users";
import { createMessage } from "./messages";

const options: Partial<ServerOptions> = {
  path: "/api/socket.io",
  serveClient: false,
};

const chatBotName = "Admin";

export const io = new Server(options);

export const initSocket = (event: H3Event) => {
  // @ts-ignore
  io.attach(event.node.res.socket?.server);

  io.on("connection", (socket: Socket) => {
    socket.on("joinRoom", (payload: User) => {
      const user = userJoin({ ...payload, id: socket.id });
      const joinMessage = `<span class='font-medium'>${user.username}</span> entrou na sala`;

      socket.join(user.room);

      socket.broadcast
        .to(user.room)
        .emit("message", createMessage(chatBotName, joinMessage));

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    socket.on("chatMessage", (payload: string) => {
      const user = getCurrentUser(socket.id);

      if (user) {
        io.to(user.room).emit("message", createMessage(user.username, payload));
      }
    });

    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        const joinMessage = `<span class='font-medium'>${user.username}</span> saiu da sala`;

        io.to(user.room).emit(
          "message",
          createMessage(chatBotName, joinMessage)
        );

        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
