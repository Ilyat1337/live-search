import { Transaction } from "reactronic";
import { AppModel } from "./models/App.model";
import "./style.css";
import { AppView } from "./views/App.view";

const model = Transaction.run(() => new AppModel());

AppView(model);
