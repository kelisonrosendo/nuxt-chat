import moment from "moment";

export function createMessage(username: string, text: string) {
  return {
    username,
    text,
    time: moment().format("h:mm"),
  };
}
