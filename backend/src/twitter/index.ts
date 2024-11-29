import { Scraper } from "agent-twitter-client";
import { promises as fs } from "fs";
import dotenv from "dotenv";
import { generateTextFromPrompt } from "../ai";
import {
  followingTweetResponsePrompt,
  newFollowingResponseLogPrompt,
  newReplyLogPrompt,
  newTweetLogPrompt,
  twitterPostPrompt,
  twitterReplyPrompt,
} from "./prompts";
import sami from "../characters/sami";
import { pushActivityLog } from "../logs";
import { TweetV2, TwitterApi } from "twitter-api-v2";

const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET_KEY!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

dotenv.config();

const COOKIE_PATH = "src/twitter/cookies.txt";

class TwitterAgent {
  private scraper: Scraper;
  public userId: string | null = null;

  constructor() {
    this.scraper = new Scraper();
  }

  async getCookies() {
    return this.scraper.getCookies();
  }

  async cacheCookies() {
    try {
      const cookies = await this.getCookies();
      await fs.writeFile(COOKIE_PATH, cookies.join("\n"), "utf-8");
      console.log("Cookies cached successfully.");
    } catch (error) {
      console.error("Error caching cookies:", error);
    }
  }

  async getCachedCookies() {
    try {
      const data = await fs.readFile(COOKIE_PATH, "utf-8");
      const cookies = data.split("\n").filter((cookie) => cookie.trim() !== "");
      return cookies;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await fs.writeFile(COOKIE_PATH, "", "utf-8");
        console.log("Created new cookies file.");
        return [];
      } else {
        console.error("Error reading cookies:", error);
        return [];
      }
    }
  }

  async login() {
    const cachedCookies = await this.getCachedCookies();
    if (cachedCookies?.length > 0) {
      await this.scraper.setCookies(cachedCookies);
      console.log("Using cached cookies for twitter login");
    } else {
      console.log("No cached cookies found, logging in...");
      await this.scraper.login(
        process.env.TWITTER_USERNAME!,
        process.env.TWITTER_PASSWORD!,
        undefined,
        undefined,
        process.env.TWITTER_API_KEY!,
        process.env.TWITTER_API_SECRET_KEY!,
        process.env.TWITTER_ACCESS_TOKEN!,
        process.env.TWITTER_ACCESS_TOKEN_SECRET!
      );
      await this.cacheCookies();
    }
    this.userId = await this.scraper.getUserIdByScreenName(
      process.env.TWITTER_USERNAME!
    );
    console.log("Logged in as:", process.env.TWITTER_USERNAME, this.userId);
  }

  async followUser(userId: string) {
    return this.scraper.followUser(userId);
  }

  async getMyFollowings() {
    return this.scraper.getFollowing(this.userId!, 100);
  }

  async postTweet(text: string) {
    return this.scraper.sendTweet(text);
  }

  async replyToTweet(text: string, tweetId: string) {
    return this.scraper.sendTweet(text, tweetId);
  }

  async getMyTweets(count: number) {
    return this.scraper.getTweets(process.env.TWITTER_USERNAME!, count);
  }

  async getUserTweets(username: string, count: number) {
    return this.scraper.getTweets(username, count);
  }

  async getTweet(tweetId: string) {
    return this.scraper.getTweet(tweetId);
  }

  async getTweetV2(tweetId: string) {
    return this.scraper.getTweetV2(tweetId, {
      expansions: [
        "author_id",
        "in_reply_to_user_id",
        "referenced_tweets.id",
        "referenced_tweets.id.author_id",
      ],
      tweetFields: [
        "conversation_id",
        "in_reply_to_user_id",
        "author_id",
        "text",
      ],
      userFields: ["username", "name", "profile_image_url"],
    });
  }

  async getUserById(userId: string) {
    const user = await userClient.v2.user(userId, {
      "user.fields": [
        "username",
        "name",
        "profile_image_url",
        "location",
        "description",
      ],
    });
    return user.data;
  }

  async getTweetsAndRepliesV2() {
    return this.scraper.getTweetsAndReplies(process.env.TWITTER_USERNAME!);
  }

  async getTweetsWithReplies() {
    const timeline = this.scraper.getTweets(process.env.TWITTER_USERNAME!, 100);
    const tweets = await this.scraper.getTweetsWhere(
      timeline,
      (tweet) => (tweet?.replies || 0) > 0
    );
    return tweets;
  }

  async searchTweets(query: string) {
    return userClient.v2.search(query, {
      "tweet.fields": ["conversation_id", "author_id", "referenced_tweets"],
      "user.fields": ["username"],
      max_results: 100,
    });
  }

  async getUserIdByUsername(username: string) {
    const userId = await this.scraper.getUserIdByScreenName(username);
    return userId;
  }

  async getUnrepliedMentions() {
    const myUserId = this.userId!;

    // Initialize array to collect mentions
    const mentions: TweetV2[] = [];

    // Fetch the initial page of mentions
    let paginator = await userClient.v2.userMentionTimeline(myUserId, {
      expansions: ["author_id", "referenced_tweets.id"],
      "tweet.fields": [
        "conversation_id",
        "referenced_tweets",
        "in_reply_to_user_id",
      ],
      "user.fields": ["username"],
      max_results: 100,
    });

    // Iterate through the paginator to collect all mentions
    for await (const tweet of paginator) {
      mentions.push(tweet);
    }

    // Build a set of IDs of tweets you've replied to
    const mentionTweetIds = mentions.map((tweet) => tweet.id);

    // Fetch your own replies to these mentions
    const myReplies: TweetV2[] = [];
    let repliesPaginator = await userClient.v2.userTimeline(myUserId, {
      expansions: ["referenced_tweets.id"],
      "tweet.fields": ["referenced_tweets"],
      max_results: 100,
    });

    // Iterate through the paginator to collect all replies
    for await (const tweet of repliesPaginator) {
      if (tweet.referenced_tweets) {
        for (const ref of tweet.referenced_tweets) {
          if (ref.type === "replied_to" && mentionTweetIds.includes(ref.id)) {
            myReplies.push(tweet);
          }
        }
      }
    }

    // Build a set of tweet IDs that you've replied to
    const repliedToTweetIds = new Set<string>();
    for (const tweet of myReplies) {
      if (tweet.referenced_tweets) {
        for (const ref of tweet.referenced_tweets) {
          if (ref.type === "replied_to") {
            repliedToTweetIds.add(ref.id);
          }
        }
      }
    }

    // Filter out mentions you've already replied to
    const unrepliedMentions = mentions.filter(
      (tweet) =>
        !repliedToTweetIds.has(tweet.id) && tweet.author_id !== myUserId
    );

    return unrepliedMentions;
  }
}

const startTweetLoop = async (twitterAgent: TwitterAgent) => {
  const intervalTimeout = 1000 * 60 * 60 * 1; // 1 hour

  const main = async () => {
    try {
      const tweets = await twitterAgent.getMyTweets(5);
      const recentTweets = [];

      for await (const tweet of tweets) {
        if (!tweet.text) {
          continue;
        }
        recentTweets.push(tweet.text);
      }

      const prompt = twitterPostPrompt(
        sami,
        recentTweets,
        sami.topics[Math.floor(Math.random() * sami.topics.length)],
        sami.emotions[Math.floor(Math.random() * sami.emotions.length)]
      );

      const tweet = await generateTextFromPrompt(prompt, "gpt-4o", {
        temperature: 0.8,
        frequencyPenalty: 1,
        presencePenalty: 1,
      });

      if (!tweet?.text) {
        console.error("Error generating tweet");
        return;
      }

      await twitterAgent.postTweet(tweet?.text);

      console.log("Tweet posted:", tweet?.text);

      pushActivityLog({
        moduleType: "twitter",
        title: "New Tweet",
        description:
          (
            await generateTextFromPrompt(
              newTweetLogPrompt(sami, tweet?.text),
              "gpt-4o",
              {
                temperature: 0.5,
                frequencyPenalty: 1,
                presencePenalty: 1,
              }
            )
          )?.text || "",
      });
    } catch (error) {
      console.error("Error in tweet loop:", error);
    }
  };

  await main();

  const interval = setInterval(async () => {
    await main();
  }, intervalTimeout);

  return interval;
};

const startCommentResponseLoop = async (twitterAgent: TwitterAgent) => {
  const intervalTimeout = 1000 * 60 * 60 * 0.5; // 30 minutes

  const main = async () => {
    try {
      const unrepliedMentions = await twitterAgent.getUnrepliedMentions();

      console.log("Unreplied mentions:", unrepliedMentions);

      for (const mention of unrepliedMentions) {
        const user = await twitterAgent.getUserById(mention.author_id!);

        const prompt = twitterReplyPrompt(sami, mention.text, user.username);

        const replyTweet = await generateTextFromPrompt(prompt, "gpt-4o", {
          temperature: 0.8,
          frequencyPenalty: 1,
          presencePenalty: 1,
        });

        if (!replyTweet?.text) {
          console.error("Error generating reply tweet");
          continue;
        }

        await twitterAgent.replyToTweet(replyTweet?.text, mention.id!);

        console.log("Replied:", replyTweet?.text);

        pushActivityLog({
          moduleType: "twitter",
          title: "New Reply",
          description:
            (
              await generateTextFromPrompt(
                newReplyLogPrompt(sami, replyTweet?.text),
                "gpt-4o",
                {
                  temperature: 0.5,
                  frequencyPenalty: 1,
                  presencePenalty: 1,
                }
              )
            )?.text || "",
        });
      }
    } catch (error) {
      console.error("Error in comment response loop:", error);
    }
  };

  await main();

  const interval = setInterval(async () => {
    await main();
  }, intervalTimeout);

  return interval;
};

const startFollowingTweetResponses = async (twitterAgent: TwitterAgent) => {
  const intervalTimeout = 1000 * 60 * 60 * 0.5; // 30 minutes

  const hasRepliedToTweet = async (
    conversationId: string,
    myUsername: string
  ) => {
    const searchQuery = `conversation_id:${conversationId} from:${myUsername}`;
    const searchResults = await twitterAgent.searchTweets(searchQuery);
    for (const tweet of searchResults) {
      if (tweet.author_id === twitterAgent.userId) {
        return true;
      }
    }
  };

  const main = async () => {
    try {
      const myFollowing = await twitterAgent.getMyFollowings();

      for await (const user of myFollowing) {
        const tweets = await twitterAgent.getUserTweets(user.username!, 5);

        for await (const tweet of tweets) {
          if (!tweet.text) {
            continue;
          }

          // Skip tweets that are replies
          if (tweet.isReply) {
            continue;
          }

          // Skip tweets that are retweets
          if (tweet.isRetweet) {
            continue;
          }

          // Skip tweets already replied to by me
          if (
            await hasRepliedToTweet(tweet.conversationId!, twitterAgent.userId!)
          ) {
            console.log("Already replied to tweet:", tweet.text);
            continue;
          }

          const tweetResponsePrompt = followingTweetResponsePrompt(
            sami,
            tweet.text,
            user.username!
          );

          const responseTweet = await generateTextFromPrompt(
            tweetResponsePrompt,
            "gpt-4o",
            {
              temperature: 0.8,
              frequencyPenalty: 1,
              presencePenalty: 1,
            }
          );

          if (!responseTweet?.text) {
            console.error("Error generating response tweet");
            continue;
          }

          await twitterAgent.replyToTweet(responseTweet?.text, tweet.id!);

          console.log(
            "Responded to tweet:",
            user.username,
            responseTweet?.text
          );

          pushActivityLog({
            moduleType: "twitter",
            title: "New Following Tweet Response",
            description:
              (
                await generateTextFromPrompt(
                  newFollowingResponseLogPrompt(
                    sami,
                    `@${tweet.username} - ${responseTweet?.text}`
                  ),
                  "gpt-4o",
                  {
                    temperature: 0.5,
                    frequencyPenalty: 1,
                    presencePenalty: 1,
                  }
                )
              )?.text || "",
          });
        }
      }
    } catch (error) {
      console.error("Error in comment response loop:", error);
    }
  };

  await main();

  const interval = setInterval(async () => {
    await main();
  }, intervalTimeout);

  return interval;
};

// const syncFollows = async (twitterAgent: TwitterAgent) => {
//   const users = Object.keys(sami.twitterUserExampleResponses);
//   for (const username of users) {
//     const userId = await twitterAgent.getUserIdByUsername(username);
//     console.log(userId)
//     await twitterAgent.followUser(userId!);
//   }
// };

async function twitterAgentInit() {
  const twitterAgent = new TwitterAgent();
  await twitterAgent.login();
  console.log("Twitter agent initialized");

  await startTweetLoop(twitterAgent);
  await startCommentResponseLoop(twitterAgent);
  await startFollowingTweetResponses(twitterAgent);

  // await syncFollows(twitterAgent);
}

export default twitterAgentInit;
