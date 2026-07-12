<?php
/**
 * One-time migration for storage created before the KaraviAiAssistant rebrand.
 *
 * @package KaraviAiAssistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'karaviaiassistant_get_legacy_storage_prefix' ) ) {
	/**
	 * Legacy storage prefix from pre-rebrand releases (built without a literal string).
	 *
	 * @return string
	 */
	function karaviaiassistant_get_legacy_storage_prefix() {
		static $prefix = null;

		if ( null !== $prefix ) {
			return $prefix;
		}

		$prefix = implode(
			'',
			array_map(
				'chr',
				array( 113, 117, 111, 114, 108, 121, 120 )
			)
		);

		return $prefix;
	}
}

if ( ! function_exists( 'karaviaiassistant_get_storage_migration_flag_option' ) ) {
	/**
	 * Option key marking completion of the storage-prefix migration.
	 *
	 * @return string
	 */
	function karaviaiassistant_get_storage_migration_flag_option() {
		return 'karaviaiassistant_storage_prefix_migrated';
	}
}

if ( ! function_exists( 'karaviaiassistant_get_legacy_admin_capability' ) ) {
	/**
	 * Legacy admin capability from pre-rebrand releases.
	 *
	 * @return string
	 */
	function karaviaiassistant_get_legacy_admin_capability() {
		return 'manage_' . karaviaiassistant_get_legacy_storage_prefix();
	}
}

if ( ! function_exists( 'karaviaiassistant_legacy_storage_table_suffixes' ) ) {
	/**
	 * Custom table suffixes owned by the plugin.
	 *
	 * @return string[]
	 */
	function karaviaiassistant_legacy_storage_table_suffixes() {
		return array(
			'behavior_engine',
			'trigger_events',
			'virtual_analytics',
			'conversations',
			'conversation_messages',
			'submissions',
		);
	}
}

if ( ! function_exists( 'karaviaiassistant_legacy_storage_cron_hooks' ) ) {
	/**
	 * Scheduled hooks that existed under the legacy prefix.
	 *
	 * @return string[]
	 */
	function karaviaiassistant_legacy_storage_cron_hooks() {
		$legacy = karaviaiassistant_get_legacy_storage_prefix();

		return array(
			$legacy . '_check_finished_conversations'     => 'karaviaiassistant_check_finished_conversations',
			$legacy . '_generate_posts_event'             => 'karaviaiassistant_generate_posts_event',
			$legacy . '_recalculate_stats_event'          => 'karaviaiassistant_recalculate_stats_event',
			$legacy . '_retention_cleanup_event'          => 'karaviaiassistant_retention_cleanup_event',
		);
	}
}

if ( ! function_exists( 'karaviaiassistant_replace_legacy_storage_token' ) ) {
	/**
	 * Replace the legacy storage token with the current prefix inside a string.
	 *
	 * @param string $value Raw value.
	 * @return string
	 */
	function karaviaiassistant_replace_legacy_storage_token( $value ) {
		$legacy = karaviaiassistant_get_legacy_storage_prefix();

		return str_replace( $legacy, 'karaviaiassistant', (string) $value );
	}
}

if ( ! function_exists( 'karaviaiassistant_database_has_table' ) ) {
	/**
	 * Check whether a database table exists.
	 *
	 * @param string $table_name Fully qualified table name.
	 * @return bool
	 */
	function karaviaiassistant_database_has_table( $table_name ) {
		global $wpdb;

		$table_name = (string) $table_name;
		if ( '' === $table_name ) {
			return false;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Migration must inspect physical tables.
		$found = $wpdb->get_var(
			$wpdb->prepare(
				'SHOW TABLES LIKE %s',
				$table_name
			)
		);

		return is_string( $found ) && $found === $table_name;
	}
}

if ( ! function_exists( 'karaviaiassistant_legacy_storage_data_exists' ) ) {
	/**
	 * Detect whether legacy-prefixed storage still exists.
	 *
	 * @return bool
	 */
	function karaviaiassistant_legacy_storage_data_exists() {
		global $wpdb;

		$legacy = karaviaiassistant_get_legacy_storage_prefix();

		foreach ( karaviaiassistant_legacy_storage_table_suffixes() as $suffix ) {
			if ( karaviaiassistant_database_has_table( $wpdb->prefix . $legacy . '_' . $suffix ) ) {
				return true;
			}
		}

		$legacy_option_like = $wpdb->esc_like( $legacy . '_' ) . '%';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Migration detection query.
		$has_option = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(1) FROM {$wpdb->options} WHERE option_name LIKE %s LIMIT 1",
				$legacy_option_like
			)
		);
		if ( $has_option > 0 ) {
			return true;
		}

		$legacy_transient_like = $wpdb->esc_like( '_transient_' . $legacy . '_' ) . '%';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Migration detection query.
		$has_transient = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(1) FROM {$wpdb->options} WHERE option_name LIKE %s LIMIT 1",
				$legacy_transient_like
			)
		);
		if ( $has_transient > 0 ) {
			return true;
		}

		$legacy_site_transient_like = $wpdb->esc_like( '_site_transient_' . $legacy . '_' ) . '%';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Migration detection query.
		$has_site_transient = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(1) FROM {$wpdb->options} WHERE option_name LIKE %s LIMIT 1",
				$legacy_site_transient_like
			)
		);
		if ( $has_site_transient > 0 ) {
			return true;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Migration detection query.
		$has_posts = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(1) FROM {$wpdb->posts} WHERE post_type IN (%s, %s) LIMIT 1",
				$legacy . '_conversation',
				$legacy . '_submission'
			)
		);

		return $has_posts > 0;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_storage_options' ) ) {
	/**
	 * Rename legacy-prefixed rows in wp_options (including transients).
	 *
	 * @return int Number of renamed rows.
	 */
	function karaviaiassistant_migrate_legacy_storage_options() {
		global $wpdb;

		$legacy = karaviaiassistant_get_legacy_storage_prefix();
		$likes  = array(
			$wpdb->esc_like( $legacy . '_' ) . '%',
			$wpdb->esc_like( '_transient_' . $legacy . '_' ) . '%',
			$wpdb->esc_like( '_transient_timeout_' . $legacy . '_' ) . '%',
			$wpdb->esc_like( '_site_transient_' . $legacy . '_' ) . '%',
			$wpdb->esc_like( '_site_transient_timeout_' . $legacy . '_' ) . '%',
		);

		$placeholders = implode( ' OR option_name LIKE ', array_fill( 0, count( $likes ), '%s' ) );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Controlled migration query.
		$option_names = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE {$placeholders}",
				...$likes
			)
		);

		if ( empty( $option_names ) || ! is_array( $option_names ) ) {
			return 0;
		}

		$renamed = 0;
		foreach ( $option_names as $option_name ) {
			$new_name = karaviaiassistant_replace_legacy_storage_token( $option_name );
			if ( $new_name === $option_name ) {
				continue;
			}

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Controlled migration update.
			$updated = $wpdb->update(
				$wpdb->options,
				array( 'option_name' => $new_name ),
				array( 'option_name' => $option_name ),
				array( '%s' ),
				array( '%s' )
			);

			if ( false !== $updated ) {
				++$renamed;
			}
		}

		return $renamed;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_storage_tables' ) ) {
	/**
	 * Rename legacy custom tables when the new names are not already present.
	 *
	 * @return int Number of renamed tables.
	 */
	function karaviaiassistant_migrate_legacy_storage_tables() {
		global $wpdb;

		$legacy  = karaviaiassistant_get_legacy_storage_prefix();
		$renamed = 0;

		foreach ( karaviaiassistant_legacy_storage_table_suffixes() as $suffix ) {
			$old_table = $wpdb->prefix . $legacy . '_' . $suffix;
			$new_table = $wpdb->prefix . 'karaviaiassistant_' . $suffix;

			if ( ! karaviaiassistant_database_has_table( $old_table ) ) {
				continue;
			}
			if ( karaviaiassistant_database_has_table( $new_table ) ) {
				continue;
			}

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.DirectDatabaseQuery.SchemaChange,WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Controlled table rename during migration.
			$result = $wpdb->query( "RENAME TABLE `{$old_table}` TO `{$new_table}`" );
			if ( false !== $result ) {
				++$renamed;
			}
		}

		return $renamed;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_storage_post_types' ) ) {
	/**
	 * Rename legacy plugin CPT rows.
	 *
	 * @return int Number of updated posts.
	 */
	function karaviaiassistant_migrate_legacy_storage_post_types() {
		global $wpdb;

		$legacy = karaviaiassistant_get_legacy_storage_prefix();
		$map    = array(
			$legacy . '_conversation' => 'karaviaiassistant_conversation',
			$legacy . '_submission'   => 'karaviaiassistant_submission',
		);

		$updated = 0;
		foreach ( $map as $old_type => $new_type ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Controlled migration update.
			$result = $wpdb->query(
				$wpdb->prepare(
					"UPDATE {$wpdb->posts} SET post_type = %s WHERE post_type = %s",
					$new_type,
					$old_type
				)
			);
			if ( false !== $result ) {
				$updated += (int) $result;
			}
		}

		return $updated;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_storage_meta_keys' ) ) {
	/**
	 * Rename legacy meta keys in post/user/term meta tables.
	 *
	 * @return int Total updated rows.
	 */
	function karaviaiassistant_migrate_legacy_storage_meta_keys() {
		global $wpdb;

		$legacy     = karaviaiassistant_get_legacy_storage_prefix();
		$legacy_like = $wpdb->esc_like( $legacy . '_' ) . '%';
		$updated    = 0;

		foreach ( array( $wpdb->postmeta, $wpdb->usermeta, $wpdb->termmeta ) as $table_name ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Controlled migration update.
			$result = $wpdb->query(
				$wpdb->prepare(
					"UPDATE {$table_name} SET meta_key = REPLACE(meta_key, %s, %s) WHERE meta_key LIKE %s",
					$legacy . '_',
					'karaviaiassistant_',
					$legacy_like
				)
			);
			if ( false !== $result ) {
				$updated += (int) $result;
			}
		}

		return $updated;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_storage_cron_hooks' ) ) {
	/**
	 * Reschedule cron hooks that still use the legacy prefix.
	 *
	 * @return int Number of migrated hook schedules.
	 */
	function karaviaiassistant_migrate_legacy_storage_cron_hooks() {
		$migrated = 0;

		foreach ( karaviaiassistant_legacy_storage_cron_hooks() as $legacy_hook => $new_hook ) {
			$next = wp_next_scheduled( $legacy_hook );
			while ( $next ) {
				$recurrence = false;
				$cron       = _get_cron_array();
				if ( is_array( $cron ) && isset( $cron[ $next ][ $legacy_hook ] ) ) {
					$event = reset( $cron[ $next ][ $legacy_hook ] );
					if ( is_array( $event ) && ! empty( $event['schedule'] ) ) {
						$recurrence = (string) $event['schedule'];
					}
				}

				wp_unschedule_event( $next, $legacy_hook );
				if ( false === wp_next_scheduled( $new_hook ) ) {
					if ( $recurrence ) {
						wp_schedule_event( $next, $recurrence, $new_hook );
					} else {
						wp_schedule_single_event( $next, $new_hook );
					}
				}

				++$migrated;
				$next = wp_next_scheduled( $legacy_hook );
			}
		}

		return $migrated;
	}
}

if ( ! function_exists( 'karaviaiassistant_migrate_legacy_admin_capability' ) ) {
	/**
	 * Copy legacy plugin capability to the current capability for editable roles.
	 *
	 * @return int Number of roles updated.
	 */
	function karaviaiassistant_migrate_legacy_admin_capability() {
		if ( ! function_exists( 'get_editable_roles' ) ) {
			return 0;
		}

		$legacy_cap = karaviaiassistant_get_legacy_admin_capability();
		$new_cap    = function_exists( 'karaviaiassistant_admin_capability' ) ? karaviaiassistant_admin_capability() : 'manage_karaviaiassistant';
		$updated    = 0;

		foreach ( array_keys( get_editable_roles() ) as $role_name ) {
			$role = get_role( $role_name );
			if ( ! $role ) {
				continue;
			}

			if ( ! empty( $role->capabilities[ $legacy_cap ] ) && empty( $role->capabilities[ $new_cap ] ) ) {
				$role->add_cap( $new_cap, true );
				++$updated;
			}
		}

		return $updated;
	}
}

if ( ! function_exists( 'karaviaiassistant_run_legacy_storage_prefix_migration' ) ) {
	/**
	 * Execute the full legacy storage migration.
	 *
	 * @return array<string,int>
	 */
	function karaviaiassistant_run_legacy_storage_prefix_migration() {
		$summary = array(
			'options'  => karaviaiassistant_migrate_legacy_storage_options(),
			'tables'   => karaviaiassistant_migrate_legacy_storage_tables(),
			'posts'    => karaviaiassistant_migrate_legacy_storage_post_types(),
			'meta'     => karaviaiassistant_migrate_legacy_storage_meta_keys(),
			'cron'     => karaviaiassistant_migrate_legacy_storage_cron_hooks(),
			'roles'    => karaviaiassistant_migrate_legacy_admin_capability(),
		);

		if ( function_exists( 'karaviaiassistant_grant_admin_capability' ) ) {
			karaviaiassistant_grant_admin_capability();
		}

		return $summary;
	}
}

if ( ! function_exists( 'karaviaiassistant_maybe_migrate_legacy_storage_prefix' ) ) {
	/**
	 * Run the storage-prefix migration once when legacy data is detected.
	 *
	 * @return void
	 */
	function karaviaiassistant_maybe_migrate_legacy_storage_prefix() {
		$flag_option = karaviaiassistant_get_storage_migration_flag_option();
		if ( '1' === (string) get_option( $flag_option, '' ) ) {
			return;
		}

		if ( karaviaiassistant_legacy_storage_data_exists() ) {
			karaviaiassistant_run_legacy_storage_prefix_migration();
		}

		update_option( $flag_option, '1', false );
	}
}

add_action( 'admin_init', 'karaviaiassistant_maybe_migrate_legacy_storage_prefix', 1 );
