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
If the user asks for code, you can output code inside \`\`\` \`\`\` triple brackets.

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
If the most recent message is right after your message, reply.

Most recent message:

${recentMessage}

Previous channel conversation messages for context:

${previousChannelMessages}

Output only TRUE or FALSE.
This is used to decide if the AI should reply.
  `;
};

export const discordJudgeIsCryptoTalk = (message: string) => {
  return `
Judge the message and decide if the user is asking about a crypto token.

Message:

${message}

Output only the token ticker name.

Examples:

1.) Hey what do you think about $BTC?

Output:

BTC

2.) Hey what do you think about Bitcoin?

Output:

BTC

3.) Hey what do you think about BTC?

Output:

BTC

4.) Hey what do you think about $ETH?

Output:

ETH

This is used to decide if the AI should lookup a token ticker.

If the message does not contain a token ticker, output FALSE.

Example:

Hey what do you think about dogs and cats?

Output:

FALSE
  `;
};

export const discordCryptoAnalysis = (
  character: Character,
  tokenInfo: any,
  userMessage: string,
  username: string
) => {
  return `
Analyze the trending token. Provide a response to the trending token.
Act like a crypto investor expert. Make it informational.
Generate a discord reply in the voice and style of ${character.name}, aka @${
    character.twitterUsername
  }
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}
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
