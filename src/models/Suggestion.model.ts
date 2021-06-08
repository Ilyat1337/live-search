import { ObservableObject, transaction, unobservable } from "reactronic";

export class SuggestionModel extends ObservableObject {
  private static nextId = 1;
  @unobservable public readonly text: string;
  @unobservable public readonly id: number;
  public focused = false;
  public selected = false;

  public constructor(text: string) {
    super();
    this.text = text;
    this.id = SuggestionModel.nextId++;
  }

  @transaction
  public focus(): void {
    this.focused = true;
  }

  @transaction
  public blur(): void {
    this.focused = false;
  }

  @transaction
  public select(): void {
    this.selected = true;
  }
}
