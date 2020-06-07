import React, { FC, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SectionHeader, SectionHeaderButton } from "./party/SectionHeader";
import { Navbar } from "../shared-components/Navbar";

import { PartyServer } from "../models/PartyServer";
import { sortWith, Sorter } from "../models/Sorter";
import { useServerSorters } from "../hooks/useServerSorters";
import { useAuth } from "../hooks/useAuth";
import { fetchServers } from "../utils/fetchServers";
import { getUniqueLocations } from "../utils/getUniqueLocations";

export const Party: FC<{ prefetchedServers?: PartyServer[] }> = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { auth, redirectToLoginIfNoAuth } = useAuth();

	const { sorters, dispatchSorter, previousSorters } = useServerSorters();

	(window as any).sorters = sorters;

	const { state: { prefetchedServers } = { prefetchedServers: [] } } = useLocation<{
		prefetchedServers: PartyServer[];
	}>();

	const [servers, setServers] = useState<PartyServer[]>(sortWith(sorters, prefetchedServers));

	(window as any).servers = servers;

	const fetchAndUpdateServers = () => {
		redirectToLoginIfNoAuth();
		fetchServers(auth.bearerToken).then((newServers) => setServers(sortWith(sorters, newServers)));
	};

	useEffect(() => {
		if (servers?.length) {
			return;
		}

		fetchAndUpdateServers();
	}, []);

	/** TODO FIXME #lateUpdate */
	// useEffect(() => {
	// 	const newServers = sortWith(sorters, servers);
	// 	setServers(newServers);
	// }, [sorters, servers]);

	return (
		<div className="space-y-20 pb-8">
			<Navbar />

			<header className="wrapper space-y-4 text-center">
				{/* TODO FIXME - automatic location counting */}
				<h1 className="text-2xl">
					<span className="text-party-purple">{servers.length}</span> servers from{" "}
					<span className="text-party-purple">{getUniqueLocations(servers).length}</span> locations partyin'
					like never before.
				</h1>

				<p className="text-lg">Feeling curious? Sort them out!</p>
			</header>

			<main className="wrapper space-y-20">
				{/* sorters */}
				<section className="space-y-6">
					<SectionHeader title="Sort by">
						<SectionHeaderButton
							onClick={() =>
								dispatchSorter({
									type: "resetAllToDefaults",
									sorter: (null as unknown) as Sorter<any, any>,
								})
							}
						>
							Reset
						</SectionHeaderButton>

						{previousSorters && (
							<SectionHeaderButton
								onClick={() =>
									dispatchSorter({
										type: "restoreAllToPreviousState",
										previousState: previousSorters,
										sorter: (null as unknown) as Sorter<any, any>,
									})
								}
							>
								Undo
							</SectionHeaderButton>
						)}
					</SectionHeader>

					{/* sorter cards */}
					<article className="cluster cluster-in-1 lg:cluster-in-3 px-4 py-4 rounded bg-gray-300 select-none">
						{/** wrapper */}
						<div>
							{sorters.map((sorter) => (
								/** sorter card */
								<div key={sorter.key} className="py-2 shadow-md rounded bg-white text-xl space-y-1">
									<label
										htmlFor={`name--${sorter.key}`}
										className="flex justify-between w-full px-4 py-1"
									>
										<span className="my-auto text-gray-700 uppercase tracking-tight font-semibold">
											{sorter.title}
										</span>

										<input
											type="checkbox"
											name={`name--${sorter.key}`}
											id={`name--${sorter.key}`}
											checked={sorter.enabled}
											onChange={() => dispatchSorter({ type: "toggleEnabled", sorter })}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													dispatchSorter({ type: "toggleEnabled", sorter });
												}
											}}
											className="my-auto w-6 h-6"
										/>
									</label>

									<label
										htmlFor={`order--${sorter.key}`}
										aria-label="Order toggle"
										className="flex justify-between w-full px-4 py-1"
									>
										<span className="my-auto">Order</span>

										<div className="space-x-2">
											<button
												type="button"
												id={`order--${sorter.key}`}
												aria-label={sorter.order}
												onClick={() => {
													dispatchSorter({ type: "swapOrder", sorter });
												}}
												className="px-2 py-1 rounded bg-gray-300 border"
											>
												{sorter.order === "ascending" ? "ASC 👆" : "DESC 👇"}
											</button>
										</div>
									</label>

									<label
										htmlFor={`priority--${sorter.key}`}
										className="flex justify-between w-full px-4 py-1"
									>
										<span className="my-auto">Priority</span>

										<div className="space-x-2">
											<select
												name="priority"
												id={`priority--${sorter.key}`}
												value={sorter.priority}
												onChange={(e) =>
													dispatchSorter({
														type: "updatePriority",
														sorter,
														newPriority: Number(e.target.value),
													})
												}
												className="h-full px-3 py-1 rounded bg-gray-300"
											>
												{/* create "order" options in range [1, sorters.length] */}
												{new Array(sorters.length).fill(0).map((_, index) => (
													<option key={index + 1} value={index + 1}>
														{index + 1}
													</option>
												))}
											</select>
											<button
												type="button"
												onClick={() =>
													dispatchSorter({
														type: "updatePriority",
														sorter,
														newPriority: sorter.priority + 1,
													})
												}
												className="px-3 py-1 rounded bg-gray-300 w-12"
											>
												+
											</button>
											<button
												type="button"
												onClick={() =>
													dispatchSorter({
														type: "updatePriority",
														sorter,
														newPriority: sorter.priority - 1,
													})
												}
												className="px-3 py-1 rounded bg-gray-300 w-12"
											>
												-
											</button>
										</div>
									</label>
								</div>
								/** sorter card */
							))}
						</div>
						{/* /wrapper */}
					</article>
					{/* /sorter cards */}
				</section>
				{/* /sorters */}

				{/* servers */}
				<section className="space-y-6">
					<SectionHeader title="The Servers">
						<SectionHeaderButton onClick={() => fetchAndUpdateServers()}>Refresh</SectionHeaderButton>
					</SectionHeader>

					{/* some text + refresh if no servers found */}
					{!servers.length && (
						<div className="space-y-2 pt-4">
							<h3 className="text-2xl">Oh noes! The party seems to be over... </h3>
							<p className="text-lg">
								Have you tried{" "}
								<SectionHeaderButton
									onClick={() => fetchAndUpdateServers()}
									extraClassName="pt-0 pr-0 pb-0 pl-0"
								>
									calling them again?
								</SectionHeaderButton>
							</p>
						</div>
					)}
					{/* /some text + refresh if no servers found */}

					{/* server cards */}
					<div className="cluster cluster-in-1 md:cluster-in-2 lg:cluster-in-3 xl:cluster-in-4">
						{/* wrapper */}
						<ul>
							{/**
							 * without sorting the servers here, they would get stuck
							 * to the previous sorter configuration somehow,
							 * even when used with `useEffect`
							 *
							 * TODO FIXME #lateUpdate
							 */}

							{/* {servers.map(({ name, distance }, index) => ( */}
							{sortWith(sorters, servers).map(({ name, distance }, index) => (
								/** server card */
								<li
									key={`${name}-${distance}`}
									className="flex justify-between px-4 py-3 text-xl bg-party-green-light shadow-md rounded"
								>
									<span>
										<h3 className="uppercase tracking-tight text-party-green-dark">{name},</h3>
										<p className="text-party-black">
											<span className="my-auto">{distance}</span> km away
										</p>
									</span>

									<span className="my-auto text-party-green-dark">{index + 1}</span>
								</li>
								/** /server card */
							))}
						</ul>
						{/* /wrapper */}
					</div>
					{/* /server cards */}

					{servers.length && auth?.username && (
						<h3>
							Have fun, <span className="capitalize text-party-purple">{auth.username}.</span>
						</h3>
					)}
				</section>
			</main>

			<footer className="wrapper flex justify-between items-center">
				<a href="https://kipras.org" target="_blank" rel="noopener noreferrer" className="text-gray-700">
					Proudly by <span className="text-party-purple underline">Kipras</span>
				</a>

				<div>
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
						className="px-3 py-2 -mr-3"
					>
						<span className="underline">
							<span>Lift me up</span> <span aria-label="pointing up">☝</span>
						</span>
					</button>
				</div>
			</footer>
		</div>
	);
};
