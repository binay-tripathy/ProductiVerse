import ReactDOM from "react-dom/client";
import "./index.scss";
import 'react-circular-progressbar/dist/styles.css';
import App from "./App";
import { HashRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HashRouter>
      <App />
    </HashRouter>
);
