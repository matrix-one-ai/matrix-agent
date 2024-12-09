import sami from "./sami";

export interface Character {
  name: string;
  age: number;
  gender: string;
  info: string;
  bio: string;
  appearance: string;
  personality: string;
  image: string;
  twitterUsername: string;
  exampleMessages: string[];
  topics: string[];
  emotions: string[];
  twitterUserExampleResponses: Record<string, {
    attitudes: string[];
    responses: string[];
  }>;
}

export default {
  sami,
};
