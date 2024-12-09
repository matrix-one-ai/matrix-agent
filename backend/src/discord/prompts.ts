import { Character } from "../characters";

export enum DiscordAction {
  simpleReply = "simpleReply",
  contractAnalysis = "contractAnalysis",
}

export const discordJudgementPrompt = (
  character: Character,
  message: string,
  previousMessages: string[]
) => {
  return `
Judge the message and decide the function action to take.
Latest Message: ${message}

Options:
- simpleReply
- contractAnalysis
- ignore

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

--- OR ---

Message: Hey what is $MATRIX price?

Output:

{ "type": "contractAnalysis", "ticker": "MATRIX" }

Message: Hey what is $ETH price?

Output:

{ "type": "contractAnalysis", "ticker": "ETH" }

--- OR ---

Message: hi Mark

Output:

{ "type": "ignore" }

Message: hi

Output:

{ "type": "ignore" }

Message: ok thanks

Output:

{ "type": "ignore" }

Only reply if the latest message is directed to: ${character.name}. 
Reply if follow up question or reply to previousMessage context.

Previous messages for conversation context:
${previousMessages.join("\n")}

Only output the JSON.
`;
};

export const discordChannelReplyPrompt = (
  character: Character,
  message: string,
  username: string,
  previousChannelMessages: string[]
) => {
  return `
You have recived a discord message to reply to in a conversation.
Generate a unique discord channel reply in the voice and style of ${
    character.name
  }.
- Name ${character.name}
- Age: ${character.age}
- Bio: ${character.bio}
- Info: ${character.info}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Do not add commentary or acknowledge this request, just write the reply.
Brief, concise statements only. No not use emojis.
Feel more unique / personal.
If the user asks for code, you can output code inside \`\`\` \`\`\` triple brackets.

Message to reply to:
${message}

Username to reply to: ${username}

Avoid repeating previous messages or styles from previous messages. Previous message are NOT examples to follow.
Be varied in intro, style of speech. Very important to not copy message styles.
Do not intro with: "hey there", "hi", "hello", "how are you", "what's up", "how's it going", "what's new", "what's happening

Previous channel conversation messages for understanding what to reply to:
${previousChannelMessages.join("\n")}

Messages are organized oldest to latest.
`;
};

export const discordJudgeIfShouldReply = (
  character: Character,
  recentMessage: string,
  previousChannelMessages: string
) => {
  return `
Judge the recent message and decide if you should reply.
You should only reply if context of convo is directed at ${character.name}.

Most recent message:

${recentMessage}

Previous channel conversation messages for context:

${previousChannelMessages}

Output only TRUE or FALSE.
  `;
};

export const discordJudgeIsCryptoTalk = (message: string) => {
  return `
Judge the message and decide if the user is asking about a crypto token.
Token tickers are usually in the format $TOKEN. 
Only respond if using a $ in front of token name.
If they are asking about SAMI token, output FALSE.

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
- Info: ${character.info}
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
