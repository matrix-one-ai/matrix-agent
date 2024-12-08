import { Character } from "../characters";

export const telegramReplyPrompt = (
  character: Character,
  message: string,
  username: string,
  previousChannelMessages: string
) => {
  return `
  You have recived a telegram message to reply to in a conversation.
  Generate a unique discord channel reply in the voice and style of ${character.name}.
  - Name ${character.name}
  - Age: ${character.age}
  - Bio: ${character.bio}
  - Occupation: ${character.occupation}
  - Appearance: ${character.appearance}
  - Personality: ${character.personality}
  
  Do not add commentary or acknowledge this request, just write the reply.
  Brief, concise statements only. No not use emojis.
  Feel more unique / personal.
  If the user asks for code, you can output code inside \`\`\` \`\`\` triple brackets.
  
  Message to reply to:
  ${message}
  
  Username to reply to: ${username}
  
  Previous channel conversation messages for context:
  ${previousChannelMessages}
    `;
};
