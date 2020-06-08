import React, { FC, useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { TopSecretFeature } from "../shared-components/TopSecretFeature";
import { Navbar } from "../shared-components/Navbar";
import { ReportAnIssueHref } from "../shared-components/ReportAnIssueHref";
import { authenticate } from "../utils/authenticate";
import { bearerify } from "../utils/auth";
import { fetchServers } from "../utils/fetchServers";
import { delay } from "../utils/delay";

/**
 * XState taught me well. kinda.
 *
 * Also, the "unknown-error" is perhaps unusual but very useful --
 * we do not disable the button upon receiving it and
 * we show the user a link where they can report the error,
 * since, well, it's unknown.
 *
 * It'd probably be more beneficial to have an error
 * tracking service setup instead and not rely on the user,
 * but that's very much outside the scope of the current project
 * and allowing the user to report the error is useful either way.
 */
type StatusType = "idle" | "loading" | "success" | "error" | "unknown-error";

interface State {
	type: StatusType;
	token?: string;
	error?: string;
	humanErrorMsg?: string;
}

export const Login: FC<{}> = () => {
	const history = useHistory();
	const location = useLocation<{ from: { pathname: string }; redirectHumanMsg: string }>();
	const { setAuth } = useContext(AuthContext);

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
		if (["error", "unknown-error"].includes(statusState.type)) {
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
		`inline-block px-16 py-4 text-2xl border rounded text-white shadow-xl cursor-pointer transition all duration-300`,
		statusState.type === "success" ? "bg-party-green" : "bg-party-purple",
		["loading", "error", "success"].includes(statusState.type) && "opacity-75 cursor-not-allowed",
	].join(" ");

	const handleLogin = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>): Promise<void> => {
		e.preventDefault();

		setStatusState({ type: "loading" });

		try {
			const rawToken: string = await authenticate(username, password);
			const bearerToken: string = bearerify(rawToken);

			setAuth({ bearerToken, username, isAuthenticated: true });

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
				setStatusState({ type: "unknown-error", error: err, humanErrorMsg: "An unknown error occurred." });
			}
		}
	};

	return (
		<>
			<div className="w-screen h-screen">
				<Navbar distractionless />

				<main className="wrapper max-w-screen-sm mt-12 | md:mt-32">
					{redirectHumanMsg && (
						<div className="mb-8 text-center">
							<h2 className="text-lg text-party-purple | md:text-2xl">{redirectHumanMsg}</h2>
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
									className="px-4 py-2 mt-1 border border-party-black rounded text-2xl"
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
									className="px-4 py-2 mt-1 border border-party-black rounded text-2xl"
								/>
							</label>
						</div>

						{["error", "unknown-error"].includes(statusState.type) && (
							<div className="flex text-xl space-x-2">
								<span aria-label="attention">❗</span>
								<p>
									{statusState.humanErrorMsg}

									{statusState.type === "unknown-error" && (
										<>
											{" "}
											<ReportAnIssueHref
												issueTitle="An unknown error has occured at the Login page"
												issueDescription={`The following error occured: \n\`\`\`${statusState.error})}\n\`\`\``}
											>
												You can report it here
											</ReportAnIssueHref>
											. Thanks!
										</>
									)}
								</p>
							</div>
						)}

						<div className="flex flex-col space-y-6 | lg:flex-row-reverse lg:justify-between lg:items-baseline lg:space-y-0">
							<input
								name="submit"
								type="submit"
								data-testid="login-button"
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
