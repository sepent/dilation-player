// ====================================================
// Class {DilationPlayerConfig}
// ====================================================
class DilationPlayerConfig
{
	/**
	 * Constructor
	 * @param config
	 */
	constructor(config)
	{
		if (config == undefined) {
			config = {};
		}

		if (config.elements == undefined) {
			config.elements = {};
		}

		if (config.elements.controls == undefined) {
			config.elements.controls = {};
		}

		this.config = {
			elements: {
				controls: {}
			}
		};

		// Config for elements
		this.config.elements.container = this.or(config.elements.container, '.dilation-player');
		this.config.elements.video = this.or(config.elements.video, '.dilation-player-video');
		this.config.elements.logo = this.or(config.elements.logo, '.dilation-player-logo');
		this.config.elements.progress = this.or(config.elements.progress, '.dilation-player-progress');
		this.config.elements.control = this.or(config.elements.control, '.dilation-player-control');
		this.config.elements.controls.playPause = this.or(config.elements.controls.playPause, '.dilation-player-btn-play');
		this.config.elements.controls.sound = this.or(config.elements.controls.playPause, '.dilation-player-btn-sound');
	}

	/**
	 * Check if value is undefined then return or
	 * @param value
	 * @param or
	 * @return mixed
	 */
	or(value, or)
	{
		return value == undefined ? or : value;
	}

	/**
	 * Get config
	 * @param key
	 * @return mixed
	 */
	get(key)
	{
		var keys = key.split('.');
        var data = this.config;

        for (var i in keys) {
            if (data[keys[i]] == undefined) {
                return undefined;
            }

            data = data[keys[i]];
        }

        return data;
	}
}

// ====================================================
// Class {DilationPlayer}
// ====================================================
class DilationPlayer
{
	/**
	 * Constructor
	 * @param config
	 */
	constructor(config)
	{
		this.config = new DilationPlayerConfig(config);
		this.apply();
	}

	/**
	 * Load
	 * @param resources
	 */
	load(resources)
	{
		if (resources !== undefined) {
			this.config.resources(resources);
		}
		
		this.apply();
	}

	/**
	 * Apply
	 */
	apply()
	{
		// Regist events
		this.togglePlayPause()
			.toggleControl();
	}

	/** 
	 * Toggle play pause
	 */
	togglePlayPause()
	{
		let video = $(this.config.get('elements.video'));
		let icon = $(this.config.get('elements.controls.playPause')).find('i');

		function toggleIcon() {
			if (video.get(0).paused) {
				video.get(0).play();
				icon.attr('class', 'icons icon-control-pause');
			} else {
				video.get(0).pause();
				icon.attr('class', 'icons icon-control-play');
			}
		}

		$(document).on('click', this.config.get('elements.controls.playPause'), function(){
			toggleIcon();
		});

		$(document).on('click', this.config.get('elements.video'), function(){
			toggleIcon();
		});

		return this;
	}

	toggleControl(){
		let controlTime = null;
		let instance = this;

		$(this.config.get('elements.video')).mouseover(function(){
			window.clearTimeout(controlTime);
			$(instance.config.get('elements.control')).addClass('active');

			controlTime = window.setTimeout(function(){
				$(instance.config.get('elements.control')).removeClass('active');
			}, 2000);
		});

		$(this.config.get('elements.video')).mouseleave(function(){
			$(instance.config.get('elements.control')).removeClass('active');
		});

		return this;
	}
}