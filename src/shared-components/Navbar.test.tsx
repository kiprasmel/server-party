import React from "react";
import { History, createBrowserHistory } from "history";

import "@testing-library/jest-dom/extend-expect"; /** typescript, autocompletions et al */
import { render, fireEvent, waitFor, CustomRenderOptions } from "../test-utils";

import { Navbar } from "./Navbar";
import { getAuthDetails } from "../utils/auth";
import { getDefaultAuthDetails } from "../models/AuthDetails";

const renderNavbar = (opts: CustomRenderOptions = {}) => {
	const utils = render(<Navbar />, { ...opts });
	const logInOrOffBtn = utils.getByText(/log (in|off)/i);

	return { logInOrOffBtn, ...utils };
};

describe("Navbar", () => {
	it("Redirects you to Login upon request", async () => {
		const history: History = createBrowserHistory();

		const { logInOrOffBtn } = renderNavbar({ history });

		fireEvent.click(logInOrOffBtn);

		expect(history.location.pathname).toBe("/login");
	});

	it("Has less distractions in distractionless mode", async () => {
		const { rerender, logInOrOffBtn } = renderNavbar();

		expect(logInOrOffBtn).toBeInTheDocument();

		rerender(<Navbar distractionless />);

		expect(logInOrOffBtn).not.toBeInTheDocument();
	});

	it("Logs you out to Landing upon request", async () => {
		const isAuthenticated = true;
		const { logInOrOffBtn } = renderNavbar({ authDetails: { ...getDefaultAuthDetails(), isAuthenticated } });

		fireEvent.click(logInOrOffBtn);

		await waitFor(() => expect(getAuthDetails().isAuthenticated).toBe(false));
	});
});
