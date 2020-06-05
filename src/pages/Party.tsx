import React, { FC, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { SectionHeader, SectionHeaderButton } from "./party/SectionHeader";
import { Navbar } from "../shared-components/Navbar";

import { PartyServer } from "../models/PartyServer";
import { fetchServers } from "../utils/fetchServers";
import { getAuthToken } from "../utils/auth";

export const Party: FC<{ prefetchedServers?: PartyServer[] }> = () => {
	const history = useHistory();

	const { state: { prefetchedServers } = { prefetchedServers: [] } } = useLocation<{
		prefetchedServers: PartyServer[];
	}>();

	const [servers, setServers] = useState<PartyServer[]>(prefetchedServers);

	useEffect(() => {
		if (servers?.length) {
			return;
		}

		const authToken: string | null = getAuthToken();

		if (!authToken) {
			history.push("/login", { redirectHumanMsg: "Whoopsies, looks like you'll have to login first..." });
			return;
		}

		fetchServers().then(setServers);
	}, []);

	return (
		<div className="space-y-20 pb-8">
			<Navbar />

			<header className="wrapper space-y-4 text-center">
				{/* TODO FIXME - automatic location counting */}
				<h1 className="text-2xl">
					<span className="text-party-purple">{servers.length}</span> servers from{" "}
					<span className="text-party-purple">7</span> locations strong.
				</h1>

				<p className="text-lg">Feeling curious? Sort 'em out!</p>
			</header>

			<main className="wrapper space-y-20">
				<section className="space-y-6">
					<SectionHeader title="Sort by">
						<SectionHeaderButton>Reset</SectionHeaderButton>
					</SectionHeader>

					<article className="px-3 py-4 space-y-3 rounded bg-gray-300">
						<div className="py-2 shadow-md rounded bg-white text-xl space-y-1">
							<label htmlFor="name" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Name</span>
								<input type="checkbox" name="name" id="name" className="my-auto w-6 h-6" />
							</label>

							<label htmlFor="order" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Order</span>
								<div className="space-x-2">
									<button type="button" id="order" className="px-2 py-1 rounded bg-gray-300 border">
										ASC ☝
									</button>

									{/* <button type="button" className="px-2 py-1 rounded bg-gray-300">
										DESC 👇
									</button> */}
								</div>

								{/* <select name="order" id="order" className="pl-8 pr-2 py-2 rounded bg-gray-300">
									<option value="ascending" aria-label="ascending">
										ASC ☝
									</option>
									<option selected value="descending" aria-label="descending">
										DESC 👇
									</option>
								</select> */}
							</label>

							<label htmlFor="priority" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Priority</span>
								<div className="space-x-2">
									<select
										name="priority"
										id="priority"
										className="h-full px-3 py-1 rounded bg-gray-300"
									>
										<option value={1}>1</option>
										<option value={2}>2</option>
									</select>
									<button type="button" className="px-3 py-1 rounded bg-gray-300 w-12">
										+
									</button>
									<button type="button" className="px-3 py-1 rounded bg-gray-300 w-12">
										-
									</button>
								</div>
							</label>
						</div>

						<div className="py-2 shadow-md rounded bg-white text-xl space-y-1">
							<label htmlFor="name" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Name</span>
								<input type="checkbox" name="name" id="name" className="my-auto w-6 h-6" />
							</label>

							<label htmlFor="order" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Order</span>
								<div className="space-x-2">
									<button type="button" id="order" className="px-2 py-1 rounded bg-gray-300 border">
										ASC ☝
									</button>

									{/* <button type="button" className="px-2 py-1 rounded bg-gray-300">
										DESC 👇
									</button> */}
								</div>

								{/* <select name="order" id="order" className="pl-8 pr-2 py-2 rounded bg-gray-300">
									<option value="ascending" aria-label="ascending">
										ASC ☝
									</option>
									<option selected value="descending" aria-label="descending">
										DESC 👇
									</option>
								</select> */}
							</label>

							<label htmlFor="priority" className="flex justify-between w-full px-4 py-1">
								<span className="my-auto">Priority</span>
								<div className="space-x-2">
									<select
										name="priority"
										id="priority"
										className="h-full px-3 py-1 rounded bg-gray-300"
									>
										<option value={1}>1</option>
										<option value={2}>2</option>
									</select>
									<button type="button" className="px-3 py-1 rounded bg-gray-300 w-12">
										+
									</button>
									<button type="button" className="px-3 py-1 rounded bg-gray-300 w-12">
										-
									</button>
								</div>
							</label>
						</div>
					</article>
				</section>

				<section className="space-y-4">
					<SectionHeader title="The Servers">
						<SectionHeaderButton>Refresh</SectionHeaderButton>
					</SectionHeader>

					<ul className="space-y-3">
						{servers.map(({ name, distance }) => (
							<li key={`${name}-${distance}`}>
								<h3 className="uppercase tracking-tight text-gray-700">{name},</h3>
								<p>{distance} km away</p>
							</li>
						))}
					</ul>
				</section>
			</main>

			<footer className="wrapper">
				<div className="text-right">
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
						className="px-3 py-2"
					>
						<span>Lift me up</span> <span aria-label="pointing up">☝</span>
					</button>
				</div>
			</footer>
		</div>
	);
};
