import { ObservableObject, reaction, unobservable } from "reactronic";
import { WebSensors } from "reactronic-front";

export class SuggestionModel extends ObservableObject {
  private static nextId = 1;
  @unobservable public readonly text: string;
  @unobservable public readonly id: number;
  public selected = false;

  public constructor(text: string) {
    super();
    this.text = text;
    this.id = SuggestionModel.nextId++;
  }
}
