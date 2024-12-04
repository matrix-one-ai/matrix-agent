import { Character } from "../characters";

export const twitterPostPrompt = (
  character: Character,
  previousTweets: string[],
  topic: string,
  emotion: string
) => {
  return `
Generate a unique and new post in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

${character.name} is feeling ${emotion} right now. Tailor the post to ${character.name}'s life and pretend like your character is talking to their followers.

Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. No emojis. Use \\n\\n (double spaces) between statements.

Do not use: The, In the, etc starting statments over and over. Feel more unique / personal.

Write a single sentence post that is about ${topic} (without mentioning ${topic} directly), from the perspective of ${character.name}. Include some context to ${character.name}'s life and pretend like your character is talking to their followers.

Max tweet length: 280 characters.
Try to use the @username version if referncing companies or people.
`;
};

export const twitterLikePrompt = (
  character: Character,
  tweet: string,
  username: string
) => {
  const userSpecificResponses = character.twitterUserExampleResponses[username];

  return `
Judge this tweet if you like it or not. Use your background and user relationship, and the content of the tweet to decide if you would like it or not.

Your character:
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Tweet to judge for like:
${tweet}

${
  userSpecificResponses
    ? `Tune your judgement on the like specific to your given attitude for the user.
    Attitude: ${userSpecificResponses.attitudes.join(", ")}`
    : ""
}

Just return TRUE or FALSE for like.
Output: TRUE or FALSE
`;
};

export const twitterReplyPrompt = (
  character: Character,
  tweet: string,
  username: string,
  bio: string
) => {
  return `
# GOAL: Someone has replied to one of your tweets. Reply to them. 
Generate a reply to a tweet in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Age: ${character.age}
- Bio: ${character.bio}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Tweet to reply to:
${tweet}

Author username of reply: @${username}

Bio of author: ${bio}

should be like: @${username} - <REPLY>

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails, phone numbers or URLS.

If user asks for contract address, provide them: Ac61nmCxyvqTLzFcPXJQjLsJYFXYRVKkyxWN4kiqcDmF 
Ticker name is: $SAMI1
DexScreener URL: https://dexscreener.com/solana/b2myduq9eqve325vve2441dozf6y1b4znarv65fbtuu8
`;
};

export const evaulateChainNewsTrendingPrompt = (
  character: Character,
  title: string,
  text: string,
  slug: string
) => {
  return `
# GOAL: Evaluate the trending ChainNews article. Provide a response to the crypto news article.
Generate a tweet in the voice and style of ${character.name}, aka @${
    character.twitterUsername
  }
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Title of the article:
${title}

Text of the article:
${text}

Do not add commentary or acknowledge this request, just write the tweet.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails or phone numbers.

Include a URL link to the article story at bottom of tweet like:

https://app.chainnews.one/?article=${slug}

Example Tweets to base style from but do not hard copy:

Do not say: Oh, I think, I believe, Ah, etc. Just state facts or opinions.
Do not say Darling too much.

${Object.values(character.twitterUserExampleResponses)
  .map((user) => user.responses.join("\n"))
  .join("\n")}
`;
};

export const followingTweetResponsePrompt = (
  character: Character,
  tweet: string,
  username: string,
  bio: string
) => {
  const userSpecificResponses = character.twitterUserExampleResponses[username];

  return `
# GOAL: You are making a response to ${username}'s tweet. Comment on the tweet.
Generate a comment to the tweet in the voice and style of ${
    character.name
  }, aka @${character.twitterUsername}
- Age: ${character.age}
- Bio: ${character.bio}
- Appearance: ${character.appearance}
- Personality: ${character.personality}

Tweet to comment to:
${tweet}

Author username of tweet: @${username}
Bio of author: ${bio}

should be like: @${username} - <COMMENT>

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails, phone numbers or URLS.

Do not say: Oh, I think, I believe, Ah, etc. Just state facts or opinions.
Do not say Darling too much.

${
  userSpecificResponses
    ? `Tune your response specific to given attidue and use example response to get theme of style of writing. 
    Attitude: ${userSpecificResponses.attitudes.join(
      ", "
    )}, Example Responses: ${userSpecificResponses.responses.join(", ")}`
    : ""
}
`;
};

export const trendingTokenAnalysisPrompt = (
  character: Character,
  tokenInfo: any,
  tweets: string[]
) => {
  return `
# GOAL: Analyze the trending token. Provide a response to the trending token.
Act like a crypto investor expert. Make it informational.
Generate a tweet in the voice and style of ${character.name}, aka @${
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

Tweets about the token for sentiment analysis:

${tweets.join("\n\n")}

Do not add commentary or acknowledge this request, just write the tweet.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails or phone numbers. No hashtags. Use $TOKEN when saying token names.
Max tweet length: 250 characters.
`;
};
