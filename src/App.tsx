import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Party } from "./pages/Party";

function App() {
	return (
		<>
			<Router>
				<Switch>
					<Route exact path="/" component={Landing} />

					<Route exact path="/login" component={Login} />

					<Route exact path="/party" component={Party} />
				</Switch>
			</Router>
		</>
	);
}

export default App;
