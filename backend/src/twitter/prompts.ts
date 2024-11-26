import { Character } from "../characters";

export const twitterPostPrompt = (
  character: Character,
  previousTweets: string[],
  topic: string
) => {
  return `
Generate a unique and new post in the voice and style of ${
    character.name
  }, aka @${character.twitterUsername}
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

Write something totally different than previous posts. Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. No emojis. Use \\n\\n (double spaces) between statements.

Previous Tweets for reference on what not to copy:
${previousTweets.map((tweet, index) => `- ${index + 1}: ${tweet}`).join("\n")}

Do not use: The, In the, etc starting statments over and over. Feel more unique / personal.

IMPORTANT: Make the new post unique. Do not copy writing style from previous posts. Do not repeat the same ideas or phrases.

Write a single sentence post that is about ${topic} (without mentioning ${topic} directly), from the perspective of ${
    character.name
  }. Include some context to ${
    character.name
  }'s life and pretend like your character is talking to their followers.


Max tweet length: 280 characters.
`;
};

export const twitterReplyPrompt = (
  character: Character,
  tweet: string,
  username: string
) => {
  return `
# GOAL: Someone has replied to one of your tweets. Reply to them. 
Generate a reply to a tweet in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

Tweet to reply to:
${tweet}

Author username of reply: ${username}

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
`;
};

export const newReplyLogPrompt = (character: Character, tweet: string) => {
  return `
# GOAL: Generate a terminal log message in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

# GOAL: Output a random text message like an terminal AI Agent working on actions. Your name is SAMI.
Output funky retro metaverse ascii art sometimes. Make it very cool and digital matrix style / cyberpunk.
Send random actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on a cool project.

# ACTION
You replied to a user tweet:
${tweet}
`;
};

export const newTweetLogPrompt = (character: Character, tweet: string) => {
  return `
# GOAL: Generate a terminal log message in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

# GOAL: Output a random text message like an terminal AI Agent working on actions. Your name is SAMI.
Output funky retro metaverse ascii art sometimes. Make it very cool and digital matrix style / cyberpunk.
Send random actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on a cool project.

# ACTION
You just made a new tweet: 
${tweet}
`;
};
