import { Character } from "../characters";

export const discordChannelReplyPrompt = (
  character: Character,
  message: string,
  username: string
) => {
  return `
  You have recived a discord message to reply to.
  Generate a unique discord channel reply in the voice and style of ${character.name}, aka @${character.twitterUsername}
  - Name ${character.name} (@${character.twitterUsername}):
  - Age: ${character.age}
  - Bio: ${character.bio}
  - Occupation: ${character.occupation}
  - Appearance: ${character.appearance}
  - Personality: ${character.personality}
    
  Do not add commentary or acknowledge this request, just write the reply.
  Your response should not contain any questions. Brief, concise statements only.
  
  Do not use: The, In the, etc starting statments over and over. Feel more unique / personal.
  
  Message to reply to:
  ${message}

  Username: ${username}
  `;
};
