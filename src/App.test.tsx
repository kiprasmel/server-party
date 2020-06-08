import React from "react";

import "@testing-library/jest-dom/extend-expect"; /** typescript, autocompletions et al */

import App from "./App";
import { render } from "./test-utils";

describe("App", () => {
	it("Renders the Landing page", async () => {
		const { getByText } = render(<App />);

		expect(getByText("Let's party!")).toBeInTheDocument();
	});
});
