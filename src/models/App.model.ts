import {
  monitor,
  Monitor,
  ObservableObject,
  reaction,
  Reentrance,
  reentrance,
  transaction,
} from "reactronic";
import { SuggestionService } from "../services/SuggestionService";
import { SuggestionModel } from "./Suggestion.model";

export class AppModel extends ObservableObject {
  public static readonly loading = Monitor.create("Get Suggestions", 0, 0);
  public static readonly input = Monitor.create("Input", 0, 500);
  public text = "";
  public suggestions: SuggestionModel[] = [];
  public isError = false;
  public inputFocused = false;
  private currentSuggestion: SuggestionModel | null = null;

  @transaction
  @monitor(AppModel.input)
  @reentrance(Reentrance.WaitAndRestart)
  public async setText(text: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.text = text;
  }

  @reaction
  @monitor(AppModel.loading)
  private async getSuggestions(): Promise<void> {
    if (!AppModel.input.isActive) {
      this.isError = false;

      if (this.text !== "") {
        try {
          const suggestions = await SuggestionService.getSuggestions(this.text);
          this.suggestions = suggestions.map((s) => new SuggestionModel(s));
        } catch (error) {
          this.isError = true;
        }
      } else {
        this.suggestions = [];
      }
    }
  }

  @reaction
  private suggestionFocused(): void {
    this.suggestions.forEach((s) => s.focused);
    this.currentSuggestion = this.suggestions.find((s) => s.focused) ?? null;
  }

  @reaction
  private suggestionSelected(): void {
    if (this.currentSuggestion?.selected) {
      this.text = this.currentSuggestion.text;
      this.currentSuggestion.selected = false;
    }
  }
}
