import { Scraper } from "agent-twitter-client";
import { promises as fs } from "fs";
import dotenv from "dotenv";
import { generateTextFromPrompt } from "../ai";
import {
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

  async postTweet(text: string) {
    return this.scraper.sendTweet(text);
  }

  async replyToTweet(text: string, tweetId: string) {
    return this.scraper.sendTweet(text, tweetId);
  }

  async getMyTweets(count: number) {
    return this.scraper.getTweets(process.env.TWITTER_USERNAME!, count);
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

  async getUnrepliedConversations(tweetId: string) {
    // Fetch the original tweet to get the conversation_id
    const originalTweet = await userClient.v2.singleTweet(tweetId, {
      "tweet.fields": ["conversation_id"],
    });

    const conversationId = originalTweet.data.conversation_id;

    if (!conversationId) {
      throw new Error("Conversation ID not found.");
    }

    const myUserId = this.userId;

    const allTweetsInConversation: TweetV2[] = [];
    let nextToken: string | undefined = undefined;

    do {
      // Fetch tweets in the conversation with pagination
      const response: any = await userClient.v2.search(
        `conversation_id:${conversationId}`,
        {
          expansions: ["author_id", "referenced_tweets.id"],
          "tweet.fields": [
            "author_id",
            "referenced_tweets",
            "text",
            "created_at",
          ],
          next_token: nextToken,
        }
      );

      if (response.tweets) {
        allTweetsInConversation.push(...response.tweets);
      }

      nextToken = response.meta?.next_token;
    } while (nextToken);

    // Collect all tweets authored by you (your replies)
    const userReplies = allTweetsInConversation.filter(
      (tweet) => tweet.author_id === myUserId
    );

    // Build a set of tweet IDs that you've replied to
    const repliedToTweetIds = new Set<string>();
    for (const tweet of userReplies) {
      if (tweet.referenced_tweets) {
        for (const ref of tweet.referenced_tweets) {
          console.log(ref);
          if (ref.type === "replied_to") {
            repliedToTweetIds.add(ref.id);
          }
        }
      }
    }

    // Identify tweets not authored by you and not replied to by you
    const unrepliedTweets = allTweetsInConversation.filter((tweet) => {
      return tweet.author_id !== myUserId && !repliedToTweetIds.has(tweet.id);
    });

    return unrepliedTweets;
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
      max_results: 100, // Adjust as needed
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
      max_results: 100, // Adjust as needed
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

  async getTweetReplies(tweetId: string) {
    // Fetch the original tweet to get the conversation_id and author_id
    const originalTweet = await userClient.v2.singleTweet(tweetId, {
      "tweet.fields": ["conversation_id", "author_id"],
    });

    const conversationId = originalTweet.data.conversation_id;
    const originalAuthorId = originalTweet.data.author_id;

    if (!conversationId) {
      throw new Error("Conversation ID not found.");
    }

    // Search for all tweets in the conversation excluding the original author's tweets
    const searchResults = await userClient.v2.search(
      `conversation_id:${conversationId} -from:${originalAuthorId}`,
      {
        expansions: ["author_id"],
        "tweet.fields": [
          "author_id",
          "in_reply_to_user_id",
          "text",
          "created_at",
        ],
        "user.fields": ["username", "name"],
      }
    );

    // Process and display the replies
    for (const tweet of searchResults.tweets) {
      console.log(`Reply from @${tweet.author_id}: ${tweet.text}`);
    }

    return searchResults.tweets.filter(
      (tweet) =>
        tweet.in_reply_to_user_id === originalAuthorId &&
        tweet.author_id !== originalAuthorId
    );
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
        sami.topics[Math.floor(Math.random() * sami.topics.length)]
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

async function twitterAgentInit() {
  const twitterAgent = new TwitterAgent();
  await twitterAgent.login();
  console.log("Twitter agent initialized");

  await startTweetLoop(twitterAgent);
  await startCommentResponseLoop(twitterAgent);
}

export default twitterAgentInit;
