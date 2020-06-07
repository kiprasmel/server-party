import React from "react";
import { Link } from "react-router-dom";

export const NotFound404 = () => (
	<div className="w-screen h-screen flex justify-center items-center">
		<main className="p-8 w-auto h-auto text-left md:text-right">
			<h1 className="text-6xl">404 party not found</h1>

			<div className="flex flex-col | md:justify-center md:flex-row-reverse md:justify-between md:items-baseline">
				<Link
					to="/party"
					className="inline-block px-12 py-4 mt-4 text-center text-2xl text-white bg-party-purple rounded "
				>
					Bring it on
				</Link>

				<p className="inline-block text-lg mt-8">
					<span className="text-gray-700">Something's wrong?</span>{" "}
					<a
						href={`https://github.com/sarpik/server-party/issues/new?title=It's gotten out of control&body=HAAAAAALP`}
						// eslint-disable-next-line react/jsx-no-target-blank
						target="_blank"
						rel="noopener"
						className="text-party-purple"
					>
						File an issue here.
					</a>
				</p>
			</div>
		</main>
	</div>
);
