type Order = "ascending" | "descending";

/**
 *  much like `Array<T>["sort"]`
 */
type CompareFn<T, Key extends keyof T> = (left: T[Key], right: T[Key], self: Sorter<T, Key>) => number;

export interface Sorter<T, Key extends keyof T> {
	key: Key;
	priority: number;
	title: string;
	order: Order;
	enabled: boolean;
	compare: CompareFn<T, Key>;
}

export function sortTheSorters<T extends { priority: number }[]>(sorters: T): T {
	return ([...sorters] as T).sort((left, right) => left.priority - right.priority); /** asc ☝ */
}

/**
 *
 * @returns the sorted targets.
 *
 * @example
 *
 * ```ts
 * const items = [];
 * const sortedItems = sortWith(sorters, items);
 * ```
 *
 */
export function sortWith<T, Key extends keyof T>(sorters: Sorter<T, Key>[], targets: T[]): T[] {
	const sortedSorters: Sorter<T, Key>[] = sortTheSorters(sorters);

	return [...targets].sort((left: T, right: T): number => {
		for (const sorter of sortedSorters) {
			if (!sorter.enabled) {
				continue;
			}

			const result: number = sorter.compare(left[sorter.key], right[sorter.key], sorter);

			if (result !== 0) {
				return result;
			}
		}

		return 0;
	});
}
