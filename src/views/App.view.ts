import { Div, P, RxDiv, RxInput } from "reactronic-front";
import { AppModel } from "../models/App.model";
import styles from "./App.module.css";
import { SuggestionView } from "./Suggestion.view";

export function AppView(model: AppModel): void {
  Div("App", (e) => {
    e.className = styles.app;

    P("Greeting", (e) => {
      e.className = styles.greeting;
      e.textContent = "Welcome!";
    });

    Div("Search", (e) => {
      e.className = styles.search;

      RxInput("Input", null, (e) => {
        e.className = styles.input;
        e.classList.toggle(
          styles.inputLoading,
          AppModel.loading.isActive || AppModel.input.isActive
        );

        e.focus();
        e.value = model.text;
        e.oninput = () => model.setText(e.value);
      });

      RxDiv("Suggestions", null, (e) => {
        e.className = styles.suggestions;

        if (model.isError) {
          P("Error", (e) => {
            e.className = styles.error;
            e.textContent = "Something went wrong...";
          });
        } else {
          model.suggestions.forEach(SuggestionView);
        }
      });
    });
  });
}
