import {
  monitor,
  Monitor,
  ObservableObject,
  reaction,
  Reentrance,
  reentrance,
  standalone,
  transaction,
  unobservable,
} from "reactronic";
import { WebSensors } from "reactronic-front";
import { SuggestionService } from "../services/SuggestionService";
import { SuggestionModel } from "./Suggestion.model";

export class AppModel extends ObservableObject {
  public static readonly loading = Monitor.create("Get Suggestions", 0, 0);
  public static readonly input = Monitor.create("Input", -1, 300);
  @unobservable public readonly suggestionSensors = new WebSensors();
  @unobservable public readonly inputSensors = new WebSensors();
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
          this.suggestions = standalone(() =>
            this.createSuggestionModels(suggestions)
          );
        } catch (error) {
          this.isError = true;
        }
      } else {
        this.suggestions = [];
      }
    }
  }

  @transaction
  private createSuggestionModels(suggestions: string[]): SuggestionModel[] {
    return suggestions.map((s) => new SuggestionModel(s));
  }

  @reaction
  private suggestionFocused(): void {
    const { focus, currentEvent } = this.suggestionSensors;
    focus.revision;

    if (currentEvent?.type === "focusin" && focus.eventInfos.length > 0) {
      const model = focus.eventInfos[0] as SuggestionModel;
      this.currentSuggestion = model;
    }
  }

  @reaction
  private suggestionSelected(): void {
    if (this.currentSuggestion?.selected) {
      this.text = this.currentSuggestion.text;
      this.currentSuggestion.selected = false;
    }
  }
}
