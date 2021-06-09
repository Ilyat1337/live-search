import {
  monitor,
  Monitor,
  ObservableObject,
  reaction,
  Reentrance,
  reentrance,
  standalone,
  throttling,
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
  public static readonly input = Monitor.create("Input", -1, 300);
  @unobservable public readonly suggestionSensors = new WebSensors();
  @unobservable public readonly tagSensors = new WebSensors();
  @unobservable public readonly inputSensors = new WebSensors();
  public text = "";
  public suggestions: SuggestionModel[] = [];
  public isError = false;
  public inputFocused = false;
  private currentSuggestion: SuggestionModel | null = null;

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

  @reaction
  private handlePointerClick(): void {
    const { pointer } = this.tagSensors;
    const infos = pointer.eventInfos;

    if (pointer.click === PointerButton.Left && infos.length > 0) {
      const tags = infos.map((x) => (x as Tag).name).join(", ");
      alert(tags);
    }
  }

  @reaction
  @throttling(0)
  @reentrance(Reentrance.WaitAndRestart)
  private handleTextChange(): void {
    const { down } = this.inputSensors.keyboard;

    if (down.length === 1 || down === "Backspace" || down === "Delete") {
      const input = this.inputSensors.currentEvent?.target as HTMLInputElement;
      this.setText(input.value);
    }
  }

  @transaction
  @monitor(AppModel.input)
  private setText(text: string): void {
    this.text = text;
  }
}
