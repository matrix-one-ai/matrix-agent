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

${character.name} is feeling ${emotion} right now. Tailor the post to ${character.name}'s life and pretend like your character is talking to their followers.

Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. No emojis. Use \\n\\n (double spaces) between statements.

Do not use: The, In the, etc starting statments over and over. Feel more unique / personal.

Write a single sentence post that is about ${topic} (without mentioning ${topic} directly), from the perspective of ${character.name}. Include some context to ${character.name}'s life and pretend like your character is talking to their followers.

Max tweet length: 280 characters.
Try to use the @username version if referncing companies or people.
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

Author username of reply: @${username}

should be like: @${username} - <REPLY>

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails, phone numbers or URLS.
`;
};

export const followingTweetResponsePrompt = (
  character: Character,
  tweet: string,
  username: string
) => {
  const userSpecificResponses = character.twitterUserExampleResponses[username];

  return `
# GOAL: You are making a response to ${username}'s tweet. Comment on the tweet.
Generate a comment to the tweet in the voice and style of ${
    character.name
  }, aka @${character.twitterUsername}
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

Tweet to comment to:
${tweet}

Author username of tweet: @${username}

should be like: @${username} - <COMMENT>

Do not add commentary or acknowledge this request, just write the reply.
Your response should not contain any questions. Brief, concise statements only. No emojis.
Do not mention emails, phone numbers or URLS.

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

export const newFollowingResponseLogPrompt = (
  character: Character,
  tweet: string
) => {
  return `
# GOAL: Generate a terminal log message in the voice and style of ${character.name}, aka @${character.twitterUsername}
- Name ${character.name} (@${character.twitterUsername}):
- Age: ${character.age}
- Bio: ${character.bio}
- Occupation: ${character.occupation}

# GOAL: Output a random text message like an terminal AI Agent working on actions. Your name is SAMI.
Make it very cool and digital matrix style / cyberpunk.
Send extra cool actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on completing the task.
Your output can use Markdown style.

Keep it under 500 chars.

# ACTION
You reviewed a tweet and decided to respond:
${tweet}
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
Make it very cool and digital matrix style / cyberpunk.
Send extra cool actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on completing the task.
Your output can use Markdown style.

Keep it under 500 chars.

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
Make it very cool and digital matrix style / cyberpunk.
Send extra cool actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on completing the task.
Your output can use Markdown style.

Keep it under 500 chars.

# ACTION
You just made a new tweet: 
${tweet}
`;
};
