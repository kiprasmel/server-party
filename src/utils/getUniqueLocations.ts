import { PartyServer } from "../models/PartyServer";

export function getUniqueLocations(
	servers: PartyServer[],
	locationsWithDups = servers.map((server) => server.location),
	locationsUnique = [...new Set(locationsWithDups)]
): PartyServer["location"][] {
	return locationsUnique;
}
