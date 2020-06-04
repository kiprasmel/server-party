import React, { FC, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

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
		<>
			<Navbar />
			<div>
				{servers.map((server) => (
					<div key={`${server?.name}-${server.distance}`}>
						{server?.name} {server?.distance}
					</div>
				))}
			</div>
		</>
	);
};
