import { UserPlan } from "@app/types";

interface IFakeUser {
  email: string;
  password: string;
  name: string;
  plan: UserPlan;
  houseName: string;
  adults: number;
  kids: number;
  pets: number;
  birthdate?: Date | null;
}

export interface IAuthUser extends Omit<IFakeUser, "password"> {}

const FAKE_USERS: IFakeUser[] = [
  {
    email: "yuri@gmail.com",
    password: "12345678",
    name: "Yuri laube",
    plan: "premium",
    houseName: "Casa do Yuri",
    adults: 2,
    kids: 1,
    pets: 1,
    birthdate: new Date("1990-05-15"),
  },
  {
    email: "paula@gmail.com",
    password: "12345678",
    name: "Paula desaparecida",
    plan: "free",
    houseName: "Apartamento Paula",
    adults: 1,
    kids: 0,
    pets: 1,
  },
];

export function fakeSignIn(email: string, password: string): IAuthUser | null {
  const user = FAKE_USERS.find((u) => u.email === email && u.password === password);
  if (!user) { return null; }
  const { password: _p, ...rest } = user;
  return rest;
}
