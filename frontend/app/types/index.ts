export enum EActivityLogModuleType {
  Twitter = "twitter",
}

export interface IActivityLog {
  moduleType: EActivityLogModuleType;
  title: string;
  description: string;
  timestamp: string;
  tweetId?: string;
}
