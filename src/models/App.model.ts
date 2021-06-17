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
import { PointerButton, WebSensors } from "reactronic-front";
import { SuggestionService } from "../services/SuggestionService";
import { SuggestionModel } from "./Suggestion.model";

export class Tag {
  constructor(public name: string) {}
}

export class AppModel extends ObservableObject {
  public static readonly loading = Monitor.create("Get Suggestions", 0, 0);
  public static readonly input = Monitor.create("Filter input", -1, 300);
  @unobservable public readonly appSensors = new WebSensors();
  // Separate sensors for catching keydown events from suggestions only
  @unobservable public readonly suggestionsSensors = new WebSensors();
  public filter = "";
  public suggestions: SuggestionModel[] = [];
  public isError = false;
  public inputFocused = false;
  private currentSuggestion: SuggestionModel | null = null;

  @transaction
  @monitor(AppModel.input)
  @reentrance(Reentrance.WaitAndRestart)
  public setFilter(text: string): void {
    this.filter = text;
  }

  @reaction
  @monitor(AppModel.loading)
  private async getSuggestions(): Promise<void> {
    if (!AppModel.input.isActive) {
      this.isError = false;

      try {
        const suggestions = await SuggestionService.getSuggestions(this.filter);
        this.suggestions = standalone(() =>
          this.createSuggestionModels(suggestions)
        );
      } catch (error) {
        this.isError = true;
      }
    }
  }

  @transaction
  private createSuggestionModels(suggestions: string[]): SuggestionModel[] {
    return suggestions.map((s) => new SuggestionModel(s));
  }

  @reaction
  private suggestionFocused(): void {
    const { focus, currentEvent } = this.appSensors;
    focus.revision;

    if (currentEvent?.type === "focusin" && focus.eventInfos.length > 0) {
      const { eventInfos } = focus;
      if (eventInfos.length > 0) {
        const model = eventInfos[0] as SuggestionModel;
        this.currentSuggestion = model;
      }
    }
  }

  @reaction
  private suggestionSelected(): void {
    if (this.currentSuggestion?.selected) {
      this.filter = this.currentSuggestion.text;
      this.currentSuggestion.selected = false;
    }
  }

  @reaction
  private suggestionKeydown(): void {
    if (this.suggestionsSensors.keyboard.down === "Enter") {
      this.suggestionsSensors.stopPropagation();

      const { eventInfos } = this.suggestionsSensors.keyboard;
      if (eventInfos.length > 0) {
        const model = eventInfos[0] as SuggestionModel;
        model.selected = true;
      }
    }
  }

  @reaction
  private handlePointerClick(): void {
    const { pointer } = this.appSensors;
    const infos = pointer.eventInfos;

    if (pointer.click === PointerButton.Left && infos.length > 0) {
      const tags = infos.map((x) => (x as Tag).name).join(", ");
      alert(tags);
    }
  }
}
