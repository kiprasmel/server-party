import axios from "axios";

export function bearerify(rawToken: string) {
	return `Bearer ${rawToken}`;
}

export async function authenticate(username: string, password: string): Promise<string> {
	const { data }: { data: { token: string } } = await axios.post("https://playground.tesonet.lt/v1/tokens", {
		username,
		password,
	});

	return data.token;
}
