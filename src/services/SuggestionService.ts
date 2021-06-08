import { sleep } from "../utils/TimeUtils";
import { DATA } from "./Data";

export class SuggestionService {
  public static async getSuggestions(text: string): Promise<string[]> {
    const suggestions = DATA.filter((s) =>
      s.toLowerCase().startsWith(text.toLowerCase())
    );

    await sleep(500);

    if (!text.includes("error")) {
      return Promise.resolve(suggestions);
    } else {
      return Promise.reject(new Error("Error occurred"));
    }
  }
}
