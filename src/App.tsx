import React, { FC } from "react";
import { Router, Switch, Route } from "react-router-dom";

import { History, createBrowserHistory } from "history";
import { AuthContextProvider } from "./contexts/AuthContext";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Party } from "./pages/Party";
import { PrivateRoute } from "./shared-components/PrivateRoute";
import { NotFound404 } from "./pages/NotFound404";
import { AuthDetails, localStorageAuthDetailsKey } from "./models/AuthDetails";
import { getAuthDetails } from "./utils/auth";

interface AppOptions {
	authDetailsLSKey?: string;
	authDetails?: AuthDetails;
	history?: History<History.PoorMansUnknown>;
}

const App: FC<AppOptions> = ({
	authDetailsLSKey = localStorageAuthDetailsKey,
	authDetails = getAuthDetails(authDetailsLSKey),
	history = createBrowserHistory(),
}) => (
	<>
		<AuthContextProvider authDetails={authDetails}>
			<Router history={history}>
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
		</AuthContextProvider>
	</>
);

export default App;
