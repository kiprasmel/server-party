import axios, { AxiosRequestConfig } from "axios";
import { PartyServer, createServer } from "../models/PartyServer";

export async function fetchServers(
	bearerToken: string,
	headers: AxiosRequestConfig["headers"] = {
		Authorization: bearerToken,
	}
): Promise<PartyServer[]> {
	const res: { data: PartyServer[] } = await axios.get("https://playground.tesonet.lt/v1/servers", { headers });

	return res.data.map(createServer);
}
