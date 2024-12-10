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

export enum ERelationship {
  Friend = "Friend",
  Family = "Family",
  Partner = "Partner",
  Colleague = "Colleague",
  Other = "Other",
}

export enum ECountries {
  USA = "United States",
  CANADA = "Canada",
  EUROPE = "Europe",
  UNITED_KINGDOM = "United Kingdom",
}

export enum EAmount {
  TEN = "10",
  FIFTY = "50",
}
