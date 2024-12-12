import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = () => {
  const results = [];
  const csvFilePath = path.resolve(__dirname, "sami.csv");
  const jsonFilePath = path.resolve(__dirname, "output.json");

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      const formattedResults = {
        twitterUserExampleResponses: results.reduce((acc, row) => {
          const account = row["X Accounts"].trim();
          if (!acc[account]) {
            acc[account] = {
              attitudes: [],
              responses: [],
            };
          }
          if (row["Tone of Voice"]) {
            acc[account].attitudes.push(row["Tone of Voice"]);
          }
          if (row["Example Tweets"]) {
            acc[account].responses.push(row["Example Tweets"]);
          }
          return acc;
        }, {}),
      };

      fs.writeFile(
        jsonFilePath,
        JSON.stringify(formattedResults, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing JSON file:", err);
          } else {
            console.log("JSON file has been saved.");
          }
        }
      );
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
};

main();
