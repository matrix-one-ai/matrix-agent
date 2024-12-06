export enum EActivityLogModuleType {
  Twitter = "twitter",
  Discord = "discord",
}

export interface IActivityLog {
  moduleType: EActivityLogModuleType;
  title: string;
  description: string;
  timestamp: string;
  tweetId?: string;
}
