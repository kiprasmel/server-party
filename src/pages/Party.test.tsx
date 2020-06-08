import React from "react";

import "@testing-library/jest-dom/extend-expect"; /** typescript, autocompletions et al */
import { render, fireEvent, waitFor, screen, CustomRenderOptions } from "../test-utils";

import { PartyServer } from "../models/PartyServer";
import { Party } from "./Party";

jest.mock("../utils/serverSorters.ts", () => {
	const originalModule = jest.requireActual("../utils/serverSorters.ts");

	return {
		...originalModule,
		/**
		 * always limit to maximum 3 sorters, since that's how many we use here in the tests.
		 *
		 * Having more than the tests are handling can instantly allow errors,
		 * i.e. off-by-one errors etc.
		 *
		 * For real usage outside the tests this has no impact,
		 * since we're just making sure that we are not leaving out
		 * anything in the tests.
		 */
		getDefaultServerSorters: () => originalModule.getDefaultServerSorters().splice(0, 3),
	};
});

jest.mock("../utils/fetchServers.ts", () => {
	const originalModule = jest.requireActual("../utils/auth.ts");

	return {
		...originalModule,
		fetchServers: jest.fn(
			async (): Promise<PartyServer[]> => [
				/**
				 * the *boring* layout... well, at least it's easy to test with:D
				 *
				 * The important thing to understand in these tests is
				 * that they work specifically with this data
				 * since you cannot have incremental IDs
				 * and indexes get re-ordered upon sorting.
				 *
				 * And that's not an issue - if the tests work with this data -
				 * everything else should work aswell.
				 */
				{ name: "AAA #1", distance: 10, id: 1, location: "AAA" },
				{ name: "MMM #10", distance: 100, id: 10, location: "MMM" },
				{ name: "ZZZ #100", distance: 1000, id: 100, location: "ZZZ" },
				// { name: "AAA #10", distance: 10, id: 10, location: "AAA" },
				// { name: "MMM #1", distance: 100, id: 1, location: "MMM" },
				// { name: "ZZZ #100", distance: 1000, id: 100, location: "ZZZ" },
			]
		),
	};
});

const renderParty = (opts: CustomRenderOptions = {}) => {
	const utils = render(<Party />, opts);

	return {
		...utils,
	};
};

describe("Party sorting", () => {
	describe("Order", () => {
		it("Can toggle order", async () => {
			renderParty();

			const first = (await screen.findByTestId(`order--nth-1`)) as HTMLButtonElement;

			expect(first.textContent).toBe("ASC 👆");

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;
			const server3 = (await screen.findByTestId("server-id--100")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");
			expect(server3.textContent).toBe("3");

			fireEvent.click(first);

			expect(first.textContent).toBe("DESC 👇");

			await waitFor(() => {
				expect(server1.textContent).toBe("3");
				expect(server2.textContent).toBe("2");
				expect(server3.textContent).toBe("1");
			});
		});
	});

	describe("Enabled", () => {
		it("Can toggle enabled", async () => {
			renderParty();

			const first = (await screen.findByTestId(`enabled--nth-1`)) as HTMLInputElement;
			const second = (await screen.findByTestId(`enabled--nth-2`)) as HTMLInputElement;
			const third = (await screen.findByTestId(`enabled--nth-3`)) as HTMLInputElement;

			expect(first).toBeChecked();
			expect(second).toBeChecked();
			expect(third).toBeChecked();

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;
			const server3 = (await screen.findByTestId("server-id--100")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");
			expect(server3.textContent).toBe("3");

			fireEvent.click(first);

			expect(first).not.toBeChecked();

			await waitFor(() => {
				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
				expect(server3.textContent).toBe("3");
			});

			fireEvent.click(second);

			expect(second).not.toBeChecked();

			await waitFor(() => {
				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
				expect(server3.textContent).toBe("3");
			});
		});
	});

	describe("Priority", () => {
		it("Has the sorters themselves sorted by priority", async () => {
			renderParty();

			const first = (await screen.findByTestId("priority--nth-1")) as HTMLSelectElement;
			const second = (await screen.findByTestId(`priority--nth-2`)) as HTMLSelectElement;
			const third = (await screen.findByTestId(`priority--nth-3`)) as HTMLSelectElement;

			expect(first.value).toBe("1");
			expect(second.value).toBe("2");
			expect(third.value).toBe("3");
		});

		it("Can increment the priority", async () => {
			renderParty();

			const first = (await screen.findByTestId("priority--nth-1")) as HTMLSelectElement;
			const second = (await screen.findByTestId(`priority--nth-2`)) as HTMLSelectElement;

			expect(first.value).toBe("1");
			expect(second.value).toBe("2");

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");

			const incrementBtn = screen.getByTestId(`priority--nth-1--incr`);

			fireEvent.click(incrementBtn);

			await waitFor(() => {
				expect(first.value).toBe("2");
				expect(second.value).toBe("1");

				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
			});
		});

		it("Can decrement the priority", async () => {
			renderParty();

			const first = (await screen.findByTestId("priority--nth-1")) as HTMLSelectElement;
			const second = (await screen.findByTestId(`priority--nth-2`)) as HTMLSelectElement;

			expect(first.value).toBe("1");
			expect(second.value).toBe("2");

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");

			const decrementBtn = screen.getByTestId(`priority--nth-2--decr`);

			fireEvent.click(decrementBtn);

			await waitFor(() => {
				expect(first.value).toBe("2");
				expect(second.value).toBe("1");

				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
			});
		});

		it("Can increment the priority by multiple", async () => {
			renderParty();

			const first = (await screen.findByTestId("priority--nth-1")) as HTMLSelectElement;
			const second = (await screen.findByTestId(`priority--nth-2`)) as HTMLSelectElement;
			const third = (await screen.findByTestId(`priority--nth-3`)) as HTMLSelectElement;

			expect(first.value).toBe("1");
			expect(second.value).toBe("2");
			expect(third.value).toBe("3");

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;
			const server3 = (await screen.findByTestId("server-id--100")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");
			expect(server3.textContent).toBe("3");

			fireEvent.change(first, { target: { value: 3 } });

			await waitFor(() => {
				expect(first.value).toBe("3");
				expect(second.value).toBe("1");
				expect(third.value).toBe("2");

				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
				expect(server3.textContent).toBe("3");
			});
		});

		it("Can decrement the priority by multiple", async () => {
			renderParty();

			const first = (await screen.findByTestId("priority--nth-1")) as HTMLSelectElement;
			const second = (await screen.findByTestId(`priority--nth-2`)) as HTMLSelectElement;
			const third = (await screen.findByTestId(`priority--nth-3`)) as HTMLSelectElement;

			expect(first.value).toBe("1");
			expect(second.value).toBe("2");
			expect(third.value).toBe("3");

			const server1 = (await screen.findByTestId("server-id--1")) as HTMLSpanElement;
			const server2 = (await screen.findByTestId("server-id--10")) as HTMLSpanElement;
			const server3 = (await screen.findByTestId("server-id--100")) as HTMLSpanElement;

			expect(server1.textContent).toBe("1");
			expect(server2.textContent).toBe("2");
			expect(server3.textContent).toBe("3");

			fireEvent.change(third, { target: { value: 1 } });

			await waitFor(() => {
				expect(first.value).toBe("2");
				expect(second.value).toBe("3");
				expect(third.value).toBe("1");

				expect(server1.textContent).toBe("1");
				expect(server2.textContent).toBe("2");
				expect(server3.textContent).toBe("3");
			});
		});
	});
});
