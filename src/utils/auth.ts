import axios from "axios";

const localStorageAuthKey: string = "__auth_token";

/** TODO use context / redux? Would still be kinda overkill lol */
export function saveAuthToken(rawToken: string, bearerToken: string = `Bearer ${rawToken}`): string {
	localStorage.setItem(localStorageAuthKey, bearerToken);

	return bearerToken;
}

export function getAuthToken(): string | null {
	const token: string | null = localStorage.getItem(localStorageAuthKey);

	return token;
}

export async function authenticate(username: string, password: string): Promise<string> {
	const { data }: { data: { token: string } } = await axios.post("https://playground.tesonet.lt/v1/tokens", {
		username,
		password,
	});

	return data.token;
}
