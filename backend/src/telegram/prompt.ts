import { Character } from "../characters";

export enum TelegramAction {
  simpleReply = "simpleReply",
  contractAnalysis = "contractAnalysis",
}

export const telegramJudgementPrompt = (message: string) => {
  return `
Judge the message and decide the function action to take.
Message: ${message}

Options:
- simpleReply
- contractAnalysis

Output only 1 of the action options.

Example:

Message: Hey, how are you doing?

Output: { type: "simpleReply" }

--- OR ---

Message: What is 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 price?

Output: 

{ "type": "contractAnalysis", "contract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }

Message: What is 1337 price?

Output: 

{ "type": "contractAnalysis", "contract": "1337" }

Only output the JSON.
`;
};

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
- knowledge: ${character.knowledge}
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

export const telegramCryptoAnalysis = (
  character: Character,
  tokenInfo: any,
  userMessage: string,
  username: string
) => {
  return `
Analyze the trending token. Provide a response to the trending token.
Act like a crypto investor expert. Make it informational.
Generate a discord reply in the voice and style of ${character.name}.
- Age: ${character.age}
- Bio: ${character.bio}
- knowledge: ${character.knowledge}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Token Name: ${tokenInfo.name}
Token Symbol: ${tokenInfo.symbol}

Token JSON info dump:

${JSON.stringify(tokenInfo, null, 2)}

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails or phone numbers. No hashtags. Use $TOKEN when saying token names.
Do not intro or outro the response, just the response.

User message to reply to:
${userMessage}

Username to reply to: ${username}
`;
};
