import React from "react";
import { Link } from "react-router-dom";

import { Navbar } from "../shared-components/Navbar";

export const Landing = () => (
	<div className="pb-8">
		<Navbar distractionless />

		<main className="wrapper mt-12 space-y-10 | md:mt-32 md:space-y-16 | lg:w-6/12 lg:text-left">
			<div className="space-y-4 | md:space-y-8">
				<hgroup>
					<h3 className="uppercase tracking-tight text-party-purple -mb-1 | md:text-xl md:-mb-3">
						Hey there!
					</h3>
					<h1 className="text-3xl font-bold | md:text-6xl md:tracking-tight">Bored sitting home?</h1>
				</hgroup>

				<div className="flex flex-col text-3xl | md:flex-row md:text-5xl md:tracking-tight | lg:justify-left">
					<h2 className="-mb-2">So were we.</h2>
					<h2 className="md:ml-3">But not anymore!</h2>
				</div>

				<h3 className="text-3xl">We're throwing the sickest party there is &mdash; come join the fun!</h3>
			</div>

			<div className="flex justify-end">
				<Link
					to="/party"
					className="inline-block w-full py-4 text-3xl text-center text-white bg-party-purple rounded shadow shadow-xl | lg:max-w-xs"
				>
					Let's party!
				</Link>
			</div>
		</main>
	</div>
);
