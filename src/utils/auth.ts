import axios from "axios";

import { AuthDetails, localStorageAuthDetailsKey } from "../models/AuthDetails";

export function bearerify(rawToken: string) {
	return `Bearer ${rawToken}`;
}

/** TODO use context / redux? Would still be kinda overkill lol */
export function saveAuthDetails(auth: AuthDetails): AuthDetails {
	localStorage.setItem(localStorageAuthDetailsKey, JSON.stringify(auth));

	return auth;
}

export function getAuthDetails(): AuthDetails | null {
	const authStr: string | null = localStorage.getItem(localStorageAuthDetailsKey);

	return !authStr ? null : JSON.parse(authStr);
}

export async function authenticate(username: string, password: string): Promise<string> {
	const { data }: { data: { token: string } } = await axios.post("https://playground.tesonet.lt/v1/tokens", {
		username,
		password,
	});

	return data.token;
}
