/**
 * https://testing-library.com/docs/react-testing-library/setup
 */

import React, { FC } from "react";
import { render, Queries, RenderOptions, queries } from "@testing-library/react";
import { Router } from "react-router-dom";
import { History, createBrowserHistory } from "history";

import { AuthContextProvider } from "./contexts/AuthContext";
import { localStorageAuthDetailsKey, AuthDetails } from "./models/AuthDetails";
import { getAuthDetails } from "./utils/auth";

/**
 * should mimic `AppOptions`.
 * We cannot extend from them since we're already extending another interface
 */
export interface CustomRenderOptions<Q extends Queries = typeof queries> extends RenderOptions<Q> {
	authDetailsLSKey?: string;
	authDetails?: AuthDetails;
	history?: History<History.PoorMansUnknown>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function customRender<Q extends Queries>(
	ui: React.ReactElement,
	{
		authDetailsLSKey = localStorageAuthDetailsKey,
		authDetails = getAuthDetails(authDetailsLSKey),
		history = createBrowserHistory(),
		...options
	}: CustomRenderOptions<Q> = {}
) {
	const AllTheProviders: FC = ({ children }) => (
		<AuthContextProvider authDetails={authDetails}>
			<Router history={history}>{children}</Router>
		</AuthContextProvider>
	);

	return render(ui, {
		wrapper: AllTheProviders,
		...options,
	});
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

// keep original
export { render as originalRender };
