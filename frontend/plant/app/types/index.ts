// Tripo types
// Reference: https://platform.tripo3d.ai/docs/generation
export interface ITripoQueueReq {
  type: "text_to_model";
  prompt: string; // Maximum prompt length is 1024 characters, and emojis and certain special Unicode characters are not supported.
  model_version?: "v2.0-20240919" | "v1.4-20240625" | "v1.3-20240522"; // Default version is v1.4-20240625
  negative_prompt?: string; // Unlike prompt, it provides a reverse direction to assist in generating content contrasting with the original prompt. The maximum length is 255 characters.
  image_seed?: number; // This is the random seed used for the process based on the prompt. This parameter is an integer and is randomly chosen if not set.
  model_seed?: number; // This is the random seed for model generation. In version v2.0-20240919, the seed controls the geometry generation process, ensuring identical models when the same seed is used. This parameter is an integer and is randomly chosen if not set.
  // More options for v2.0-20240919
  face_limit?: number; // Limits the number of faces on the output model. If this option is not set, the face limit will be adaptively determined.
  texture?: boolean; // A boolean option to enable texturing. The default value is True, set False to get a base model without any textures.
  pbr?: boolean; // A boolean option to enable pbr. The default value is True, set False to get a model without pbr. If this option is set to True, texture will be ignored and used as True.
  texture_seed?: number; //This is the random seed for texture generation in version v2.0-20240919. Using the same seed will produce identical textures. This parameter is an integer and is randomly chosen if not set. If you want a model with different textures, please use same model_seed and different texture_seed.
  texture_quality?: `detailed` | "standard"; // This parameter controls the texture quality. detailed provides high-resolution textures, resulting in more refined and realistic representation of intricate parts. This option is ideal for models where fine details are crucial for visual fidelity. The default value is standard.
  auto_size?: boolean; // Automatically scale the model to real-world dimensions, with the unit in meters. The default value is False.
  style?: "Cartoon" | "Christmas" | "Barbie" | "Clay" | "Steam Punk" | "Alien"; // Beta option. Defines the artistic style or transformation to be applied to the 3D model, altering its appearance according to preset options. Omit this option to keep the original style and apperance.
}

export interface ITripoQueueRes {
  taskId: string; // The identifier for the successfully submitted task.
}

export interface ITripoGetTaskResultReq {
  taskId: string; // The identifier for the task to be checked.
}

export interface ITripoGetTaskResultRes {
  task_id: string;
  type: "text_to_model";
  status: "queued" | "running" | "success" | "failed" | "cancelled" | "unknown";
  input: ITripoQueueReq;
  output: {
    model?: {
      type?: string;
      url?: string;
    };
    base_model?: {
      type?: string;
      url?: string;
    };
    pbr_model?: {
      type?: string;
      url?: string;
    };
    rendered_image?: {
      type?: string;
      url?: string;
    };
  };
  progress: number;
  create_time: number;
}

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
  // EUROPE = "Europe",
  UNITED_KINGDOM = "United Kingdom",
}

export enum EAmount {
  TEN = "10",
  FIFTY = "50",
}

export type TLeaderBoardDataItem = {
  // id: string;
  // attitude: unknown; // TODO: Need to assign correct type
  // character: {
  //   id: string;
  //   name: string;
  // };
  gardnerLevel: number;
  persona: {
    id: string;
    name: string;
    twitterAvatarUrl: string;
    twitterHandle: string;
  };
  // responses: unknown; // TODO: Need to assign correct type
  // rowSettings: {
  //   canOpen: boolean;
  //   canEdit: boolean;
  //   canHandle: boolean;
  //   canCancel: boolean;
  //   canCreateClientBlockade: boolean;
  //   canDelete: boolean;
  // };
  // shouldImportNewPosts: boolean;
  // shouldRespondMentions: boolean;
  // shouldRespondNewPosts: boolean;
  twitterRank: {
    id: string;
    rank: number;
    totalDepthScore: number;
    totalEngagementScore: number;
    totalLikes: number;
    totalMentions: number;
    totalMentionsScore: number;
    totalNoveltyScore: number;
    totalQualityScore: number;
    totalRelevanceScore: number;
    totalReplies: number;
    totalRetweets: number;
    totalScore: number;
    totalScoreTimeDecayed: number;
    totalSentimentScore: number;
    totalViews: number;
  };
};

export interface ILeaderBoardData {
  totalCount: number;
  items: TLeaderBoardDataItem[];
}

export type TLatestTweetsDataItem = {
  name: string;
  avatarUrl: string;
  bookmarkCount: number;
  handle: string;
  likes: number;
  replies: number;
  retweets: number;
  tweetDate: string;
  tweetText: string;
  tweetUrl: string;
  views: number;
};

export interface ILatestTweetsData {
  totalCount: number;
  items: TLatestTweetsDataItem[];
}

export type TSortDirection = "asc" | "desc" | "none";

export enum ELeaderBoardPageSize {
  TWENTY = 20,
  FIFTY = 50,
  HUNDRED = 100,
}
