# XKCD Comic Gutenberg Plugin

This WordPress plugin adds a Gutenberg block that embeds a [XKCD comic](https://xkcd.com/) using a [proxy API](https://xkcd.now.sh/) of the [official XKCD API](https://xkcd.com/json.html) in order to avoid CORS.

Depending on the selected options, it can either display the most recent comic or a fixed one, indicated by its ID, as the API doesn't allow any other kind of searching or filtering (e.g. by date).

![How to use the block ][block-adding-gif]

[block-adding-gif]: docs/adding-block.gif "Block adding GIF"

## Features

- [x] Displays the most recent comic, always up to date.
- [x] Displays a fixed comic selected by ID.
- [x] In edit mode, checks for new comics only every 60s.

## Other considerations

- Conforms to [WordPress coding guidelines](https://developer.wordpress.org/block-editor/contributors/develop/coding-guidelines/), implementing and passing linting scripts:
    - ESLint rules by extending `plugin:@wordpress/eslint-plugin/recommended`. Validates included JavaScript, Markdown and CSS files.
    - PHP rules by setting a PHP_CodeSniffer configuration file based on the [WordPress sample](https://github.com/WordPress/WordPress-Coding-Standards/blob/develop/phpcs.xml.dist.sample).
- Contains default and Spanish (es-ES) translations.
- In order to specify the comic ID in the Sidebar, it tries to display the experimental [Number Control](https://developer.wordpress.org/block-editor/components/number-control/), if available. If the Gutenberg plugin is not installed and only the version shipped with WordPress is available, it displays a normal TextControl instead.

## Installation

1. Download the repository under wp-content/plugins
2. Run `npm install`
3. Run `npm run build`
4. Activate the plugin in the WordPress Admin Panel under `Plugins` -> `Installed Plugins`

## TODOs

- [x] Improve the comic loading animation, both in the block itself and the Sidebar
- [ ] Convert CSS to SCSS.
- [ ] Add more options, like showing the comic date or not with a setting, with alignment options.
- [ ] Create a WordPress endpoint to fetch commits from the official XKCD API using WordPress directly as proxy to avoid CORS and depending on a third-party API.
