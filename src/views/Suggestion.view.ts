import { RxP } from "reactronic-front";
import { Tag } from "../models/App.model";
import { SuggestionModel } from "../models/Suggestion.model";
import styles from "./Suggestion.module.css";

export function SuggestionView(model: SuggestionModel): void {
  RxP(`Suggestion-${model.id}`, null, (e) => {
    model.sensors.listen(e);

    e.eventInfo = { focus: model, hover: new Tag(model.text) };

    e.className = styles.suggestion;
    e.textContent = model.text;
    e.tabIndex = 0;
  });
}
