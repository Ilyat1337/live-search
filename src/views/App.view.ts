import { Div, P, RxDiv, RxInput } from "reactronic-front";
import { AppModel, Tag } from "../models/App.model";
import styles from "./App.module.css";
import { SuggestionView } from "./Suggestion.view";

export function AppView(model: AppModel): void {
  Div("App", (e) => {
    model.appSensors.listen(e);

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

        e.eventInfo = { hover: new Tag("search box") };

        e.focus();
        e.value = model.filter;
        e.oninput = () => model.setFilter(e.value);
      });

      RxDiv("Suggestions", null, (e) => {
        model.suggestionsSensors.listen(e);

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
        e.eventInfo = { pointer: new Tag("hello") };

        e.className = styles.pointerInfo;

        const { pointer, hover } = model.appSensors;
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
