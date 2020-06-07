import React, { FC, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { TopSecretFeature } from "../shared-components/TopSecretFeature";
import { Navbar } from "../shared-components/Navbar";
import { saveAuthDetails, authenticate, bearerify } from "../utils/auth";
import { fetchServers } from "../utils/fetchServers";
import { delay } from "../utils/delay";

/** XState taught me well. kinda. */
type StatusType = "idle" | "loading" | "success" | "error";

interface State {
	type: StatusType;
	token?: string;
	error?: string;
	humanErrorMsg?: string;
}

export const Login: FC<{}> = () => {
	const history = useHistory();
	const location = useLocation<{ from: { pathname: string }; redirectHumanMsg: string }>();

	const { from, redirectHumanMsg } = location?.state ?? { from: { pathname: "/party" }, redirectHumanMsg: "" };

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [statusState, setStatusState] = useState<State>({ type: "idle" });

	/**
	 * reset the status state's type & thus unlock the button etc.
	 * if we've errored previously * & the user now changed
	 * something inside the username / password fields
	 */
	useEffect(() => {
		if (statusState.type === "error") {
			setStatusState({ type: "idle" });
		}
	}, [username, password]);

	/**
	 * we'll be pre-fetching the server list upon authentication
	 * and the redirecting the user to the server list page,
	 * but we don't want to do it before the animation / transition completes.
	 *
	 * This should be a bigger number than the `submitElementClassName`s `transition-duration`
	 */
	const timeoutDurationBeforeRedirecting: number = 600;

	/**
	 * slightly custom styling based on the state
	 */
	const submitElementClassName: string = [
		`px-16 py-4 text-2xl border rounded text-white transition all duration-300`,
		statusState.type === "success" ? "bg-party-green" : "bg-party-purple",
		["loading", "error", "success"].includes(statusState.type) && "opacity-75 cursor-not-allowed",
	].join(" ");

	const handleLogin = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>): Promise<void> => {
		e.preventDefault();

		setStatusState({ type: "loading" });

		try {
			const rawToken: string = await authenticate(username, password);

			const { bearerToken } = saveAuthDetails({ bearerToken: bearerify(rawToken), username });

			setStatusState({ type: "success", token: bearerToken });

			/**
			 * pre-fetch the server list
			 *
			 * we're using `Promise.all`, combined with `delay`,
			 * to make sure we wait AT LEAST the specified timeout duration
			 * but no longer than necessary.
			 */
			const [prefetchedServers] = await Promise.all([
				fetchServers(bearerToken),
				delay(timeoutDurationBeforeRedirecting),
			]);

			/** yeet */
			history.replace(from.pathname, { prefetchedServers });
			return;
		} catch (err) {
			if (err?.response?.status === 401) {
				setStatusState({ type: "error", error: err, humanErrorMsg: "The username / password was incorrect." });
			} else {
				setStatusState({ type: "error", error: err, humanErrorMsg: "An unknown error occurred." });
			}
		}
	};

	return (
		<>
			<div className="w-screen h-screen">
				<Navbar />

				<main className="wrapper mt-24">
					{redirectHumanMsg && (
						<div className="-mt-8 mb-8 text-center">
							<h2 className="text-lg text-party-purple">{redirectHumanMsg}</h2>
						</div>
					)}

					<form className="flex flex-col space-y-8">
						<div>
							<label htmlFor="username" className="flex flex-col">
								<span className="uppercase tracking-tight text-gray-700">Username</span>
								<input
									// eslint-disable-next-line jsx-a11y/no-autofocus
									autoFocus
									name="username"
									id="username"
									type="text"
									placeholder="tom_okman"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="px-4 py-2 mt-1 border text-2xl"
								/>
							</label>
						</div>

						<div>
							<label htmlFor="username" className="flex flex-col">
								<span className="uppercase tracking-tight text-gray-700">Password</span>
								<input
									name="password"
									id="password"
									type="password"
									/** ofc gotta reference the https://youtu.be/3NjQ9b3pgIg */
									placeholder="correcthorsebatterystaple"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="px-4 py-2 mt-1 border text-2xl"
								/>
							</label>
						</div>

						{statusState.type === "error" && (
							<div className="flex text-xl space-x-2">
								<span aria-label="attention">❗</span>
								<p>{statusState.humanErrorMsg}</p>
							</div>
						)}

						<div className="flex flex-col space-y-6">
							<input
								type="submit"
								value={statusState.type === "success" ? "Welcome" : "Log in"}
								onClick={(e) => handleLogin(e)}
								disabled={["loading", "success", "error"].includes(statusState.type)}
								className={submitElementClassName}
							/>

							<TopSecretFeature>I don't like parties</TopSecretFeature>
						</div>
					</form>
				</main>
			</div>
		</>
	);
};
