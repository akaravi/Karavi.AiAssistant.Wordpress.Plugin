jQuery(document).ready(function ($) {
	const tourT = (text) => {
		const map = (karaviAiAssistantTourData && karaviAiAssistantTourData.uiStrings) ? karaviAiAssistantTourData.uiStrings : {};
		return map[text] || text;
	};

	if (typeof Shepherd === 'undefined' || typeof karaviAiAssistantTourData === 'undefined') {
		console.warn('Shepherd.js or karaviAiAssistantTourData is not available.');
		return;
	}

	const tour = new Shepherd.Tour({
		useModalOverlay: true,
		defaultStepOptions: {
			classes: 'karavi-ai-assistant-shepherd-tour-modern shadow-md',
			scrollTo: { behavior: 'smooth', block: 'center' },
			cancelIcon: { enabled: true }
		}
	});

	const goToDashboard = () => {
		try {
			if (karaviAiAssistantTourData.dashboard_url_start_tour) {
				window.location.href = karaviAiAssistantTourData.dashboard_url_start_tour;
				return;
			}
			const base = karaviAiAssistantTourData.dashboard_url || '';
			if (!base) return;
			const needsAmp = base.indexOf('?') !== -1;
			const sep = needsAmp ? '&' : '?';
			const url = base + sep + 'start_tour=true';
			window.location.href = url;
		} catch (e) {
			window.location.href = (karaviAiAssistantTourData.dashboard_url || 'admin.php?page=karavi-ai-assistant-dashboard') + '&start_tour=true';
		}
	};

	const goToSettingsTab = (tab) => window.location.href = `${karaviAiAssistantTourData.settings_url}&tab=${tab}&start_tour=true`;
	const goToChatbotSettings = () => goToSettingsTab('chatbot');
	const goToContentEngine = () => goToSettingsTab('content_engine');
	const goToLogsTab = () => goToSettingsTab('logs');

	const ensureTriggerEditor = (typeToSelect = null) => {
		const $container = $('#karavi-ai-assistant-triggers-container');
		if (!$container.length) return null;

		if (!$container.children('.karavi-ai-assistant-trigger-item').length) {
			$('#karavi-ai-assistant-add-trigger').trigger('click');
			const $newItem = $container.children('.karavi-ai-assistant-trigger-item').last();
			if ($newItem.length) {
				$newItem.attr('data-tour-created', '1');
			}
		}

		const $firstItem = $container.children('.karavi-ai-assistant-trigger-item').first();
		if (!$firstItem.length) return null;

		$firstItem.attr('data-state', 'edit');
		$firstItem.find('.karavi-ai-assistant-repeater-view').hide();
		$firstItem.find('.karavi-ai-assistant-repeater-editor').show();

		if (typeToSelect) {
			const $typeSelect = $firstItem.find('.karavi-ai-assistant-trigger-type-select');
			if ($typeSelect.length && $typeSelect.val() !== typeToSelect) {
				$typeSelect.val(typeToSelect).trigger('change');
			}
		}

		return $firstItem;
	};

	const ensureBasicSettingsOpen = () => {
		ensureCollapsibleSectionOpen('#tour-step-basic-settings-a');
	};

	const ensureBasicSettingsClosed = () => {
		ensureCollapsibleSectionClosed('#tour-step-basic-settings-a');
	};

	const ensurePerformanceControlsOpen = () => {
		ensureCollapsibleSectionOpen('#tour-step-performance-controls');
	};

	const ensurePerformanceControlsClosed = () => {
		ensureCollapsibleSectionClosed('#tour-step-performance-controls');
	};

	const ensureContentInsightsOpen = () => {
		ensureCollapsibleSectionOpen('#tour-step-content-insights-settings');
	};

	const ensureContentInsightsClosed = () => {
		ensureCollapsibleSectionClosed('#tour-step-content-insights-settings');
	};

	const ensureAdvancedAppearanceOpen = () => {
		ensureCollapsibleSectionOpen('#tour-step-advanced-appearance');
	};

	const ensureAdvancedAppearanceClosed = () => {
		ensureCollapsibleSectionClosed('#tour-step-advanced-appearance');
	};

	const ensureCollapsibleSectionOpen = (selector) => {
		const $header = $(selector).first();
		if (!$header.length) return;

		if ($header.hasClass('karavi-ai-assistant-card')) {
			const $cardContent = $header.children('.inside.karavi-ai-assistant-collapsible-content, .karavi-ai-assistant-collapsible-content').first();
			if ($cardContent.length && !$cardContent.is(':visible')) {
				$header.children('.hndle.karavi-ai-assistant-collapsible-header, .karavi-ai-assistant-collapsible-header').first().trigger('click');
			}
			return;
		}

		const $content = $header.is('tr')
			? $header.closest('tbody').next('tbody.karavi-ai-assistant-collapsible-content')
			: $header.next('.karavi-ai-assistant-collapsible-content');

		if ($content.length && !$content.is(':visible')) {
			$header.trigger('click');
		}
	};

	const ensureCollapsibleSectionClosed = (selector) => {
		const $header = $(selector).first();
		if (!$header.length) return;

		if ($header.hasClass('karavi-ai-assistant-card')) {
			const $cardContent = $header.children('.inside.karavi-ai-assistant-collapsible-content, .karavi-ai-assistant-collapsible-content').first();
			if ($cardContent.length && $cardContent.is(':visible')) {
				$header.children('.hndle.karavi-ai-assistant-collapsible-header, .karavi-ai-assistant-collapsible-header').first().trigger('click');
			}
			return;
		}

		const $content = $header.is('tr')
			? $header.closest('tbody').next('tbody.karavi-ai-assistant-collapsible-content')
			: $header.next('.karavi-ai-assistant-collapsible-content');

		if ($content.length && $content.is(':visible')) {
			$header.trigger('click');
		}
	};

	const ensureStepFocus = (selector, openFn = null) => new Promise((resolve) => {
		setTimeout(() => {
			if (typeof openFn === 'function') {
				openFn();
			}

			const $el = $(selector).first();
			if ($el.length) {
				$el[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
			}

			setTimeout(resolve, 240);
		}, 40);
	});

	const speechSupported = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
	const audioSupported = typeof window.Audio !== 'undefined';
	const recordedAudioBaseUrl = String(karaviAiAssistantTourData.tour_audio_base_url || '');
	const recordedAudioEnabled = audioSupported && recordedAudioBaseUrl.length > 0;
	let voiceGuideEnabled = recordedAudioEnabled || speechSupported;
	let narrationNeedsUserGesture = false;
	let currentUtterance = null;
	let currentNarrationAudio = null;
	let pendingNarrationTimer = null;
	const narrationLibraryTracks = [
		{ file: 'trigger-master-long-form.wav', label: 'Play Trigger Master' },
		{ file: 'trigger-60s-cut.wav', label: 'Play 60s Cut' },
		{ file: 'full-tour-voiceover.wav', label: 'Play Full Voiceover' }
	];

	const narrationByStep = {
		'intro': 'Most chatbot plugins show messages. Karavi AI Assistant shows what to change to increase conversions.',
		'dashboard-ab': 'See which variation actually wins with real performance data, not guesswork.',
		'dashboard-manage-data': 'Reset selected metrics cleanly so each new test starts from trusted numbers.',
		'dashboard-triggers': 'Get a quick view of active engagement logic across your funnel.',
		'dashboard-trigger-analytics': 'Compare seven day, thirty day, and lifetime performance to find what drives revenue.',
		'dashboard-health': 'Verify providers, keys, and setup fast so your growth system stays reliable.',
		'dashboard-export': 'Export evidence ready CSV reports for your team and clients.',
		'dashboard-to-settings': 'Now move from analytics into the settings that shape conversion behavior.',
		'settings-intro': 'This is your conversion control room for behavior, messaging, and targeting.',
		'ab-toggle': 'Test two approaches and keep the variation that performs better.',
		'basic-settings': 'Connect the core foundation that powers every answer and trigger.',
		'api-key': 'Link your model provider to deliver fast, intelligent responses.',
		'bot-name': 'Brand the assistant so users trust they are talking to your business.',
		'floating-logo': 'Make the chat entry point feel native to your site experience.',
		'welcome-message': 'Set a first impression that turns visitors into conversations.',
		'persona': 'Define role, tone, and guardrails so responses stay useful and on brand.',
		'knowledge-base': 'Use your pages and products as context for accurate answers.',
		'ai-gen-buttons': 'Surface smart action buttons automatically to reduce friction.',
		'quick-buttons': 'Offer instant shortcuts to high intent actions.',
		'performance-controls': 'Balance speed, quality, and AI cost with practical controls.',
		'performance-product-excerpt': 'Keep product context concise for fast focused replies.',
		'performance-content-excerpt': 'Tune page context depth to improve precision.',
		'performance-context-detail': 'Choose compact or full context based on quality goals.',
		'performance-routing-model': 'Route simple requests to lower cost models.',
		'performance-object-cache': 'Use cache to reduce repeated lookups and improve response speed.',
		'performance-tool-calling': 'Enable live product lookup for up to date shopping help.',
		'content-insights-settings': 'Connect content performance signals directly to trigger strategy.',
		'content-insights-scope': 'Track only the content scope that matters to your campaign.',
		'content-insights-targeting': 'Focus on important pages and exclude low value paths.',
		'content-insights-filters': 'Segment AI and manual content to prioritize better.',
		'advanced-appearance': 'Fine tune visual style without sacrificing usability.',
		'button-styling': 'Match action styling to your brand and improve click through.',
		'mobile-panel-settings': 'Optimize mobile chat layout for real thumb use.',
		'triggers': 'This is where timing, intent, and context combine to drive action.',
		'trigger-add': 'Create as many conversion moments as each journey needs.',
		'trigger-type': 'Choose trigger type by behavior: time, scroll, inactivity, click intent, cart, return visitor, depth, source, or exit intent.',
		'trigger-ai-message': 'Let AI generate contextual opening messages for each trigger.',
		'trigger-panel-position': 'Use side panel for soft nudges or center modal for high priority offers.',
		'trigger-delivery-scheduling': 'Control frequency, cooldowns, and schedule so triggers stay effective.',
		'trigger-goals-context': 'Map triggers to outcomes and context rules for relevance.',
		'trigger-verification-segmentation': 'Filter by page type, device, source, and URL patterns.',
		'trigger-exit-widget': 'Recover leaving users with browser warning or branded exit widget.',
		'conversion-goals': 'Tie trigger behavior to measurable outcomes.',
		'notifications': 'Keep your team informed of leads and important events.',
		'save-and-continue': 'Save this setup, then continue to content automation.',
		'content-intro': 'Turn content production into a repeatable SEO and conversion workflow.',
		'content-provider-scope': 'Use a dedicated provider stack for content without affecting chatbot settings.',
		'content-keywords': 'Generate from keywords or products based on your model.',
		'content-generate-keywords': 'Build a topic pipeline quickly from one business prompt.',
		'content-instructions': 'Standardize tone, structure, and SEO quality for every output.',
		'content-improve-existing': 'Upgrade existing assets instead of starting from zero.',
		'content-improve-filters': 'Prioritize updates by source and status.',
		'content-improve-targets': 'Analyze one item or entire sets based on campaign scope.',
		'content-improve-suggest': 'Get practical recommendations ready to apply.',
		'content-improve-saved': 'Store recommendations for execution and review.',
		'content-recs-toggle': 'Add related blocks to increase depth and next clicks.',
		'content-recs-sections': 'Control recommendation volume for clarity and value.',
		'content-recs-relevance': 'Use taxonomy to keep related suggestions aligned.',
		'content-recs-labels': 'Brand headings with your own voice.',
		'content-recs-cache': 'Tune freshness and performance with cache controls.',
		'content-generate-now': 'Run one manual generation to validate setup quickly.',
		'content-analysis': 'Research topic demand before writing to improve results.',
		'content-to-logs': 'Now verify behavior with diagnostics and AI assisted troubleshooting.',
		'logs-intro': 'Start with guided support, then validate in raw logs.',
		'logs-ask-guide': 'Ask setup and strategy questions directly inside admin.',
		'logs-health-check': 'Run multi point diagnostics to catch blockers early.',
		'logs-frontend-probe': 'Detect front end conflicts that can block chat behavior.',
		'logs-analyze': 'Let AI interpret logs and suggest concrete fixes faster.',
		'logs-controls': 'Filter, sort, and manage entries for cleaner troubleshooting.',
		'logs-heading': 'Review event history to confirm what fired, when, and why.',
		'logs-table': 'Inspect row details for evidence based optimization.',
		'logs-clear': 'Clear noise after fixes so future diagnostics stay clean.',
		'content-insights-welcome': 'This is where engagement data becomes clear next actions.',
		'content-insights-thank-you': 'You just saw a full path from setup to insights and targeted action in one system.'
	};

	const getRecordedAudioUrlForStep = (stepId) => {
		if (!recordedAudioEnabled || !stepId) return '';
		return `${recordedAudioBaseUrl}${encodeURIComponent(stepId)}.wav`;
	};

	const getRecordedAudioLibraryUrl = (fileName) => {
		if (!recordedAudioEnabled || !fileName) return '';
		return `${recordedAudioBaseUrl}library/${encodeURIComponent(fileName)}`;
	};

	const getCurrentStepId = (step = null) => {
		const activeStep = step || tour.getCurrentStep();
		if (!activeStep) return '';
		return activeStep.id || (activeStep.options && activeStep.options.id) || '';
	};

	const getNarrationTextForStep = (step = null) => {
		const activeStep = step || tour.getCurrentStep();
		if (!activeStep) return '';

		const stepId = getCurrentStepId(activeStep);
		if (stepId && narrationByStep[stepId]) {
			return narrationByStep[stepId];
		}

		const fallback = activeStep.options && typeof activeStep.options.text === 'string' ? activeStep.options.text : '';
		return String(fallback || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	};

	const clearPendingNarrationTimer = () => {
		if (pendingNarrationTimer !== null) {
			window.clearTimeout(pendingNarrationTimer);
			pendingNarrationTimer = null;
		}
	};

	const queueNarrationUntilGesture = () => {
		clearPendingNarrationTimer();
		narrationNeedsUserGesture = true;
	};

	const stopNarration = () => {
		if (currentNarrationAudio) {
			try {
				currentNarrationAudio.pause();
				currentNarrationAudio.currentTime = 0;
			} catch (e) {
				// Ignore HTML audio pause errors.
			}
			currentNarrationAudio = null;
		}

		if (speechSupported) {
			try {
				window.speechSynthesis.cancel();
			} catch (e) {
				// Ignore speech API cancel errors.
			}
		}

		currentUtterance = null;
	};

	const startTtsNarration = (text) => {
		if (!speechSupported || !text) return;

		try {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = 1.0;
			utterance.pitch = 1.0;
			utterance.volume = 1.0;
			utterance.onerror = () => {
				currentUtterance = null;
				queueNarrationUntilGesture();
			};
			currentUtterance = utterance;
			window.speechSynthesis.speak(utterance);
		} catch (e) {
			currentUtterance = null;
			queueNarrationUntilGesture();
		}
	};

	const isGestureBlockedPlaybackError = (err) => {
		const errName = err && err.name ? String(err.name) : '';
		const errMsg = err && err.message ? String(err.message) : String(err || '');
		return /NotAllowedError/i.test(errName) || /gesture|interact|autoplay|not allowed/i.test(errMsg);
	};

	const speakNarration = (text, step = null) => {
		if (!voiceGuideEnabled) return;

		stopNarration();
		const stepId = getCurrentStepId(step);

		if (recordedAudioEnabled && stepId) {
			const audioUrl = getRecordedAudioUrlForStep(stepId);
			if (audioUrl) {
				try {
					const audio = new Audio(audioUrl);
					audio.preload = 'auto';
					audio.addEventListener('ended', () => {
						if (currentNarrationAudio === audio) {
							currentNarrationAudio = null;
						}
					});
					audio.addEventListener('error', () => {
						if (currentNarrationAudio === audio) {
							currentNarrationAudio = null;
						}
						startTtsNarration(text);
					});

					currentNarrationAudio = audio;
					const playPromise = audio.play();
					if (playPromise && typeof playPromise.catch === 'function') {
						playPromise.catch((err) => {
							if (currentNarrationAudio === audio) {
								currentNarrationAudio = null;
							}

							if (isGestureBlockedPlaybackError(err)) {
								queueNarrationUntilGesture();
								return;
							}

							startTtsNarration(text);
						});
					}
					return;
				} catch (e) {
					currentNarrationAudio = null;
				}
			}
		}

		startTtsNarration(text);
	};

	const speakCurrentStepNarration = () => {
		if (!voiceGuideEnabled) return;
		clearPendingNarrationTimer();
		const currentStep = tour.getCurrentStep();
		const text = getNarrationTextForStep(currentStep);
		speakNarration(text, currentStep);
	};

	const scheduleNarrationForStep = (stepId, delayMs = 0) => {
		clearPendingNarrationTimer();
		if (!voiceGuideEnabled || !stepId) return;

		pendingNarrationTimer = window.setTimeout(() => {
			pendingNarrationTimer = null;
			if (getCurrentStepId() !== stepId) return;
			speakCurrentStepNarration();
		}, Math.max(0, delayMs));
	};

	const replayQueuedNarration = () => {
		if (!narrationNeedsUserGesture || !voiceGuideEnabled) return;
		narrationNeedsUserGesture = false;
		speakCurrentStepNarration();
	};

	document.addEventListener('pointerdown', replayQueuedNarration, true);
	document.addEventListener('keydown', replayQueuedNarration, true);

	const getVoiceToggleLabel = () => {
		if (!speechSupported && !recordedAudioEnabled) return 'Voice Unavailable';
		return voiceGuideEnabled ? 'Voice On' : 'Voice Off';
	};

	const refreshVoiceButtons = () => {
		const currentStep = tour.getCurrentStep();
		if (!currentStep || !currentStep.el) return;

		currentStep.el.querySelectorAll('.karavi-ai-assistant-tour-voice-toggle').forEach((buttonEl) => {
			buttonEl.textContent = getVoiceToggleLabel();
			buttonEl.disabled = !speechSupported && !recordedAudioEnabled;
		});
	};

	const toggleVoiceGuide = () => {
		if (!speechSupported && !recordedAudioEnabled) return;

		voiceGuideEnabled = !voiceGuideEnabled;
		if (!voiceGuideEnabled) {
			stopNarration();
		} else {
			narrationNeedsUserGesture = false;
			speakCurrentStepNarration();
		}

		refreshVoiceButtons();
	};

	const ensureVoiceGuideButton = () => {
		const currentStep = tour.getCurrentStep();
		if (!currentStep || !currentStep.el) return;

		const footer = currentStep.el.querySelector('.shepherd-footer');
		if (!footer || footer.querySelector('.karavi-ai-assistant-tour-voice-toggle')) return;

		const buttonEl = document.createElement('button');
		buttonEl.type = 'button';
		buttonEl.className = 'shepherd-button shepherd-button-secondary karavi-ai-assistant-tour-voice-toggle';
		buttonEl.addEventListener('click', toggleVoiceGuide);
		footer.appendChild(buttonEl);
		refreshVoiceButtons();
	};

	const playLibraryNarrationTrack = (fileName) => {
		if (!recordedAudioEnabled || !fileName) return;

		const audioUrl = getRecordedAudioLibraryUrl(fileName);
		if (!audioUrl) return;

		stopNarration();

		try {
			const audio = new Audio(audioUrl);
			audio.preload = 'auto';
			audio.addEventListener('ended', () => {
				if (currentNarrationAudio === audio) {
					currentNarrationAudio = null;
				}
			});
			currentNarrationAudio = audio;
			const playPromise = audio.play();
			if (playPromise && typeof playPromise.catch === 'function') {
				playPromise.catch(() => {
					if (currentNarrationAudio === audio) {
						currentNarrationAudio = null;
					}
					queueNarrationUntilGesture();
				});
			}
		} catch (e) {
			currentNarrationAudio = null;
			queueNarrationUntilGesture();
		}
	};

	const ensureVoiceLibraryButtons = () => {
		if (!recordedAudioEnabled) return;

		const currentStep = tour.getCurrentStep();
		if (!currentStep || !currentStep.el) return;

		const stepId = getCurrentStepId(currentStep);
		if (stepId !== 'intro') return;

		const footer = currentStep.el.querySelector('.shepherd-footer');
		if (!footer || footer.querySelector('.karavi-ai-assistant-tour-library-track')) return;

		narrationLibraryTracks.forEach((track) => {
			const buttonEl = document.createElement('button');
			buttonEl.type = 'button';
			buttonEl.className = 'shepherd-button shepherd-button-secondary karavi-ai-assistant-tour-library-track';
			buttonEl.textContent = track.label;
			buttonEl.addEventListener('click', () => {
				playLibraryNarrationTrack(track.file);
			});
			footer.appendChild(buttonEl);
		});
	};

	const backBtn = { text: tourT('Back'), action: tour.back, classes: 'shepherd-button-secondary' };
	const nextBtn = { text: tourT('Next'), action: tour.next, classes: 'shepherd-button-primary' };
	const completeBtn = { text: tourT('Finish'), action: tour.complete, classes: 'shepherd-button-primary' };
	const cancelBtn = { text: tourT('Skip Tour'), action: tour.cancel, classes: 'shepherd-button-secondary' };

	const currentPage = karaviAiAssistantTourData.currentPage;
	const activeTab = karaviAiAssistantTourData.activeTab;

	if (currentPage === 'dashboard') {
		tour.addStep({
			id: 'intro',
			title: tourT('Welcome to Karavi AI Assistant!'),
			text: tourT("This quick tour will guide you through the main features. Let's start with your A/B test performance."),
			buttons: [cancelBtn, nextBtn]
		});
		tour.addStep({
			id: 'dashboard-ab',
			title: tourT('A/B Test Dashboard'),
			text: tourT('See views, conversions, and conversion rate for each variation. When confidence reaches 95%, you can apply the winner.'),
			attachTo: { element: '#tour-step-dashboard-ab', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'dashboard-manage-data',
			title: tourT('Manage & Reset Data'),
			text: tourT('Open targeted reset options for A/B stats, goal counters, action clicks, or even stored conversations when you need a clean slate.'),
			attachTo: { element: '#karavi-ai-assistant-manage-data-btn', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'dashboard-triggers',
			title: tourT('Trigger Overview'),
			text: tourT('Skim which proactive engagement triggers are active before diving into priorities, cart logic, or exit widgets inside settings.'),
			attachTo: { element: '#tour-step-dashboard-triggers', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({

		      id: 'dashboard-trigger-analytics',

		      title: tourT('Trigger Analytics'),

		      text: tourT('Review how individual triggers are performing over time across 7-day, 30-day, and lifetime windows.'),

		      attachTo: { element: '#tour-step-dashboard-trigger-analytics', on: 'bottom' },

		      buttons: [backBtn, nextBtn]

		});
		tour.addStep({
			id: 'dashboard-health',
			title: tourT('System Health'),
			text: tourT('Quickly check your AI provider status, API key configuration, and the number of keywords in your content queue.'),
			attachTo: { element: '#tour-step-dashboard-health', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'dashboard-export',
			title: tourT('Download Results'),
			text: tourT('At any time, you can download a CSV of your A/B test results for deeper analysis.'),
			attachTo: { element: '#tour-step-export', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'dashboard-to-settings',
			title: tourT('Configure Your Chatbot'),
			text: tourT('Next, let’s set up the chatbot persona, triggers, and appearance.'),
			buttons: [backBtn, { text: tourT('Go to Settings'), action: goToChatbotSettings }]
		});
	}

	if (currentPage === 'settings' && activeTab === 'chatbot') {
		tour.addStep({
			id: 'settings-intro',
			title: tourT('Chatbot Settings'),
			text: tourT('This is the main control center for your chatbot. Here you can configure AI providers, A/B testing, appearance, and behavior.'),
			buttons: [
				{ text: tourT('Back to Dashboard'), action: goToDashboard, classes: 'shepherd-button-secondary' },
				nextBtn
			]
		});
		tour.addStep({
			id: 'ab-toggle',
			title: tourT('Enable A/B Testing'),
			text: tourT('Turn on A/B testing to experiment with different personas, colors, messages, or buttons. The "Variation B" settings will appear when this is enabled.'),
			attachTo: { element: '#tour-step-ab-test', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'basic-settings',
			title: tourT('Basic Settings & API'),
			text: tourT('This is the core settings area for Variation A. Next, we will open it and configure your AI integration and identity.'),
			attachTo: { element: '#tour-step-basic-settings-a', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsClosed },
			beforeShowPromise: () => ensureStepFocus('#tour-step-basic-settings-a', ensureBasicSettingsClosed)
		});
		tour.addStep({
			id: 'api-key',
			title: tourT('Connect an AI Provider'),
			text: tourT('Select a provider (like Google, OpenAI, etc.) and enter your API key. Models for that provider are fetched automatically once a valid key is entered.'),
			attachTo: { element: '#tour-step-api-key', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-api-key', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'bot-name',
			title: tourT('Bot Name'),
			text: tourT('Give your chatbot a name. This appears at the top of the chat window.'),
			attachTo: { element: '#tour-step-bot-name', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-bot-name', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'floating-logo',
			title: tourT('Custom Logo'),
			text: tourT('Upload a custom icon for the floating chat bubble. If left empty, the default icon is used.'),
			attachTo: { element: '.karavi-ai-assistant-media-uploader', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('.karavi-ai-assistant-media-uploader', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'welcome-message',
			title: tourT('Welcome Message'),
			text: tourT('The first message the user sees when they open the chat. Make it friendly and helpful!'),
			attachTo: { element: '#tour-step-welcome-message', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-welcome-message', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'persona',
			title: tourT('Define the AI Persona'),
			text: tourT('This is the most important setting. Give the AI clear instructions on its tone, purpose, and rules. A well-defined persona leads to much better results.'),
			attachTo: { element: '#tour-step-persona', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-persona', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'knowledge-base',
			title: tourT('Provide Site Context'),
			text: tourT('Choose which content types (pages, posts, products) the AI should use as its knowledge base to answer user questions accurately.'),
			attachTo: { element: '#tour-step-knowledge-base', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-knowledge-base', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'ai-gen-buttons',
			title: tourT('AI-Generated Buttons'),
			text: tourT('Let the assistant surface contextual CTAs automatically—great for product searches, quick answers, or routing without manual setup.'),
			attachTo: { element: '#tour-step-ai-gen-buttons', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-ai-gen-buttons', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'quick-buttons',
			title: tourT('Add Quick Buttons'),
			text: tourT('Add persistent buttons that always appear in the chat bar. You can link to a URL or have them send a pre-defined message to the AI.'),
			attachTo: { element: '#tour-step-quick-buttons', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureBasicSettingsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-quick-buttons', ensureBasicSettingsOpen)
		});
		tour.addStep({
			id: 'performance-controls',
			title: tourT('Performance & Cost Controls'),
			text: tourT('This is the Performance & Cost Controls section. Next, we will open it and walk through each option.'),
			attachTo: { element: '#tour-step-performance-controls', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsClosed },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-controls', ensurePerformanceControlsClosed)
		});
		tour.addStep({
			id: 'performance-product-excerpt',
			title: tourT('Product Excerpt Words'),
			text: tourT('Limit how many words are pulled from product content when building context for answers.'),
			attachTo: { element: '#tour-step-performance-product-excerpt', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-product-excerpt', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'performance-content-excerpt',
			title: tourT('Content Excerpt Words'),
			text: tourT('Control how many words are pulled from posts and pages for the AI context.'),
			attachTo: { element: '#tour-step-performance-content-excerpt', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-content-excerpt', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'performance-context-detail',
			title: tourT('Context Detail Level'),
			text: tourT('Choose between full or compact context to balance accuracy and token usage.'),
			attachTo: { element: '#tour-step-performance-context-detail', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-context-detail', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'performance-routing-model',
			title: tourT('Routing Model'),
			text: tourT('Pick a cheaper model that will handle short or greeting-type questions.'),
			attachTo: { element: '#tour-step-performance-routing-model', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-routing-model', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'performance-object-cache',
			title: tourT('Use Object Cache'),
			text: tourT('Enable Redis/Memcached caching to reduce repeated context lookups.'),
			attachTo: { element: '#tour-step-performance-use-object-cache', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-use-object-cache', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'performance-tool-calling',
			title: tourT('Product Tool-Calling'),
			text: tourT('Allow the AI to call the product search tool for real-time product details.'),
			attachTo: { element: '#tour-step-performance-tool-calling', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensurePerformanceControlsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-performance-tool-calling', ensurePerformanceControlsOpen)
		});
		tour.addStep({
			id: 'content-insights-settings',
			title: tourT('Content Insights & Behavior'),
			text: tourT('This section connects content performance with trigger decisions. Next, we will open it and explain each option.'),
			attachTo: { element: '#tour-step-content-insights-settings', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureContentInsightsClosed },
			beforeShowPromise: () => ensureStepFocus('#tour-step-content-insights-settings', ensureContentInsightsClosed)
		});
		tour.addStep({
			id: 'content-insights-scope',
			title: tourT('Tracking Scope'),
			text: tourT('Track all public content, selected post types, or only your target URL rules depending on your campaign goals.'),
			attachTo: { element: '#tour-step-content-insights-scope', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureContentInsightsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-content-insights-scope', ensureContentInsightsOpen)
		});
		tour.addStep({
			id: 'content-insights-targeting',
			title: tourT('Include and Exclude Rules'),
			text: tourT('Use Target Page URLs and Exclude URL rules to focus insights on revenue pages and hide pages like checkout, preview, or thank-you screens.'),
			attachTo: { element: '#tour-step-content-insights-target-urls', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureContentInsightsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-content-insights-target-urls', ensureContentInsightsOpen)
		});
		tour.addStep({
			id: 'content-insights-filters',
			title: tourT('Source and Improvement Filters'),
			text: tourT('Filter reports by AI-generated vs manual content and include only improved or not-improved items from your SEO workflow.'),
			attachTo: { element: '#tour-step-content-insights-source', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureContentInsightsOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-content-insights-source', ensureContentInsightsOpen)
		});
		tour.addStep({
			id: 'advanced-appearance',
			title: tourT('Advanced Appearance'),
			text: tourT('This is the Advanced Appearance section. Next, we will open it and explain the styling options.'),
			attachTo: { element: '#tour-step-advanced-appearance', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureAdvancedAppearanceClosed },
			beforeShowPromise: () => ensureStepFocus('#tour-step-advanced-appearance', ensureAdvancedAppearanceClosed)
		});
		tour.addStep({
			id: 'button-styling',
			title: tourT('Button Styling'),
			text: tourT('Customize the look of your Quick Chat and AI-Generated buttons. Choose from Filled, Outline, or Subtle styles and adjust shapes and sizes.'),
			attachTo: { element: '#tour-step-button-styling', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureAdvancedAppearanceOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-button-styling', ensureAdvancedAppearanceOpen)
		});
		tour.addStep({
			id: 'mobile-panel-settings',
			title: tourT('Mobile Panel Settings'),
			text: tourT('New! Control exactly how the chat window behaves on mobile. Set width/height percentages, anchor it to the bottom or top, and choose horizontal alignment.'),
			attachTo: { element: '#tour-step-mobile-panel-settings', on: 'bottom' },
			buttons: [backBtn, nextBtn],
			when: { show: ensureAdvancedAppearanceOpen },
			beforeShowPromise: () => ensureStepFocus('#tour-step-mobile-panel-settings', ensureAdvancedAppearanceOpen)
		});
		tour.addStep({
			id: 'triggers',
			title: tourT('Engagement Triggers'),
			text: tourT('Define when the chatbot opens: set delays, scroll depth, exit-intent detection, high-priority overrides, empty-cart checks, and post-conversion suppression.'),
			attachTo: { element: '#tour-step-triggers-heading', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'trigger-add',
			title: tourT('Add New Rules'),
			text: tourT('Create as many trigger recipes as you need—time-on-page nudges, scroll prompts, coupon exit modals, and more.'),
			attachTo: { element: '#karavi-ai-assistant-add-trigger', on: 'top' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({

		      id: 'trigger-type',

		      title: tourT('Trigger Type'),

		      text: tourT('Choose which action initiates this chat (e.g., Time on Page, Scroll Depth, Exit Intent). This is the primary condition that opens the chat window.'),

		      attachTo: { element: '#tour-target-trigger-type', on: 'bottom' },

		      buttons: [backBtn, nextBtn],

		      beforeShowPromise: () => new Promise((resolve) => {

		              setTimeout(() => {

		                      const $item = ensureTriggerEditor();

		                      if ($item) {

		                              const $wrapper = $item.find('.karavi-ai-assistant-trigger-type-select').closest('.karavi-ai-assistant-form-group');

		                              $wrapper.attr('id', 'tour-target-trigger-type');

		                      }

		                      resolve();

		              }, 30);

		      })

		});
		tour.addStep({
			id: 'trigger-ai-message',
			title: tourT('AI Proactive Messages'),
			text: tourT('New! You can now let the AI generate the opening message for any trigger based on the page context and a specific persona.'),
			attachTo: { element: '#tour-target-ai-message', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					const $item = ensureTriggerEditor();
					if ($item) {
						const $wrapper = $item.find('input[name*="[use_ai_message]"]').closest('.karavi-ai-assistant-collapsible-wrapper');
						$wrapper.attr('id', 'tour-target-ai-message');
						const $header = $wrapper.find('.karavi-ai-assistant-collapsible-header-plain');
						const $content = $header.next('.karavi-ai-assistant-collapsible-content');
						if ($content.length && !$content.is(':visible')) {
							$header.trigger('click');
						}
					}
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'trigger-panel-position',
			title: tourT('Panel Position'),
			text: tourT("Choose 'Normal' for a standard side panel or 'Center' to open a focused modal with a backdrop—perfect for high-priority offers."),
			attachTo: { element: '.karavi-ai-assistant-trigger-item select[name*="[open_style]"]', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					ensureTriggerEditor();
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'trigger-delivery-scheduling',
			title: tourT('Delivery & Scheduling'),
			text: tourT("Set 'Firing Frequency' and 'High Priority' to override other triggers. Control exactly when and how often this trigger is delivered."),
			attachTo: { element: '#tour-target-delivery', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					const $firstItem = ensureTriggerEditor();
					if ($firstItem) {
						const $wrapper = $firstItem.find('.karavi-ai-assistant-trigger-advanced-options .karavi-ai-assistant-collapsible-wrapper').eq(0);
						$wrapper.attr('id', 'tour-target-delivery');
						const $header = $wrapper.find('.karavi-ai-assistant-collapsible-header-plain');
						const $content = $header.next('.karavi-ai-assistant-collapsible-content');
						if ($content.length && !$content.is(':visible')) {
							$header.trigger('click');
						}
					}
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'trigger-goals-context',
			title: tourT('Goals & Context Rules'),
			text: tourT("Map this trigger to specific conversation goals, enforce prerequisites, and suppress triggers based on visited URLs or conditions."),
			attachTo: { element: '#tour-target-goals', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					const $firstItem = ensureTriggerEditor();
					if ($firstItem) {
						const $wrapper = $firstItem.find('.karavi-ai-assistant-trigger-advanced-options .karavi-ai-assistant-collapsible-wrapper').eq(1);
						$wrapper.attr('id', 'tour-target-goals');
						const $header = $wrapper.find('.karavi-ai-assistant-collapsible-header-plain');
						const $content = $header.next('.karavi-ai-assistant-collapsible-content');
						if ($content.length && !$content.is(':visible')) {
							$header.trigger('click');
						}
					}
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'trigger-verification-segmentation',
			title: tourT('Verification & Segmentation'),
			text: tourT("Further target your audience based on specific URL patterns or user segments to ensure highly contextual conversations."),
			attachTo: { element: '#tour-target-verification', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					const $firstItem = ensureTriggerEditor();
					if ($firstItem) {
						const $wrapper = $firstItem.find('.karavi-ai-assistant-trigger-advanced-options .karavi-ai-assistant-collapsible-wrapper').eq(2);
						$wrapper.attr('id', 'tour-target-verification');
						const $header = $wrapper.find('.karavi-ai-assistant-collapsible-header-plain');
						const $content = $header.next('.karavi-ai-assistant-collapsible-content');
						if ($content.length && !$content.is(':visible')) {
							$header.trigger('click');
						}
					}
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'trigger-exit-widget',
			title: tourT('Exit-Intent Toolkit'),
			text: tourT("Enable the 'Fake Exit Button' to show a custom widget that triggers the modal. You can also use standard mouse-out detection or browser leave warnings."),
			attachTo: { element: '.karavi-ai-assistant-trigger-exit-settings', on: 'top' },
			buttons: [backBtn, nextBtn],
			beforeShowPromise: () => new Promise((resolve) => {
				setTimeout(() => {
					const $firstItem = ensureTriggerEditor('exit_intent');
					if ($firstItem) {
						const $header = $firstItem.find('.karavi-ai-assistant-trigger-exit-settings .karavi-ai-assistant-collapsible-header-plain').first();
						if ($header.length) {
							const $content = $header.next('.karavi-ai-assistant-collapsible-content');
							if ($content.length && !$content.is(':visible')) {
								$header.trigger('click');
							}
						}
					}
					resolve();
				}, 30);
			})
		});
		tour.addStep({
			id: 'conversion-goals',
			title: tourT('Track Conversions'),
			text: tourT('Add URL, CSS selector click, form submit, popular WordPress action, or WooCommerce product visit goals. The first goal stays primary for A/B decisions, while additional goals enable richer funnel analytics.'),
			attachTo: { element: '#tour-step-conversion-goals', on: 'top' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'notifications',
			title: tourT('Email Notifications'),
			text: tourT('Get notified of new leads (when a user starts a chat) and optionally receive full transcripts when conversations go inactive.'),
			attachTo: { element: '#tour-step-notifications', on: 'top' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'save-and-continue',
			title: tourT('Save and Continue'),
			text: tourT("Don't forget to save your settings! Next, we'll look at the AI Content Engine."),
			attachTo: { element: '#tour-step-save', on: 'top' },
			buttons: [backBtn, { text: tourT('Next: Content Engine'), action: goToContentEngine }]
		});
	}

	if (currentPage === 'settings' && activeTab === 'content_engine') {
		tour.addStep({
			id: 'content-intro',
			title: tourT('AI Content Engine'),
			text: tourT('This engine uses your AI provider to auto-generate SEO-ready posts on a schedule or on demand.'),
			buttons: [
				{ text: tourT('Back to Chatbot'), action: goToChatbotSettings, classes: 'shepherd-button-secondary' },
				nextBtn
			]
		});
		tour.addStep({
			id: 'content-provider-scope',
			title: tourT('Independent Provider'),
			text: tourT('You can now use a dedicated AI provider and API key for content generation, separate from your chatbot settings.'),
			attachTo: { element: '#tour-step-content-provider', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-keywords',
			title: tourT('Content Source'),
			text: tourT('Choose between "Keywords" or "Products" as your source. The engine can write articles based on topics or generate product showcases from your WooCommerce catalog.'),
			attachTo: { element: '#tour-step-content-keywords', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-generate-keywords',
			title: tourT('Generate Keywords with AI'),
			text: tourT('Need ideas? Describe your business or blog topics, and let the AI generate a list of high-intent keywords for you. They will be added to your queue.'),
			attachTo: { element: '#karavi-ai-assistant-keyword-generator-wrap', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-instructions',
			title: tourT('AI Instructions for Posts'),
			text: tourT('Just like the chatbot persona, these instructions guide the AI writer. Define the tone, structure, word count, and any SEO rules you want it to follow.'),
			attachTo: { element: '#tour-step-content-instructions', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-improve-existing',
			title: tourT('Improve Older Posts, Pages, and Products'),
			text: tourT('Open this workflow to refresh existing content with AI-powered SEO recommendations instead of rewriting from scratch.'),
			attachTo: { element: '#tour-step-seo-improvement', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-improve-filters',
			title: tourT('Filter and Segment Content'),
			text: tourT('Search by title and filter by source (AI/manual) and improvement status so your team can prioritize what needs work first.'),
			attachTo: { element: '#tour-step-seo-improvement-filters', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-improve-targets',
			title: tourT('Choose Analysis Targets'),
			text: tourT('Analyze one item or broader scopes by selecting All Posts and/or All Products from the target panel.'),
			attachTo: { element: '#tour-step-seo-improvement-targets-panel', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-improve-suggest',
			title: tourT('Suggest SEO Improvements'),
			text: tourT('Generate actionable SEO recommendations with AI, then apply updates in the editor and track progress over time.'),
			attachTo: { element: '#tour-step-seo-improvement-actions', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-improve-saved',
			title: tourT('Saved SEO Suggestions'),
			text: tourT('Recommendations are saved here so you can review later, delete old cards, or mark items as improved when updates are complete.'),
			attachTo: { element: '#tour-step-seo-improvement-saved', on: 'left' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-recs-toggle',
			title: tourT('Turn On Recommendations'),
			text: tourT('Enable the recommendations block to automatically append related products, posts, or services after each generated article.'),
			attachTo: { element: '#tour-step-recommendations-toggle', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-recs-sections',
			title: tourT('Pick Sections & Limits'),
			text: tourT('Choose which sections to show and set the max items so you control how many cross-sells appear per post.'),
			attachTo: { element: '#tour-step-recommendations-sections', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-recs-relevance',
			title: tourT('Match by Taxonomy'),
			text: tourT('Use taxonomy relevance and optional custom service taxonomies to keep recommendations laser-focused.'),
			attachTo: { element: '#tour-step-recommendations-relevance', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-recs-labels',
			title: tourT('Brand the Headings'),
			text: tourT('Rename section labels with your own language—for example “You might also love” or “Services we recommend.”'),
			attachTo: { element: '#tour-step-recommendations-labels', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-recs-cache',
			title: tourT('Tune Caching'),
			text: tourT('Control how long recommendations stay cached so you get fresh suggestions without hammering the database.'),
			attachTo: { element: '#tour-step-recommendations-cache', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-generate-now',
			title: tourT('Manual Generation'),
			text: tourT('Test your settings by instantly generating one post using the next available keyword from your queue.'),
			attachTo: { element: '#tour-step-manual-generate', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-analysis',
			title: tourT('Topic & Keyword Analysis'),
			text: tourT('Before writing, analyze any topic to get a report with long-tail keywords, common user questions, and a suggested content outline.'),
			attachTo: { element: '#karavi-ai-assistant-topic-analysis-wrap', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'content-to-logs',
			title: tourT('Final Step: Logs'),
			text: tourT("Let's look at the logs, where you can see all plugin activity."),
			buttons: [backBtn, { text: tourT('Go to Logs'), action: goToLogsTab }]
		});
	}

	if (currentPage === 'settings' && activeTab === 'logs') {
		tour.addStep({
			id: 'logs-intro',
			title: tourT('Support Center & Event Logs'),
			text: tourT('The Logs tab now starts with the Support Center. If any option or button is confusing, ask here first, then run checks for conflicts and errors before reading raw event entries.'),
			attachTo: { element: '#karaviaiassistant_guide_panel', on: 'bottom' },
			buttons: [
				{ text: tourT('Back to Content Engine'), action: goToContentEngine, classes: 'shepherd-button-secondary' },
				nextBtn
			]
		});
		tour.addStep({
			id: 'logs-ask-guide',
			title: tourT('Ask Guide'),
			text: tourT('Ask about any setting, option, or button that is unclear, then continue follow-ups in the same admin-only chat thread.'),
			attachTo: { element: '#karaviaiassistant_guide_send_button', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-health-check',
			title: tourT('Run Health Check'),
			text: tourT('Runs a multi-point diagnostic across provider setup, conflict signals, runtime logs, and frontend readiness.'),
			attachTo: { element: '#karaviaiassistant_guide_health_check', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-frontend-probe',
			title: tourT('Run Frontend Probe'),
			text: tourT('Checks homepage markers and optimization/defer hints to catch conflicts that block chat initialization.'),
			attachTo: { element: '#karaviaiassistant_guide_frontend_probe', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-analyze',
			title: tourT('Analyze with AI'),
			text: tourT('New! Click this button to let AI analyze your recent logs and system info. It will diagnose errors and suggest fixes automatically.'),
			attachTo: { element: '#karaviaiassistant_analyze_logs_button', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-controls',
			title: tourT('Event Logs Controls'),
			text: tourT('These controls now appear after chat. Filter by type, sort, apply, delete selected rows, or clear all logs.'),
			attachTo: { element: '.karavi-ai-assistant-logs-toolbar', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-heading',
			title: tourT('Event Logs'),
			text: tourT('Below the Support Center, this section lists raw event entries for manual verification and debugging.'),
			attachTo: { element: '#karaviaiassistant_event_logs_heading', on: 'bottom' },
			buttons: [backBtn, nextBtn]
		});
		tour.addStep({
			id: 'logs-table',
			title: tourT('Log Table'),
			text: tourT('Inspect timestamp, type, message, and details for each entry to confirm fixes over time.'),
			attachTo: { element: '#karavi-ai-assistant-logs-form table', on: 'top' },
			buttons: [backBtn, nextBtn]
		});
		const goToContentInsights = () => {

		      const base = karaviAiAssistantTourData.content_insights_url;

		      if (!base) return;

		      const sep = base.indexOf('?') !== -1 ? '&' : '?';

		      window.location.href = base + sep + 'start_tour=true';

		};


		tour.addStep({

		      id: 'logs-clear',

		      title: tourT('Clear Logs'),

		      text: tourT('If the log gets too noisy, you can clear it after confirming your fixes.'),

		      attachTo: { element: '#tour-step-clear-logs', on: 'bottom' },

		      buttons: [

		              backBtn,

		              { text: tourT('Go to Content Insights'), action: goToContentInsights, classes: 'shepherd-button-primary' }

		      ]

		});
	}

	
        if (currentPage === 'content_insights') {
                tour.addStep({
                        id: 'content-insights-welcome',
                        title: tourT('Welcome to Content Insights!'),
                        text: tourT('This page provides you with comprehensive analytics and actionable insights regarding your content performance and engagement.'),
                        attachTo: { element: 'h1', on: 'bottom' },
                        buttons: [cancelBtn, nextBtn]
                });

                tour.addStep({
                        id: 'content-insights-thank-you',
                        title: tourT('Thank You!'),
                        text: tourT('You have completed the Karavi AI Assistant guided tour. Thank you so much for choosing Karavi AI Assistant! We hope this tour helped you understand all the powerful features at your fingertips. Have a wonderful day and happy generating! 😊'),
                        attachTo: { element: 'h1', on: 'bottom' },
                        buttons: [{
                                text: tourT('Finish 🎉'),
                                action: tour.complete,
                                classes: 'shepherd-button-primary'
                        }]
                });
        }

	const cleanupTourArtifacts = () => {
		$('#karavi-ai-assistant-triggers-container .karavi-ai-assistant-trigger-item[data-tour-created="1"]').remove();
	};

	const stopNarrationAndCleanup = () => {
		clearPendingNarrationTimer();
		narrationNeedsUserGesture = false;
		stopNarration();
		cleanupTourArtifacts();
	};

	tour.on('show', () => {
		clearPendingNarrationTimer();
	});

	tour.on('complete', stopNarrationAndCleanup);
	tour.on('cancel', stopNarrationAndCleanup);

	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('start_tour')) {
		setTimeout(() => {
			tour.start();
		}, 300);
	}
});
