<?php
/**
 * Plugin Name: XKCD Comic Gutenberg Block
 * Plugin URI: https://github.com/priethor/xkcd-comic-gutenberg-block
 * Description: A Gutenberg block that dynamically renders a XKCD Comic
 * Options are to always display the most recent comic or to select a comic number
 * Version: 1.0.0
 * Author: priethor
 * Author URI: https://www.linkedin.com/in/priethor/
 * License: GPL
 * Text Domain: xkcd-cgb
 *
 * @package none
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit();

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 */
function xkcd_comic_gutenberg_block_registration() {
	if ( ! function_exists( 'register_block_type' ) ) {
		// Gutenberg is not active.
		return;
	}

	// automatically load dependencies and version.
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_register_script(
		'xkcd-comic-gutenberg-block-script',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_register_style(
		'xkcd-comic-gutenberg-block-style',
		plugin_dir_url( __FILE__ ) . 'css/style.css',
		array(),
		filemtime(
			get_stylesheet_directory()
		)
	);

	register_block_type(
		'priethor/xkcd-comic-gutenberg-block',
		array(
			'editor_script'   => 'xkcd-comic-gutenberg-block-script',
			'render_callback' => 'xkcd_comic_gutenberg_block_render_callback',
			'editor_style'    => '',
			'style'           => 'xkcd-comic-gutenberg-block-style',
		)
	);

	wp_set_script_translations( 'xkcd-comic-gutenberg-block-script', 'xkcd-cgb', plugin_dir_path( __FILE__ ) . 'languages' );
}

/**
 * Callback function to render the dynamic block.
 *
 * @param array $attributes The block attributes.
 */
function xkcd_comic_gutenberg_block_render_callback( $attributes ) {

	$comic = xkcd_comic_gutenberg_block_get_comic( $attributes );

	if ( null === $comic ) {
		return "Comic couldn't be loaded";
	}

	$output  = sprintf( '<div class="xkcd-comic">' );
	$output .= sprintf( '<div className="xkcd-comic__title">%s</div>', $comic['title'] );
	$output .= sprintf( '<img src="%s" alt="%s"/>', $comic['img'], $comic['alt'] );
	$output .= sprintf( '</div>' );
	return $output;
}

/**
 * Returns the desired comic: if the user selected a specific one,
 * it's already stored in the attributes and returned; if the latest one needs to be shown,
 * it performs a GET to the XKCD API in order to retrieve the most recent one.
 *
 * @param array $attributes The block attributes.
 */
function xkcd_comic_gutenberg_block_get_comic( $attributes ) {
	// If the toggle is enabled, the value is not defined, not true, so we need to check that it exists and is set to false.
	$comic_num = false === array_key_exists( 'isCurrentComicSelected', $attributes ) || $attributes['isCurrentComicSelected']
		? 'latest'
		: $attributes['selectedComicNumber'];

	if ( 'latest' !== $comic_num ) {
		return $attributes['comic'];
	}

	$comic_url     = sprintf( 'https://xkcd.now.sh/?comic=%s', $comic_num );
	$comic_request = wp_remote_get( $comic_url );

	return 200 === $comic_request['response']['code']
		? json_decode( $comic_request['body'], true )
		: null;
}

add_action( 'init', 'xkcd_comic_gutenberg_block_registration' );
