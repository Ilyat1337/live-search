import { Div, P, RxDiv, RxInput } from "reactronic-front";
import { AppModel, Tag } from "../models/App.model";
import styles from "./App.module.css";
import { SuggestionView } from "./Suggestion.view";

export function AppView(model: AppModel): void {
  Div("App", (e) => {
    e.className = styles.app;

    model.tagSensors.listen(e);

    P("Greeting", (e) => {
      e.className = styles.greeting;
      e.textContent = "Welcome!";
    });

    Div("Search", (e) => {
      e.className = styles.search;

      RxInput("Input", null, (e) => {
        e.eventInfo = { keyboard: e };

        e.className = styles.input;
        e.classList.toggle(
          styles.inputLoading,
          AppModel.loading.isActive || AppModel.input.isActive
        );

        e.eventInfo = { hover: new Tag("search box") };

        e.focus();
        e.value = model.text;
        e.oninput = () => model.setText(e.value);
      });

      RxDiv("Suggestions", null, (e) => {
        model.suggestionSensors.listen(e);

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

      RxDiv("PointerInfo", null, (e) => {
        e.className = styles.pointerInfo;
        e.eventInfo = { pointer: new Tag("hello") };

        const { pointer, hover } = model.tagSensors;
        const tags = hover.eventInfos.map((x) => (x as Tag).name).join(", ");
        const x = Math.round(pointer.positionX);
        const y = Math.round(pointer.positionY);

        e.innerText = `Click me
        Pointer: (${x}, ${y})
        Hover: ${tags || "(none)"}
        `;
      });
    });
  });
}
