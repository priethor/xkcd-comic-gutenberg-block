/**
 * WordPress dependencies
 */
import React from 'react'; // To avoid undeclared variable down
import { registerBlockType } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import {
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

const UPDATE_INTERVAL = 60000;

registerBlockType( 'priethor/xkcd-comic-gutenberg-block', {
	title: __( 'XKCD Comic', 'xkcd-cgb' ),
	category: 'embed',
	icon: 'smiley',
	attributes: {
		comic: {
			type: 'object',
		},
		isCurrentComicSelected: {
			type: 'boolean',
			default: true,
		},
		selectedComicNumber: {
			type: 'integer',
		},
		lastComicNumber: {
			type: 'integer',
		},
		lastUpdate: {
			type: 'integer',
		},
	},
	edit: ( props ) => {
		const {
			attributes: {
				selectedComicNumber,
				comic,
				isCurrentComicSelected,
				lastComicNumber,
				lastUpdate,
			},
			setAttributes,
		} = props;

		function fetchComic( comicNumber = 'latest' ) {
			return window
				.fetch( 'https://xkcd.now.sh/?comic=' + comicNumber )
				.then( ( response ) => {
					if ( response.ok ) {
						return response.json();
					}

					throw new Error(
						__( 'Network response was not ok.', 'xkcd-cgb' )
					);
				} );
		}

		// Checks for new comics, to know which is the higheset ID and latest comic
		function checkForUpdates() {
			const checkUpdateTime = new Date().getTime();
			if (
				lastUpdate !== undefined ||
				lastUpdate - checkUpdateTime < UPDATE_INTERVAL
			) {
				return;
			}

			fetchComic().then( ( newComic ) => {
				const newLastComicNumber = newComic.num;

				// We only update the selected comic number if it's set to latest
				// (or not set) or it's out of boundaries, otherwise we keep it
				const newSelectedComicNumber =
					isCurrentComicSelected ||
					selectedComicNumber === undefined ||
					selectedComicNumber > lastComicNumber
						? newComic.num
						: selectedComicNumber;

				setAttributes( {
					lastComicNumber: newLastComicNumber,
					selectedComicNumber: newSelectedComicNumber,
					lastUpdate: checkUpdateTime,
				} );
			} );
		}

		checkForUpdates();

		// If there is no comic loaded, we load the most recent one
		if ( comic === undefined || comic.num !== selectedComicNumber ) {
			fetchComic( selectedComicNumber ).then( ( newComic ) =>
				setAttributes( {
					comic: newComic,
					selectedComicNumber: newComic.num,
				} )
			);
			return [ __( 'Loading', 'xkcd_cgb' ) ];
		}

		function onComicNumberChange( newValue ) {
			// If the editor is a normal TextControl, it will arrive as a string
			let newComicNumber = parseInt( newValue );

			// Edge cases!
			if ( newComicNumber < 1 ) {
				newComicNumber = 1;
			} else if ( newComicNumber > lastComicNumber ) {
				newComicNumber = lastComicNumber;
			}

			setAttributes( {
				selectedComicNumber: newComicNumber,
				lastUpdate: undefined,
			} );
		}

		// If the experimental NumberControl is available, we use it instead of the TextControl
		const ComicIdControl = React.isValidElement( <NumberControl /> )
			? NumberControl
			: TextControl;

		return [
			<InspectorControls key="panel">
				<PanelBody title={ __( 'Comic settings', 'xkcd-cgb' ) }>
					<ToggleControl
						checked={ isCurrentComicSelected }
						label={ __( 'Display most recent comic?', 'xkcd-cgb' ) }
						onChange={ ( value ) =>
							setAttributes( {
								isCurrentComicSelected: value,
								lastUpdate: undefined,
							} )
						}
					/>

					{ ! isCurrentComicSelected && (
						<div>
							<label
								htmlFor={ props.clientId + '_comic-num-input' }
							>
								<strong>
									{ sprintf(
										/* translators: %2$s is replaced with the number of translations */
										__(
											'Comic number (max %d)',
											'xkcd-cgb'
										),
										lastComicNumber
									) }
								</strong>
							</label>
							<ComicIdControl
								id={ props.clientId + '_comic-num-input' }
								value={ selectedComicNumber }
								onChange={ onComicNumberChange }
							/>
						</div>
					) }
				</PanelBody>
			</InspectorControls>,
			<div key="result" className="xkcd-comic">
				<div className="xkcd-comic__title"> { comic.title } </div>
				<img src={ comic.img } alt={ comic.alt } />
			</div>,
		];
	},
} );
