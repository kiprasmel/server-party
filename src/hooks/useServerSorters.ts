import { Reducer, useReducer } from "react";

import { usePrevious } from "./usePrevious";
import { ServerSorter, getDefaultServerSorters } from "../utils/serverSorters";
import { clamp } from "../utils/clamp";

type ServerSorterAction = (
	| { type: "resetAllToDefaults" } //
	| { type: "restoreAllToPreviousState"; previousState: ServerSorter[] }
	| { type: "toggleEnabled" }
	| { type: "swapOrder" }
	| { type: "updatePriority"; newPriority: number }
) & {
	sorter: ServerSorter;
};

export type ServerSorterReducer = Reducer<ServerSorter[], ServerSorterAction>;

/**
 * using a reducer instead of state
 * to have a convenient updating API and
 * to avoid nasty errors
 *
 * this pattern should remind ya of something ;)
 *
 */
const serverSorterReducer: ServerSorterReducer = (state, { type, sorter, ...action }) => {
	if (type === "resetAllToDefaults") {
		return getDefaultServerSorters();
	}

	if (type === "restoreAllToPreviousState") {
		return (action as { previousState: ServerSorter[] }).previousState;
	}

	if (type === "toggleEnabled") {
		return state.map((s) => (s.key !== sorter.key ? s : { ...sorter, enabled: !sorter.enabled }));
	}

	if (type === "swapOrder") {
		return state.map((s) =>
			s.key !== sorter.key ? s : { ...sorter, order: sorter.order === "ascending" ? "descending" : "ascending" }
		);
	}

	if (type === "updatePriority") {
		/**
		 * The last & most "complicated" one - bear with me.
		 *
		 * Essentially, I wanted to allow any amount of sorters
		 * & handle them automatically - this is the result.
		 *
		 * What we do here is basically this:
		 *
		 * From an array of items [A, B, C, D, E], ordered like so:
		 *
		 *    1    A
		 *    2    B
		 *    3    C
		 *    4    D
		 *    5    E
		 *
		 * we have have one item that wants it's order changed.
		 * The order can change by any amount, as long as it's within the bounds
		 * of the array.
		 *
		 * Let's say we want to move our element `B`
		 * from order `2` to order `4`.
		 * It will look something like this:
		 *
		 * 1. The order of `B` gets incremented by however much it needs to move
		 *
		 *         old  new
		 *          |    |
		 *         \/   \/
		 *    1    A
		 *    2    B ------------\
		 *    3    C             |
		 *    4    D    B  <----/
		 *    5    E
		 *
		 * 2. All elements between the old and the new order of `B` get decremented by exactly 1,
		 *    since only one element (`B`) moved forward,
		 *    thus everyone in between needs to shift back by 1
		 *
		 *    1    A
		 *    2
		 *    3    C    D  <----\
		 *    4    D -- B  -----/
		 *    5    E
		 *
		 *    1    A
		 *    2         C  <----\
		 *    3    C -- D  -----/
		 *    4    D    B
		 *    5    E
		 *
		 * 3. Other elements' order remains unchanged.
		 *
		 *    1    A -> A
		 *    2         C
		 *    3         D
		 *    4         B
		 *    5    E -> E
		 *
		 * the whole diff:
		 *
		 *    1    A    A    +0
		 *    2    B    C    -1
		 *    3    C    D    -1
		 *    4    D    B    +2
		 *    5    E    E    +0
		 *
		 * That's it.
		 *
		 * ---
		 *
		 * The same works for decrementing a selected element;
		 *
		 * the only change will be that the elements in between
		 * will need to get incremented instead (the opposite action)
		 * by, once again, exactly 1.
		 *
		 */

		const newPriority = clamp((action as { newPriority: number }).newPriority, 1, state.length);

		if (newPriority === sorter.priority) {
			return state;
		}

		const difference: number = newPriority - sorter.priority;

		const sign: -1 | 1 = difference > 0 ? 1 : -1;

		const shouldDecrementOther = (priority: number): boolean =>
			priority > sorter.priority && priority <= sorter.priority + difference;

		const shouldIncrementOther = (priority: number): boolean =>
			priority < sorter.priority && priority >= sorter.priority + difference;

		/**
		 * choose which function we'll use based on the sign
		 */
		const shouldModifyOther = sign === 1 ? shouldDecrementOther : shouldIncrementOther;

		/**
		 * go through all elements
		 */
		return state.map((s) => {
			if (s.key === sorter.key) {
				/**
				 * increment yourself by however much you need
				 */
				return { ...sorter, priority: sorter.priority + difference };
			}

			if (shouldModifyOther(s.priority)) {
				/**
				 * do the opposite of what we did to the target element
				 * (increment vs decrement),
				 * but only modify the order by +-1
				 */
				return { ...s, priority: s.priority - sign };
			}

			/** by default - do nothing */
			return s;
		});
	}

	return state;
};

export function useServerSorters(): {
	sorters: ServerSorter[];
	dispatchSorter: React.Dispatch<ServerSorterAction>;
	previousSorters: ServerSorter[] | undefined;
	// eslint-disable-next-line indent
} {
	const [sorters, dispatchSorter] = useReducer<ServerSorterReducer>(serverSorterReducer, getDefaultServerSorters());

	const previousSorters = usePrevious(sorters);

	return { sorters, dispatchSorter, previousSorters };
}
