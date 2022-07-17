import { IronSessionOptions } from "iron-session";

export function cls(...classNames: string[]) {
  return classNames.join(" ");
}

export const options: IronSessionOptions = {
  cookieName: "Login-Cookie",
  password: "j5GY6gIWznCyrmnqpHD4XiGugtrQCsAD",
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
