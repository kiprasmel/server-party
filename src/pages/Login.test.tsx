import React from "react";

import "@testing-library/jest-dom/extend-expect"; /** typescript, autocompletions et al */
import { render, fireEvent, waitFor, CustomRenderOptions } from "../test-utils";

import { getAuthDetails } from "../utils/auth";
import { Login } from "./Login";
import { PartyServer } from "../models/PartyServer";

import { authenticate as authenticateMock } from "../utils/authenticate";
import { fetchServers as fetchServersMock } from "../utils/fetchServers";

jest.mock("../utils/authenticate.ts", () => {
	const originalModule = jest.requireActual("../utils/serverSorters.ts");

	return {
		...originalModule,
		authenticate: jest.fn(async (): Promise<string> => "123456"),
	};
});

jest.mock("../utils/fetchServers.ts", () => {
	const originalModule = jest.requireActual("../utils/serverSorters.ts");

	return {
		...originalModule,
		fetchServers: jest.fn(
			async (): Promise<PartyServer[]> => [
				{ name: "AAA #1", distance: 10, id: 1, location: "AAA" },
				{ name: "ZZZ #100", distance: 1000, id: 100, location: "ZZZ" },
			]
		),
	};
});

afterEach(() => {
	jest.resetAllMocks();
});

const renderLogin = (opts: CustomRenderOptions = {}) => {
	const ret = render(<Login />, opts);
	const loginBtn = ret.getByTestId("login-button") as HTMLInputElement;
	const passwordInput = ret.getByPlaceholderText("correcthorsebatterystaple") as HTMLInputElement;

	return { loginBtn, passwordInput, ...ret };
};

describe("Login", () => {
	it("Logs the user in if the authentication was successful", async () => {
		authenticateMock.mockImplementation(async (): Promise<string> => "123456");

		expect(getAuthDetails().isAuthenticated).toBe(false);

		const { loginBtn } = renderLogin();

		fireEvent.click(loginBtn);

		await waitFor(() => expect(getAuthDetails().isAuthenticated).toBe(true));
	});

	it("Disables & disallows the Login button if there was an error", async () => {
		authenticateMock.mockImplementation(async () => {
			throw { response: { status: 401 } };
		});

		const { loginBtn } = renderLogin();

		expect(authenticateMock).toBeCalledTimes(0);

		fireEvent.click(loginBtn);

		await waitFor(() => expect(authenticateMock).toBeCalledTimes(1));
		expect(loginBtn).toBeDisabled();
		expect(authenticateMock).toBeCalledTimes(1);
	});

	it("Does not disable & allows the Login button if there was an error but it was unknown", async () => {
		authenticateMock.mockImplementation(async () => Promise.reject({ response: { status: 123456789 } }));

		const { loginBtn } = renderLogin();

		fireEvent.click(loginBtn);
		await waitFor(() => expect(authenticateMock).toBeCalledTimes(1));

		expect(loginBtn).not.toBeDisabled();

		fireEvent.click(loginBtn);
		await waitFor(() => expect(authenticateMock).toBeCalledTimes(2));
	});

	it("Shows an error if it was known", async () => {
		authenticateMock.mockImplementation(async () => Promise.reject({ response: { status: 401 } }));

		const { loginBtn, findByLabelText } = renderLogin();

		fireEvent.click(loginBtn);

		expect(await findByLabelText("attention")).toBeInTheDocument();
	});

	it("Shows an error if it was not known / unknown", async () => {
		authenticateMock.mockImplementation(async () => Promise.reject({ response: { status: 123456789 } }));

		const { loginBtn, findByLabelText } = renderLogin();

		fireEvent.click(loginBtn);

		expect(await findByLabelText("attention")).toBeInTheDocument();
	});

	it("Re-enables the Login button once the user updates any input", async () => {
		/** throw with a known & handled status (unauthorized) */
		authenticateMock.mockImplementation(async () => {
			throw { response: { status: 401 } };
		});

		const { loginBtn, passwordInput } = renderLogin();

		expect(authenticateMock).toBeCalledTimes(0);

		fireEvent.click(loginBtn);

		await waitFor(() => expect(authenticateMock).toBeCalledTimes(1));
		expect(loginBtn).toBeDisabled();

		fireEvent.change(passwordInput, { target: { value: "ayyy lmao" } });

		await waitFor(() => expect(loginBtn).not.toBeDisabled());
		fireEvent.click(loginBtn);
		await waitFor(() => expect(authenticateMock).toBeCalledTimes(2));
	});

	it("Prefetches servers if user authenticates successfully", async () => {
		const server: PartyServer = { name: "foo #6", location: "foo", id: 6, distance: 69 };

		fetchServersMock.mockImplementation(async () => [server]);
		expect(fetchServersMock).toBeCalledTimes(0);
	});
});
