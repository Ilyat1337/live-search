import { RxP } from "reactronic-front";
import { Tag } from "../models/App.model";
import { SuggestionModel } from "../models/Suggestion.model";
import styles from "./Suggestion.module.css";

export function SuggestionView(model: SuggestionModel): void {
  RxP(`Suggestion-${model.id}`, null, (e) => {
    e.className = styles.suggestion;
    e.classList.toggle(styles.selected, model.focused);
    e.textContent = model.text;
    e.tabIndex = 0;

    e.eventInfo = { hover: new Tag(model.text) }

    e.onfocus = () => model.focus();
    e.onblur = () => model.blur();
    e.onkeypress = (e) => {
      if (e.key === "Enter") model.select();
    };
  });
}
