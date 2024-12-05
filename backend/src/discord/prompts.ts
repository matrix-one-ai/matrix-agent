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
  Brief, concise statements only. No not use emojis.
  Feel more unique / personal.
  
  Message to reply to:
  ${message}

  Username to reply to: ${username}

  Previous channel conversation messages for context:
  ${previousChannelMessages}
  `;
};

export const discordJudgeIfShouldReply = (
  character: Character,
  recentMessage: string,
  previousChannelMessages: string
) => {
  return `
    Judge the recent message and decide if you should reply.
    You should only reply if context of convo is directed at ${character.name} or referncing a response to your previous messages.

    Most recent message:

    ${recentMessage}

    Previous channel conversation messages for context:

    ${previousChannelMessages}

    Output only TRUE or FALSE.
    This is used to decide if the AI should reply.
  `;
};
