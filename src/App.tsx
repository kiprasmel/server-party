import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Login } from "./pages/Login";

function App() {
	return (
		<>
			<Router>
				<div>
					<Switch>
						{/* TODO Landing? */}
						<Route path="/" component={Login} />

						<Route exact path="/login" component={Login} />
					</Switch>
				</div>
			</Router>
		</>
	);
}

export default App;
