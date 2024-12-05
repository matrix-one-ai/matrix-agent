import { Character } from "../characters";

export const discordChannelReplyPrompt = (
  character: Character,
  message: string,
  username: string,
  previousChannelMessages: string
) => {
  return `
  You have recived a discord message to reply to in a conversation.
  Generate a unique discord channel reply in the voice and style of ${character.name}.
  - Name ${character.name}
  - Age: ${character.age}
  - Bio: ${character.bio}
  - Occupation: ${character.occupation}
  - Appearance: ${character.appearance}
  - Personality: ${character.personality}
    
  Do not add commentary or acknowledge this request, just write the reply.
  Your response should not contain any questions. Brief, concise statements only. No not use emojis.
  Do not use: The, In the, etc starting statments over and over. Feel more unique / personal.
  
  Message to reply to:
  ${message}

  Username: ${username}

  Previous channel conversation messages for context:
  ${previousChannelMessages}
  `;
};
