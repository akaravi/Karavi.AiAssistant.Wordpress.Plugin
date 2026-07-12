<?php
/**
 * KaraviAiAssistant bilingual admin/frontend UI helpers (English / Persian).
 *
 * @package KaraviAiAssistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'karaviaiassistant_get_text_domain' ) ) {
	/**
	 * Plugin text domain.
	 *
	 * @return string
	 */
	function karaviaiassistant_get_text_domain() {
		return 'karavi-ai-assistant';
	}
}

if ( ! function_exists( 'karaviaiassistant_get_product_name' ) ) {
	/**
	 * Localized product display name (Karavi AI Assistant).
	 *
	 * @param string $context admin|frontend|default
	 * @return string
	 */
	function karaviaiassistant_get_product_name( $context = 'admin' ) {
		return karaviaiassistant_t( defined( 'KARAVI_AI_ASSISTANT_PRODUCT_NAME' ) ? KARAVI_AI_ASSISTANT_PRODUCT_NAME : 'Karavi AI Assistant', $context );
	}
}

if ( ! function_exists( 'karaviaiassistant_load_textdomain' ) ) {
	/**
	 * Load plugin translations when present.
	 *
	 * @return void
	 */
	function karaviaiassistant_load_textdomain() {
		load_plugin_textdomain(
			karaviaiassistant_get_text_domain(),
			false,
			dirname( plugin_basename( KARAVI_AI_ASSISTANT_PLUGIN_FILE ) ) . '/languages'
		);
	}
}
add_action( 'init', 'karaviaiassistant_load_textdomain' );

if ( ! function_exists( 'karaviaiassistant_normalize_ui_language_code' ) ) {
	/**
	 * Normalize a stored UI language code to auto, en_us, or fa_ir.
	 *
	 * @param mixed $raw Raw option value.
	 * @return string
	 */
	function karaviaiassistant_normalize_ui_language_code( $raw ) {
		$setting = sanitize_key( (string) $raw );
		if ( ! in_array( $setting, array( 'auto', 'en_us', 'fa_ir', 'en', 'fa' ), true ) ) {
			return 'auto';
		}
		if ( 'en' === $setting || 'en_us' === $setting ) {
			return 'en_us';
		}
		if ( 'fa' === $setting || 'fa_ir' === $setting ) {
			return 'fa_ir';
		}
		return 'auto';
	}
}

if ( ! function_exists( 'karaviaiassistant_get_plugin_ui_language_setting' ) ) {
	/**
	 * Raw plugin UI language option for admin or frontend: auto, en_us, fa_ir.
	 *
	 * @param bool   $reset_cache Force reload from database.
	 * @param string $context     admin|frontend.
	 * @return string
	 */
	function karaviaiassistant_get_plugin_ui_language_setting( $reset_cache = false, $context = 'admin' ) {
		static $cached = array(
			'admin'    => null,
			'frontend' => null,
		);

		$context = in_array( $context, array( 'admin', 'frontend' ), true ) ? $context : 'admin';
		if ( $reset_cache ) {
			$cached = array(
				'admin'    => null,
				'frontend' => null,
			);
		}
		if ( null !== $cached[ $context ] ) {
			return $cached[ $context ];
		}

		$defaults = function_exists( 'karaviaiassistant_get_global_defaults' ) ? karaviaiassistant_get_global_defaults() : array();
		$options  = get_option( 'karaviaiassistant_options', $defaults );
		$key      = 'admin' === $context ? 'admin_ui_language' : 'frontend_ui_language';

		if ( isset( $options[ $key ] ) ) {
			$setting = karaviaiassistant_normalize_ui_language_code( $options[ $key ] );
		} elseif ( isset( $options['plugin_ui_language'] ) ) {
			$setting = karaviaiassistant_normalize_ui_language_code( $options['plugin_ui_language'] );
		} else {
			$setting = 'auto';
		}

		$cached[ $context ] = $setting;
		return $setting;
	}
}

if ( ! function_exists( 'karaviaiassistant_reset_ui_language_cache' ) ) {
	/**
	 * Clear cached UI language after options save.
	 *
	 * @return void
	 */
	function karaviaiassistant_reset_ui_language_cache() {
		karaviaiassistant_get_plugin_ui_language_setting( true );
	}
}

if ( ! function_exists( 'karaviaiassistant_locale_starts_with_fa' ) ) {
	/**
	 * Whether a WordPress locale code represents Persian.
	 *
	 * @param string $locale Locale code.
	 * @return bool
	 */
	function karaviaiassistant_locale_starts_with_fa( $locale ) {
		$locale = strtolower( (string) $locale );
		return 0 === strpos( $locale, 'fa' );
	}
}

if ( ! function_exists( 'karaviaiassistant_resolve_ui_locale' ) ) {
	/**
	 * Resolve effective UI locale for admin or frontend.
	 *
	 * @param string $context admin|frontend.
	 * @return string en_US|fa_IR
	 */
	function karaviaiassistant_resolve_ui_locale( $context = 'admin' ) {
		$context = in_array( $context, array( 'admin', 'frontend' ), true ) ? $context : 'admin';
		$setting = karaviaiassistant_get_plugin_ui_language_setting( false, $context );

		if ( 'en_us' === $setting ) {
			return 'en_US';
		}
		if ( 'fa_ir' === $setting ) {
			return 'fa_IR';
		}

		if ( 'admin' === $context ) {
			$locale = function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
		} else {
			$locale = function_exists( 'determine_locale' ) ? determine_locale() : get_locale();
		}

		return karaviaiassistant_locale_starts_with_fa( $locale ) ? 'fa_IR' : 'en_US';
	}
}

if ( ! function_exists( 'karaviaiassistant_is_fa_ui' ) ) {
	/**
	 * Whether Persian UI strings should be used in the current context.
	 *
	 * @param string $context admin|frontend.
	 * @return bool
	 */
	function karaviaiassistant_is_fa_ui( $context = 'admin' ) {
		return 'fa_IR' === karaviaiassistant_resolve_ui_locale( $context );
	}
}

if ( ! function_exists( 'karaviaiassistant_get_fa_translation_map' ) ) {
	/**
	 * Load Persian UI string map.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_fa_translation_map() {
		static $map = null;
		if ( null !== $map ) {
			return $map;
		}

		$file = dirname( KARAVI_AI_ASSISTANT_PLUGIN_FILE ) . '/languages/translations-fa_IR.php';
		if ( is_readable( $file ) ) {
			$loaded = include $file;
			$map      = is_array( $loaded ) ? $loaded : array();
		} else {
			$map = array();
		}

		$tour_file = dirname( KARAVI_AI_ASSISTANT_PLUGIN_FILE ) . '/languages/tour-translations-fa_IR.php';
		if ( is_readable( $tour_file ) ) {
			$tour_loaded = include $tour_file;
			if ( is_array( $tour_loaded ) ) {
				$map = array_merge( $map, $tour_loaded );
			}
		}

		return $map;
	}
}

if ( ! function_exists( 'karaviaiassistant_t' ) ) {
	/**
	 * Translate a UI string for admin or frontend context.
	 *
	 * @param string $text    English source string.
	 * @param string $context admin|frontend.
	 * @return string
	 */
	function karaviaiassistant_t( $text, $context = 'admin' ) {
		$text = (string) $text;
		if ( '' === trim( $text ) ) {
			return $text;
		}

		$translated = __( $text, karaviaiassistant_get_text_domain() );
		if ( $translated !== $text ) {
			return $translated;
		}

		if ( ! karaviaiassistant_is_fa_ui( $context ) ) {
			return $text;
		}

		$map = karaviaiassistant_get_fa_translation_map();
		return $map[ $text ] ?? $text;
	}
}

if ( ! function_exists( 'karaviaiassistant_te' ) ) {
	/**
	 * Echo a translated UI string.
	 *
	 * @param string $text    English source string.
	 * @param string $context admin|frontend.
	 * @return void
	 */
	function karaviaiassistant_te( $text, $context = 'admin' ) {
		echo esc_html( karaviaiassistant_t( $text, $context ) );
	}
}

if ( ! function_exists( 'karaviaiassistant_get_frontend_ui_strings' ) ) {
	/**
	 * Localized frontend chat widget strings.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_frontend_ui_strings() {
		$keys = array(
			'aiAssistant'        => 'AI Assistant',
			'expand'             => 'Expand',
			'shrink'             => 'Shrink',
			'toggleChatSize'     => 'Toggle chat size',
			'closeChat'          => 'Close chat',
			'chatForm'           => 'Chat form',
			'message'            => 'Message',
			'typeYourMessage'    => 'Type your message...',
			'send'               => 'Send',
			'sendMessage'        => 'Send message',
			'networkError'       => 'Network error. Please try again.',
			'apiError'           => 'API error',
			'noResponse'         => 'Sorry, I couldn\'t get a response.',
			'viewProduct'        => 'View Product',
			'homepage'           => 'Homepage',
			'addedToCart'        => 'Added to cart!',
			'preparingQuickTip'  => 'Preparing a quick tip...',
			'leavePageConfirm'   => 'Are you sure you want to leave?',
		);

		$out = array();
		foreach ( $keys as $id => $english ) {
			$out[ $id ] = karaviaiassistant_t( $english, 'frontend' );
		}

		return $out;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_admin_ui_strings' ) ) {
	/**
	 * Localized admin UI strings for inline JavaScript.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_admin_ui_strings() {
		$keys = array(
			'guideStart'              => 'Start a conversation with the guide. Follow-up questions are supported.',
			'guide'                   => 'Guide',
			'you'                     => 'You',
			'resetHistoryConfirm'     => 'Are you sure you want to reset the generation history? This will allow previously used keywords and products to be used again.',
			'resetting'               => 'Resetting...',
			'historyResetSuccess'     => 'History reset successfully.',
			'errorPrefix'             => 'Error:',
			'unknownError'            => 'Unknown error',
			'noNewProducts'           => 'No new products found. All products appear to already have generated posts or are in the generation history.',
			'replaceQueueConfirm'     => 'Replace existing queue with all products?',
			'deleteLogsConfirm'       => 'Are you sure you want to delete the selected logs?',
			'clearLogsConfirm'        => 'Are you sure you want to clear all logs?',
			'selectedSuffix'          => ' Selected',
			'filterByType'            => 'Filter by Type',
			'labelOrNameRequired'     => 'Label or Name is required.',
			'removeItemConfirm'       => 'Are you sure you want to remove this item? This cannot be undone until you save changes.',
			'couldNotFetchModels'     => 'Could not fetch models.',
			'enterApiKeyFetchModels'  => 'Enter API key to fetch models.',
			'noCompatibleModels'      => 'No compatible models found.',
			'selectProviderFetchModels' => 'Select a provider to fetch models.',
			'enterProviderApiKey'     => 'Enter API key for this provider to fetch models.',
			'errorGeneratingKeywords' => 'Error generating keywords:',
			'unknownErrorOccurred'    => 'An unknown error occurred.',
			'businessDescriptionFirst'=> 'Please provide a business description first.',
			'enterTopicToAnalyze'     => 'Please enter a topic to analyze.',
			'chooseTargetsFirst'      => 'Please choose one or more targets first.',
			'couldNotDeleteSuggestion'=> 'Could not delete this suggestion.',
			'couldNotUpdateImproved'  => 'Could not update improved status.',
			'failedDismissNotice'     => 'Failed to dismiss notice.',
			'failedSaveAdminTheme'    => 'Could not save theme preference.',
			'selectLogo'              => 'Select Logo',
			'useThisLogo'             => 'Use this logo',
			'selectModel'             => 'Select Model',
			'selectProvider'          => 'Select Provider',
			'analysisFailed'          => 'Analysis failed:',
			'networkError'            => 'Network error',
			'healthCheckFailed'       => 'Health check failed.',
			'frontendProbeFailed'     => 'Frontend probe failed.',
			'snapshotFailed'          => 'Snapshot failed.',
			'enterQuestionFirst'      => 'Please enter a question first.',
			'guideResponseFailed'     => 'Guide response failed.',
			'errorFetchingProducts'   => 'Error fetching products.',
			'failedFetchProducts'     => 'Failed to fetch products.',
			'removeGoalConfirm'       => 'Are you sure you want to remove this goal?',
			'removeTriggerConfirm'    => 'Are you sure you want to remove this trigger?',
			'triggerNameRequired'     => 'Trigger Name is required.',
			'mediaUploaderUnavailable'=> 'WordPress media uploader is not available on this screen. Refresh the settings page and try again.',
			'selectCsvFirst'          => 'Please select a CSV file first.',
			'validCsvRequired'        => 'Please upload a valid CSV file.',
			'mapUrlColumnRequired'    => 'You must map at least one column as the Post / Product URL or ID.',
			'fileMissingUploadAgain'  => 'File missing. Please try uploading again.',
			'processingError'         => 'Processing error:',
			'fetchingModels'          => 'Fetching models...',
			'selectModelPlaceholder'  => 'Select from list or type model ID',
			'markAsImproved'          => 'Mark as Improved',
			'removeImprovedTag'       => 'Remove Improved Tag',
			'bulkScope'               => 'Bulk Scope',
			'contentLabel'            => 'Content',
			'sortAToZ'                => 'Sort A to Z',
			'sortZToA'                => 'Sort Z to A',
			'sortLowToHigh'           => 'Sort low to high',
			'sortHighToLow'           => 'Sort high to low',
			'requestFailed'           => 'Request failed:',
			'failedParseCsv'          => 'Failed to parse CSV.',
			'serverRequestFailedNetwork' => 'Server request failed. Please check the network tab.',
			'serverRequestFailedLogs' => 'Server request failed. Please check network logs.',
			'serverRequestFailed'     => 'Server request failed.',
			'unknownProcessingError'  => 'Unknown processing error.',
			'scanCompleteFound'       => 'Scan Complete! Found data from:',
			'scanCompleteSynced'      => 'Synced',
			'scanCompleteRecordsSuffix' => 'records.',
			'scanFinishedNoData'      => 'Scan finished. No external analytics table or historical orders found to import.',
			'uploading'               => 'Uploading...',
			'uploadAndMapColumns'     => 'Upload and Map Columns',
			'importingData'           => 'Importing Data...',
			'finalizeImport'          => 'Finalize Import',
			'scanning'                => 'Scanning...',
			'scanLocalDataSources'    => 'Scan Local Data Sources',
			'unnamedGoal'             => 'Unnamed Goal',
			'selectKbFilesTitle'      => 'Select Knowledge Base files',
			'useSelectedKbFiles'      => 'Use selected files',
			'removeKbFile'            => 'Remove',
			'select2InputTooShort'      => 'Type at least 3 characters',
			'select2NoProducts'       => 'No products found',
			'select2Searching'          => 'Searching…',
			'select2ErrorLoading'       => 'Unable to load results',
			'productSearchPlaceholder'  => 'Search for and add products...',
			'seoSuggestionsEmpty'       => 'Saved SEO suggestions will appear here.',
			'openContent'               => 'Open content',
			'deleteLabel'               => 'Delete',
			'seoSuggestionTitle'        => 'SEO Suggestion',
			'csvColumnPrefix'           => 'Column:',
			'csvImportSuccess'          => 'Success!',
			'csvImportHistoricalRows'   => 'Historical data (%1$s rows) imported. Dashboard insights will now reflect this data.',
            'csvImportSkippedRows'      => '%1$s rows were skipped. See the Logs tab for row-level details.',
			'seoBadgeAi'                => 'AI',
			'seoBadgeManual'            => 'Manual',
			'seoBadgeImproved'          => 'Improved',
			'typeModelIdManuallySuffix' => ' — type model ID manually',
			'noTriggersConfigured'    => 'No triggers configured yet.',
			'notAvailableShort'         => 'n/a',
			'eligible'                  => 'Eligible',
			'suppressed'                => 'Suppressed',
			'loadingCoupons'            => 'Loading coupons...',
			'selectCoupon'              => 'Select coupon',
			'noCouponsFound'            => 'No coupons found',
			'noModelsFound'             => 'No models found',
			'errorFetchingModels'       => 'Error fetching models',
			'resetSelectOptionRequired' => 'Please select at least one option to reset.',
			'resetDataError'            => 'An error occurred. Please try again.',
			'resetDataSuccessReloading' => 'Data reset successfully. Reloading dashboard...',
			'resetReloadingSuffix'      => ' Reloading dashboard...',
			'aiSuggestionUnavailable'   => 'AI suggestion is unavailable right now. Please reload the page and try again.',
			'aiSuggesting'              => 'Suggesting...',
			'aiGeneratingSuggestion'    => 'Generating AI suggestion...',
			'aiSuggestAgain'            => 'Suggest Again',
			'aiNoSuggestionReturned'    => 'No AI suggestion was returned.',
			'aiTryAgain'                => 'Try Again',
			'aiCouldNotGenerate'        => 'Could not generate AI suggestion right now.',
			'hideDetails'               => 'Hide details',
			'viewDetails'               => 'View details',
			'guideFindingIssue'         => 'Issue',
			'guideFindingAction'        => 'Action:',
			'guideSeverityError'        => 'ERROR',
			'guideSeverityWarning'      => 'WARNING',
			'guideSeveritySuccess'      => 'SUCCESS',
			'guideStatusPass'           => 'PASS',
			'guideStatusFail'           => 'FAIL',
		);

		$out = array();
		foreach ( $keys as $id => $english ) {
			$out[ $id ] = karaviaiassistant_t( $english, 'admin' );
		}

		return $out;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_csv_column_map_labels' ) ) {
	/**
	 * Localized CSV import column mapping labels keyed by field id.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_csv_column_map_labels() {
		$fields = array(
			'ignore'           => '-- Ignore --',
			'identifier'       => 'Post / Product URL or ID (Required)',
			'views'            => 'Page Views / Product Views',
			'add_to_cart'      => 'Add to Cart product',
			'checkout_flow'    => 'Checkout Flow (Auto-detect by header)',
			'checkout_visits'  => 'Checkout Visits',
			'checkout_success' => 'Checkout Success',
			'cart_drop_off'    => 'Cart Drop-Off',
			'checkout_drop_off'=> 'Checkout Drop-Off',
			'conversions'      => 'Conversions product/Posts',
			'time'             => 'Avg. Time on Page',
			'scroll'           => 'Avg. Scroll Depth (%)',
		);

		$out = array();
		foreach ( $fields as $field_id => $english ) {
			$out[ $field_id ] = karaviaiassistant_t( $english, 'admin' );
		}

		return $out;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_select2_product_search_strings' ) ) {
	/**
	 * Localized Select2 strings for WooCommerce product search fields.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_select2_product_search_strings() {
		return array(
			'placeholder'    => karaviaiassistant_t( 'Search for and add products...', 'admin' ),
			'inputTooShort'  => karaviaiassistant_t( 'Type at least 3 characters', 'admin' ),
			'noResults'      => karaviaiassistant_t( 'No products found', 'admin' ),
			'searching'      => karaviaiassistant_t( 'Searching…', 'admin' ),
			'errorLoading'   => karaviaiassistant_t( 'Unable to load results', 'admin' ),
		);
	}
}

if ( ! function_exists( 'karaviaiassistant_get_kb_media_strings' ) ) {
	/**
	 * Localized wp.media strings for knowledge-base file picker.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_kb_media_strings() {
		return array(
			'title'  => karaviaiassistant_t( 'Select Knowledge Base files', 'admin' ),
			'button' => karaviaiassistant_t( 'Use selected files', 'admin' ),
			'remove' => karaviaiassistant_t( 'Remove', 'admin' ),
		);
	}
}

if ( ! function_exists( 'karaviaiassistant_get_tour_ui_string_keys' ) ) {
	/**
	 * English source keys used by the admin guided tour.
	 *
	 * @return array<int,string>
	 */
	function karaviaiassistant_get_tour_ui_string_keys() {
		static $keys = null;
		if ( null !== $keys ) {
			return $keys;
		}

		$file = dirname( KARAVI_AI_ASSISTANT_PLUGIN_FILE ) . '/languages/tour-ui-keys.json';
		if ( is_readable( $file ) ) {
			$decoded = json_decode( (string) file_get_contents( $file ), true );
			$keys    = is_array( $decoded ) ? array_values( array_filter( array_map( 'strval', $decoded ) ) ) : array();
			return $keys;
		}

		$keys = array();
		return $keys;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_tour_ui_strings' ) ) {
	/**
	 * Localized guided-tour strings keyed by English source text.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_tour_ui_strings() {
		$out = array();
		foreach ( karaviaiassistant_get_tour_ui_string_keys() as $english ) {
			$out[ $english ] = karaviaiassistant_t( $english, 'admin' );
		}

		return $out;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_post_editor_ui_strings' ) ) {
	/**
	 * Localized post editor sidebar strings for post-editor.min.js.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_post_editor_ui_strings() {
		$keys = array(
			'schemaGeneratedSuccess' => 'Schema generated and saved successfully!',
			'unknownErrorOccurred'   => 'An unknown error occurred.',
			'errorPrefix'            => 'Error:',
			'suggestions'            => 'Suggestions:',
			'seoImprovementPlan'     => 'SEO Improvement Plan:',
		);

		$out = array();
		foreach ( $keys as $id => $english ) {
			$out[ $id ] = karaviaiassistant_t( $english, 'admin' );
		}

		return $out;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_admin_ui_theme' ) ) {
	/**
	 * Resolved admin panel theme preference (auto, light, dark).
	 *
	 * @return string
	 */
	function karaviaiassistant_get_admin_ui_theme() {
		static $cached = null;
		if ( null !== $cached ) {
			return $cached;
		}

		$user_id = get_current_user_id();
		if ( $user_id ) {
			$user_theme = sanitize_key( (string) get_user_meta( $user_id, 'karaviaiassistant_admin_ui_theme', true ) );
			if ( in_array( $user_theme, array( 'auto', 'light', 'dark' ), true ) ) {
				$cached = $user_theme;
				return $cached;
			}
		}

		$defaults = function_exists( 'karaviaiassistant_get_global_defaults' )
			? karaviaiassistant_get_global_defaults()
			: array( 'admin_ui_theme' => 'auto' );
		$options  = get_option( 'karaviaiassistant_options', $defaults );
		$theme    = sanitize_key( (string) ( $options['admin_ui_theme'] ?? 'auto' ) );
		$cached   = in_array( $theme, array( 'auto', 'light', 'dark' ), true ) ? $theme : 'auto';

		return $cached;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_admin_ui_theme_labels' ) ) {
	/**
	 * Translated labels for admin UI theme modes.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_admin_ui_theme_labels() {
		return array(
			'auto'  => karaviaiassistant_t( 'Theme: Auto', 'admin' ),
			'light' => karaviaiassistant_t( 'Theme: Light', 'admin' ),
			'dark'  => karaviaiassistant_t( 'Theme: Dark', 'admin' ),
		);
	}
}

if ( ! function_exists( 'karaviaiassistant_is_karavi_admin_screen' ) ) {
	/**
	 * Whether the current admin screen belongs to Karavi AI Assistant.
	 *
	 * @return bool
	 */
	function karaviaiassistant_is_karavi_admin_screen() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen ) {
			return false;
		}

		return false !== strpos( (string) $screen->id, 'karavi-ai-assistant' )
			|| in_array( (string) $screen->post_type, array( 'karaviaiassistant_submission', 'karaviaiassistant_conversation' ), true );
	}
}

if ( ! function_exists( 'karaviaiassistant_is_karavi_admin_hook' ) ) {
	/**
	 * Whether the current admin hook belongs to Karavi AI Assistant screens.
	 *
	 * @param string $hook Current admin hook.
	 * @return bool
	 */
	function karaviaiassistant_is_karavi_admin_hook( $hook ) {
		if ( false !== strpos( (string) $hook, 'karavi-ai-assistant-' ) ) {
			return true;
		}

		return 'toplevel_page_karavi-ai-assistant-dashboard' === $hook;
	}
}

if ( ! function_exists( 'karaviaiassistant_admin_body_class' ) ) {
	/**
	 * Add RTL body class for Persian admin UI.
	 *
	 * @param string $classes Existing classes.
	 * @return string
	 */
	function karaviaiassistant_admin_body_class( $classes ) {
		if ( ! karaviaiassistant_is_karavi_admin_screen() ) {
			return $classes;
		}

		if ( karaviaiassistant_is_fa_ui( 'admin' ) ) {
			$classes .= ' karavi-ai-assistant-admin-rtl';
		}

		$admin_theme = karaviaiassistant_get_admin_ui_theme();
		if ( 'light' === $admin_theme ) {
			$classes .= ' karavi-ai-assistant-theme-light';
		} elseif ( 'dark' === $admin_theme ) {
			$classes .= ' karavi-ai-assistant-theme-dark';
		} else {
			$classes .= ' karavi-ai-assistant-theme-auto';
		}

		return $classes;
	}
}
add_filter( 'admin_body_class', 'karaviaiassistant_admin_body_class' );

if ( ! function_exists( 'karaviaiassistant_register_admin_bar_theme_toggle' ) ) {
	/**
	 * Admin bar control to cycle Karavi admin theme (auto / light / dark).
	 *
	 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance.
	 * @return void
	 */
	function karaviaiassistant_register_admin_bar_theme_toggle( $wp_admin_bar ) {
		if ( ! is_admin() || ! karaviaiassistant_is_karavi_admin_screen() ) {
			return;
		}

		if ( ! function_exists( 'karaviaiassistant_current_user_can_manage' ) || ! karaviaiassistant_current_user_can_manage() ) {
			return;
		}

		$theme   = karaviaiassistant_get_admin_ui_theme();
		$labels  = karaviaiassistant_get_admin_ui_theme_labels();
		$title   = isset( $labels[ $theme ] ) ? $labels[ $theme ] : $labels['auto'];
		$tooltip = karaviaiassistant_t( 'Click to cycle admin panel theme (auto, light, dark)', 'admin' );

		$wp_admin_bar->add_node(
			array(
				'id'    => 'karavi-ai-assistant-theme-toggle',
				'title' => '<span class="ab-icon dashicons dashicons-admin-appearance" aria-hidden="true"></span><span class="karavi-ai-assistant-admin-bar-theme-label">' . esc_html( $title ) . '</span>',
				'href'  => '#karavi-ai-assistant-theme-toggle',
				'meta'  => array(
					'class' => 'karavi-ai-assistant-admin-bar-theme',
					'title' => esc_attr( $tooltip ),
				),
			)
		);
	}
}
add_action( 'admin_bar_menu', 'karaviaiassistant_register_admin_bar_theme_toggle', 100 );

if ( ! function_exists( 'karaviaiassistant_get_about_profile_links' ) ) {
	/**
	 * Canonical owner and company URLs for the About admin tab.
	 *
	 * @return array<string,string>
	 */
	function karaviaiassistant_get_about_profile_links() {
		$links = array(
			'owner'         => 'https://alikaravi.com',
			'ntk_iran'      => 'https://ntk.ir',
			'karavi_canada' => 'https://karavi.ca',
			'github'        => defined( 'KARAVI_AI_ASSISTANT_GITHUB_REPOSITORY_URL' ) ? KARAVI_AI_ASSISTANT_GITHUB_REPOSITORY_URL : 'https://github.com/akaravi/KaraviAiAssistant/',
		);

		return apply_filters( 'karaviaiassistant_about_profile_links', $links );
	}
}

if ( ! function_exists( 'karaviaiassistant_enqueue_design_system_styles' ) ) {
	/**
	 * Enqueue shared 2026 design tokens and accessibility baseline styles.
	 *
	 * @return void
	 */
	function karaviaiassistant_enqueue_design_system_styles() {
		if ( ! function_exists( 'karaviaiassistant_get_plugin_asset_url' ) ) {
			return;
		}

		$version = defined( 'KARAVI_AI_ASSISTANT_VERSION' ) ? KARAVI_AI_ASSISTANT_VERSION : '2.2.8';

		wp_enqueue_style(
			'karavi-ai-assistant-design-tokens',
			karaviaiassistant_get_plugin_asset_url( 'assets/css/karavi-design-tokens.css' ),
			array(),
			$version
		);

		wp_enqueue_style(
			'karavi-ai-assistant-ui-a11y',
			karaviaiassistant_get_plugin_asset_url( 'assets/css/karavi-ui-a11y.css' ),
			array( 'karavi-ai-assistant-design-tokens' ),
			$version
		);
	}
}
add_action( 'admin_enqueue_scripts', 'karaviaiassistant_enqueue_design_system_styles', 5 );
add_action( 'wp_enqueue_scripts', 'karaviaiassistant_enqueue_design_system_styles', 5 );

if ( ! function_exists( 'karaviaiassistant_enqueue_admin_theme_styles' ) ) {
	/**
	 * Enqueue admin/dashboard theme overrides on Karavi screens.
	 *
	 * @param string $hook Current admin hook.
	 * @return void
	 */
	function karaviaiassistant_enqueue_admin_theme_styles( $hook ) {
		if ( ! karaviaiassistant_is_karavi_admin_hook( $hook ) ) {
			return;
		}

		if ( ! function_exists( 'karaviaiassistant_get_plugin_asset_url' ) ) {
			return;
		}

		$version = defined( 'KARAVI_AI_ASSISTANT_VERSION' ) ? KARAVI_AI_ASSISTANT_VERSION : '2.2.10';

		wp_enqueue_style(
			'karavi-ai-assistant-admin-theme',
			karaviaiassistant_get_plugin_asset_url( 'assets/css/karavi-admin-theme.css' ),
			array( 'karavi-ai-assistant-design-tokens' ),
			$version
		);
	}
}
add_action( 'admin_enqueue_scripts', 'karaviaiassistant_enqueue_admin_theme_styles', 6 );

if ( ! function_exists( 'karaviaiassistant_enqueue_admin_rtl_styles' ) ) {
	/**
	 * Inline RTL tweaks for KaraviAiAssistant admin screens.
	 *
	 * @param string $hook Current admin hook.
	 * @return void
	 */
	function karaviaiassistant_enqueue_admin_rtl_styles( $hook ) {
		if ( ! karaviaiassistant_is_fa_ui( 'admin' ) ) {
			return;
		}

		$is_karaviaiassistant_admin = karaviaiassistant_is_karavi_admin_hook( $hook );
		if ( ! $is_karaviaiassistant_admin ) {
			return;
		}

		wp_add_inline_style(
			'karavi-ai-assistant-admin-css',
			'.karavi-ai-assistant-admin-rtl .karavi-ai-assistant-settings-wrap,
			.karavi-ai-assistant-admin-rtl .karavi-ai-assistant-dashboard-wrap { direction: rtl; text-align: right; }
			.karavi-ai-assistant-admin-rtl .form-table th { text-align: right; }
			.karavi-ai-assistant-admin-rtl .karavi-ai-assistant-help-tip { margin-inline-start: 6px; margin-inline-end: 0; }
			.karavi-ai-assistant-admin-rtl .hndle .toggle-arrow { float: left !important; }
			.karavi-ai-assistant-admin-rtl input[type="url"],
			.karavi-ai-assistant-admin-rtl input[type="email"],
			.karavi-ai-assistant-admin-rtl .karavi-ai-assistant-model-combobox,
			.karavi-ai-assistant-admin-rtl .karavi-ai-assistant-openai-api-base-url-input { direction: ltr; text-align: left; }'
		);
	}
}
add_action( 'admin_enqueue_scripts', 'karaviaiassistant_enqueue_admin_rtl_styles', 20 );
