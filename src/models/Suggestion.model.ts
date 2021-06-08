import { ObservableObject, reaction, unobservable } from "reactronic";
import { WebSensors } from "reactronic-front";

export class SuggestionModel extends ObservableObject {
  private static nextId = 1;
  @unobservable public readonly text: string;
  @unobservable public readonly id: number;
  @unobservable public readonly sensors = new WebSensors();
  public selected = false;

  public constructor(text: string) {
    super();
    this.text = text;
    this.id = SuggestionModel.nextId++;
  }

  @reaction
  private keyPressed(): void {
    if (this.sensors.keyboard.down === "Enter") {
      this.sensors.stopPropagation();
      this.selected = true;
    }
  }
}
