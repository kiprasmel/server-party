import axios from "axios";

export async function authenticate(username: string, password: string): Promise<string> {
	const res: { data: { token: string } } = await axios.post("https://playground.tesonet.lt/v1/tokens", {
		username,
		password,
	});

	const { data } = res;

	return data.token;
}
