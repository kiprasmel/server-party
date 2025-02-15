/** Begin MUST be the first imports */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
/** End MUST be the first imports */

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/styles.generated.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
