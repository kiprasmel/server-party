import React from "react";
import { Link } from "react-router-dom";

import { Navbar } from "../shared-components/Navbar";

export const Landing = () => (
	<div className="space-y-12 pb-8">
		<Navbar distractionless />

		<main className="wrapper space-y-10">
			<div className="space-y-4">
				<hgroup>
					<h3 className="uppercase tracking-tight text-party-purple -mb-1">Hey there!</h3>
					<h1 className="text-3xl font-bold">Bored sitting home?</h1>
				</hgroup>

				<div className="text-3xl">
					<p className="-mb-2">So were we.</p>
					<p>But not anymore!</p>
				</div>

				<p className="text-3xl">We're throwing the sickest party there is &mdash; come join the fun!</p>
			</div>

			<Link
				to="/party"
				className="inline-block w-full py-4 text-3xl text-center text-white bg-party-purple rounded shadow shadow-xl"
			>
				Let's party!
			</Link>
		</main>
	</div>
);
