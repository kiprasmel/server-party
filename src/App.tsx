import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Party } from "./pages/Party";
import { PrivateRoute } from "./shared-components/PrivateRoute";
import { NotFound404 } from "./pages/NotFound404";

function App() {
	return (
		<>
			<Router>
				<Switch>
					<Route exact path="/" component={Landing} />

					<Route exact path="/login" component={Login} />

					<PrivateRoute
						exact
						path="/party"
						redirectHumanMsg="Looks like you'll have to login first!"
						component={Party}
					/>

					<Route component={NotFound404} />
				</Switch>
			</Router>
		</>
	);
}

export default App;
