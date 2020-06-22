# XKCD Comic Gutenberg Plugin

This WordPress plugin adds a Gutenberg plugin that embeds a [XKCD comic](https://xkcd.com/) using a [proxy API](https://xkcd.now.sh/) of the [official XKCD API](https://xkcd.com/json.html) in order to avoid CORS.

Depending on the selected options, it can either display the most recent comic or the selected one, by ID, as the API doesn't allow any other kind of searching or filtering (e.g. by date).

![alt text][logo]

[logo]: docs/adding-block.gif "Logo Title Text 2"

## Features

- [x] Displays the most recent comic, always up to date.
- [x] Displays a fixed comic selected by ID.
- [x] In edit mode, checks for new comics only every 60s.

## Other

- Conforms to [WordPress coding guidelines](https://developer.wordpress.org/block-editor/contributors/develop/coding-guidelines/), implementing and passing linting scripts:
    - ESLint rules by extending `plugin:@wordpress/eslint-plugin/recommended`. Validates included JavaScript, Markdown and CSS files.
    - PHP rules by setting a PHP_CodeSniffer configuration file based on the [WordPress sample](https://github.com/WordPress/WordPress-Coding-Standards/blob/develop/phpcs.xml.dist.sample).
- Contains default and Spanish (es-ES) translations.

## TODOs

- [ ] Convert CSS to SCSS.
- [ ] Add more options, like showing the comic date or not with a setting, with alignment options.
- [ ] 
