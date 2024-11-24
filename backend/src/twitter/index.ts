import { Scraper } from "agent-twitter-client";
import { promises as fs } from "fs";
import dotenv from "dotenv";
import { generateTextFromPrompt } from "../ai";
import { newTweetLogPrompt, twitterPostPrompt } from "./prompts";
import sami from "../characters/sami";
import { pushActivityLog } from "../logs";

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
      return;
    } else {
      console.log("No cached cookies found, logging in...");
      await this.scraper.login(
        process.env.TWITTER_USERNAME!,
        process.env.TWITTER_PASSWORD!
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

  async getMyTweets(count: number) {
    return this.scraper.getTweets(process.env.TWITTER_USERNAME!, count);
  }
}

const startTweetLoop = async (twitterAgent: TwitterAgent) => {
  const intervalTimeout = 1000 * 60 * 60 * 1; // 1 hour

  const tweet = async () => {
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

    console.log("Generating tweet from prompt:", prompt);

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

    pushActivityLog(
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
      )?.text || ""
    );
  };

  await tweet();

  const interval = setInterval(async () => {
    try {
      await tweet();
    } catch (error) {
      console.error("Error in tweet loop:", error);
    }
  }, intervalTimeout);

  return interval;
};

async function twitterAgentInit() {
  const twitterAgent = new TwitterAgent();
  await twitterAgent.login();
  console.log("Twitter agent initialized");

  await startTweetLoop(twitterAgent);
}

export default twitterAgentInit;
