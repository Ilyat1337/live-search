import { DATA } from "./Data";

export class SuggestionService {
  public static async getSuggestions(text: string): Promise<string[]> {
    const suggestions = DATA.filter((s) =>
      s.toLowerCase().startsWith(text.toLowerCase())
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!text.includes("error")) {
          resolve(suggestions);
        } else {
          reject(new Error("Error occurred"));
        }
      }, 500);
    });
  }
}
