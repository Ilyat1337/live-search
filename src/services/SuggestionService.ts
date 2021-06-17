import { sleep } from "../utils/TimeUtils";
import { DATA } from "./Data";

export class SuggestionService {
  public static async getSuggestions(filter: string): Promise<string[]> {
    await sleep(500);
    if (filter.includes("error")) throw new Error("Error occurred");

    return DATA.filter((s) => s.toLowerCase().includes(filter.toLowerCase()));
  }
}
