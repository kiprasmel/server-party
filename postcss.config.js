/** see https://tailwindcss.com/docs/controlling-file-size/#setting-up-purgecss-manually */
const purgecss = require("@fullhuman/postcss-purgecss")({
	content: [
		"./public/**/*.html",
		"./src/**/*.[jt]sx?",
		// etc.
	],

	defaultExtractor: (content) => {
		// Capture as liberally as possible, including things like `h-(screen-1.5)`
		const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

		// Capture classes within other delimiters like .block(class="w-1/2") in Pug
		const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

		return [...broadMatches, ...innerMatches];
	},
});

module.exports = {
	plugins: [
		/**
		 * https://tailwindcss.com/docs/using-with-preprocessors/#build-time-imports
		 * https://github.com/postcss/postcss-import
		 */
		require("postcss-import"),
		require("tailwindcss"),
		require("autoprefixer"),
		...(process.env.NODE_ENV === "production" ? [purgecss] : []),
	],
};
