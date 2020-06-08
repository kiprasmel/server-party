import React from "react";
import { History, createBrowserHistory } from "history";

import "@testing-library/jest-dom/extend-expect"; /** typescript, autocompletions et al */
import { render } from "../test-utils";

import { PrivateRoute } from "./PrivateRoute";
import { AuthDetails, getDefaultAuthDetails } from "../models/AuthDetails";

describe("PrivateRoute", () => {
	it("Redirects to Login if the user is not authorized", async () => {
		const isAuthenticated = false;
		const authDetails: AuthDetails = { ...getDefaultAuthDetails(), isAuthenticated };
		const history: History = createBrowserHistory();

		render(<PrivateRoute exact path="/private-route" component={() => <div>private route</div>} />, {
			authDetails,
			history,
		});

		history.push("/private-route");

		expect(history.location.pathname).toEqual("/login");
	});

	it("Does not redirect if the user is authorized", async () => {
		const isAuthenticated = true;
		const authDetails: AuthDetails = { ...getDefaultAuthDetails(), isAuthenticated };
		const history: History = createBrowserHistory();

		render(<PrivateRoute exact path="/private-route" component={() => <div>private route</div>} />, {
			authDetails,
			history,
		});

		history.push("/private-route");

		expect(history.location.pathname).toEqual("/private-route");
	});
});
