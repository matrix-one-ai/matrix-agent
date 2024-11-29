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
  twitterUserExampleResponses: Record<string, {
    attitudes: string[];
    responses: string[];
  }>;
}

export default {
  sami,
};
