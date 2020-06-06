import { Sorter, sortTheSorters } from "../models/Sorter";
import { PartyServer } from "../models/PartyServer";

const distanceSorter: Sorter<PartyServer, "distance"> = {
	key: "distance",
	priority: 1,
	title: "Distance",
	order: "ascending",
	enabled: true,
	compare: (left, right, { order }) => (order === "descending" ? right - left : left - right),
};

const nameSorter: Sorter<PartyServer, "name"> = {
	key: "name",
	priority: 2,
	title: "Name",
	order: "ascending",
	enabled: true,
	compare: (left, right, { order }) =>
		order === "ascending" ? left.localeCompare(right) : right.localeCompare(left),
};

const idSorter: Sorter<PartyServer, "id"> = {
	key: "id",
	title: "ID",
	enabled: true,
	order: "ascending",
	priority: 3,
	compare: (left, right, { order }) => (order === "ascending" ? left - right : right - left),
};

export type ServerSorter = Sorter<PartyServer, "name"> | Sorter<PartyServer, "distance"> | Sorter<PartyServer, "id">;

/** avoids modifying the defaults */
export function getDefaultServerSorters(): ServerSorter[] {
	return [...sortTheSorters([distanceSorter, nameSorter, idSorter])];
}
