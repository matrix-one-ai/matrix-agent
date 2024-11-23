import sami from "./sami";

export interface Character {
  name: string;
  age: number;
  gender: string;
  occupation: string;
  bio: string;
  image: string;
  twitterUsername: string;
  exampleMessages: string[];
  topics: string[];
}

export default {
  sami,
};
