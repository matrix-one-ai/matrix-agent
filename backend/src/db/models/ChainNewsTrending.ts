import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

class ChainNewsTrending extends Model {
  public id!: number;
  public newsId!: number;
  public title!: string;
  public slug!: string;
}

ChainNewsTrending.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    newsId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "chain_news_trending",
  }
);

export default ChainNewsTrending;
