const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	purge: [],
	theme: {
		extend: {
			colors: {
				/** ( ͡° ͜ʖ ͡°) */
				"party-green": "#39e28d",
				"party-green-light": "#a6f2cc",
				"party-green-dark": "#0c502e",
				"party-purple": "#6400cf",
				"party-black": "#222222",
			},
			spacing: {
				"2px": "2px",
				"-2px": "-2px",
			},
		},
		screens: {
			...defaultTheme.screens,
			lg: "1280px",
			xl: "1440px",
		},
	},
	variants: {},
	plugins: [],
	corePlugins: {},
	target: "ie11",
};
