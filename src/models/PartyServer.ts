export interface BasicPartyServer {
	name: string;
	distance: number;
}

export interface PartyServer extends BasicPartyServer {
	/**
	 * a unique ID, but only in the region's perspective (different regions had overlapping ones)
	 */
	id: number;
	location: string;
}

export function createServer(data: BasicPartyServer): PartyServer {
	return { ...data, id: parseId(data.name), location: parseLocation(data.name) };
}

export function parseId(name: string): number {
	const idStr: string = name.split("#")[1];
	const id: number = Number(idStr);

	return Number.isNaN(id) ? -1 : id;
}

export function parseLocation(name: string): string {
	return name.split("#")[0].trim();
}
