import axios, { AxiosRequestConfig } from "axios";
import { PartyServer } from "../models/PartyServer";
import { getAuthToken } from "./auth";

export async function fetchServers(
	bearerToken: string = getAuthToken() || "",
	headers: AxiosRequestConfig["headers"] = {
		Authorization: bearerToken,
	}
): Promise<PartyServer[]> {
	const res: { data: PartyServer[] } = await axios.get("https://playground.tesonet.lt/v1/servers", { headers });

	return res.data;
}
