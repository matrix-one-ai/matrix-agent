import { Character } from "../characters";

export const twitterPostPrompt = (
  character: Character,
  previousTweets: string[],
  topic: string
) => {
  return `
# GOAL: Generate a post in the voice and style of ${character.name}, aka @${
    character.twitterUsername
  }
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

# GOAL: Generate a post in the voice and style of ${character.name}, aka @${
    character.twitterUsername
  }
Write a single sentence post that is about ${topic} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Try to write something totally different than previous posts. Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. No emojis. Use \\n\\n (double spaces) between statements.

# GOAL: Make the post unique and diversifed from previous posts.
Previous Tweets:
${previousTweets
  .map((tweet, index) => `- Previous Tweet ${index + 1}: ${tweet}`)
  .join("\n")}

MAX_TWEET_LENGTH = 280;
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
