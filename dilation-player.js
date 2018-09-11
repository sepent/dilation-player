// ====================================================
// Class {DilationPlayerConfig}
// ====================================================
class DilationPlayerConfig {
    /**
     * Constructor
     * @param config
     */
    constructor(config) {
        // Init config if user pass undefined to
        if (config == undefined) {
            config = {};
        }
		
		// Set default
		config = {
			elements: this.or(config.elements, {}),
			icons: this.or(config.icons, {})
		};

        // Config for elements
        this.config = {
			elements: {
				container: this.or(config.elements.container, '.dilation-player'),
				video: this.or(config.elements.video, '.dilation-player-video'),
				logo: this.or(config.elements.logo, '.dilation-player-logo'),
				progress: this.or(config.elements.progress, '.dilation-player-progress'),
				progress_hover_tooltip_text: this.or(config.elements.progress_hover_tooltip_text, '.dilation-player-progress-tooltip-text'),
				progress_hover_tooltip_image: this.or(config.elements.progress_hover_tooltip_image, '.dilation-player-progress-tooltip-image'),
				control: this.or(config.elements.control, '.dilation-player-control'),
				button: this.or(config.elements.button, '.dilation-player-button'),
				control_playPause: this.or(config.elements.control_playPause, '.dilation-player-btn-play'),
				control_fullscreen: this.or(config.elements.control_fullscreen, '.dilation-player-btn-fullscreen'),
				control_volume: this.or(config.elements.control_volume, '.dilation-player-btn-volume'),
				control_timer: this.or(config.elements.control_timer, '.dilation-player-timer'),
				loader: this.or(config.elements.loader, '.dilation-player-loader'),
				loader_icon: this.or(config.elements.loader_icon, '.dilation-player-loader-icon')
			},
		
			// Config for icon
			icons: {
				loader: this.or(config.icons.loader, '<i class="fa fa-spin fa-spinner"></i>'),
				fullscreen: this.or(config.icons.fullscreen, '<i class="icons icon-size-fullscreen"></i>'),
				actualscreen: this.or(config.icons.actual, '<i class="icons icon-size-actual"></i>'),
				pause: this.or(config.icons.pause, '<i class="icons icon-control-pause"></i>'),
				play: this.or(config.icons.play, '<i class="icons icon-control-play"></i>'),
				volume_mute: this.or(config.icons.mute, '<i class="icons icon-volume-off"></i>'),
				volume_1: this.or(config.icons.volume_1, '<i class="icons icon-volume-1"></i>'),
				volume_2: this.or(config.icons.volume_2, '<i class="icons icon-volume-2"></i>'),
				volume_3: this.or(config.icons.volume_3, '<i class="icons icon-volume-3"></i>')
			},
			
			// Config default
			volume: this.or(config.volume, true)
		}

        // Init cache
        this.cache = {dom: {}, config: {}};
    }

    /**
     * Check if value is undefined then return or
     * @param value
     * @param or
     * @return mixed
     */
    or(value, or) {
        return value == undefined ? or : value;
    }

    /**
     * Get config
     * @param key
     * @return mixed
     */
    get(key, dom) {
        let config = null;

        // Get config cache
        if (this.cache.config[key] !== undefined) {
            config = this.cache.config[key];
        }
        // Config not in cache then read
        // Split key string to array
        else {
            var keys = key.split('.');
            config = this.config;

            for (var i in keys) {
                if (config[keys[i]] == undefined) {
                    config = undefined;
                    break;
                }

                config = config[keys[i]];
            }

            this.cache.config[key] = config;
        }

        // Check get dom is true and dom is created
        // Then return dom in cache
        if (dom === true &&  (typeof config === 'string')) {
            if (this.cache.dom[key] === undefined) {
                this.cache.dom[key] = $(config);
            }

            return this.cache.dom[key];
        }

        return config;
    }
}

// ====================================================
// Class {DilationPlayer}
// ====================================================
class DilationPlayer {
    /**
     * Constructor
     * @param config
     */
    constructor(config) {
        this.config = new DilationPlayerConfig(config);
        this.apply();
    }

    /**
     * Load
     * @param resources
     */
    load(resources) {
        if (resources !== undefined) {
            this.config.resources(resources);
        }

        this.apply();
    }

    /**
     * Apply
     */
    apply() {
        // Regist events
        this.loader(false)
			.control()
            .playPause()
            .fullscreen()
            .progress()
            .sound()
            .logo();
    }

    /**
     * Toggle play pause
     * @return {DilationPlayer}
     */
    playPause() {
        // Defined elements
        let video = this.config.get('elements.video', true);
        let btn = this.config.get('elements.control_playPause', true);
		let icons = this.config.get('icons');

        // Method to call as common
        function toggleIcon() {
            if (video.get(0).paused) {
                video.get(0).play();
            } else {
                video.get(0).pause();
            }
        }

        // Event when click on button play/pause
        btn.click(function () {
            toggleIcon();
        });

        // Event when click on video
        video.click(function () {
            toggleIcon();
        });

        // Event when video play
        video.on('play', function () {
            btn.html(icons.pause);
        });

        // Event when video pause or ended
        video.on('pause ended', function () {
            btn.html(icons.play);
        });

        // Init display icon in button play/pause
        if (video.get(0).paused) {
            btn.html(icons.play);
        } else {
            btn.html(icons.pause);
        }

        return this;
    }

    /**
     * Toggle full screen event
     * @return {DilationPlayer}
     */
    fullscreen() {
        // Defined elements
        let element = this.config.get('elements.container', true).get(0);
        let btn = this.config.get('elements.control_fullscreen', true);
		let icons = this.config.get('icons');
		
		// Default
		btn.html(icons.fullscreen);

        // Method handle fullscreen
        function request() {
            element.requestFullScreen();
            btn.html(icons.actualscreen);
        }

        // Method handle turn off fullscreen
        function cancel() {
            document.cancelFullScreen();
            btn.html(icons.fullscreen);
        }

        // Event when click on button fullscreen
        // Then call to check full or cancel
        btn.on('click', function (event) {
            // Check if event is html element
            if (event instanceof HTMLElement) {
                element = event;
            }

            var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

            element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () {
                return false;
            };

            document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
                return false;
            };

            isFullscreen ? cancel() : request();
        });

        return this;
    }

    /**
     * Progress
     * @return {DilationPlayer}
     */
    progress() {
        // Defined elements
		let instance = this;
        let video = this.config.get('elements.video', true);
        let progressBar = this.config.get('elements.progress', true);
        let progress = progressBar.find('.playing');
        let timer = this.config.get('elements.control_timer', true);
		let progressTimerTooltipText = this.config.get('elements.progress_hover_tooltip_text', true);
		let progressTimerTooltipImage = this.config.get('elements.progress_hover_tooltip_image', true);
		let tooltipCanvas = progressTimerTooltipImage.find('canvas').get(0);
		tooltipCanvas.width = 90;
		tooltipCanvas.height = 70;

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
		
		function setLoaded (current, duration) {
			progress.width((current / duration*100) + '%');
		}
		
		function setTimer(current, duration){
			let hours = Math.floor(current / 3600);
			let minutes = Math.floor((current - hours * 3600) / 60);
			let seconds = Math.floor(current - (minutes * 60 + hours * 3600));
			let currentTime = (hours > 0 ? (pad(hours, 2) + ':') : '') + pad(minutes, 2) + ':' + pad(seconds, 2);

			hours = Math.floor(duration / 3600);
			minutes = Math.floor((duration - hours * 3600) / 60);
			seconds = Math.floor(duration - (minutes * 60 + hours * 3600));
			let totalTime = (hours > 0 ? (pad(hours, 2) + ':') : '') + pad(minutes, 2) + ':' + pad(seconds, 2);

			timer.html(currentTime + ' / ' + totalTime);
		}

        // Set loaded default is 0
        function display() {
            if (!isNaN(video.get(0).duration)) {
                let current = video.get(0).currentTime;
                let duration = video.get(0).duration;

                setLoaded(current, duration);
				setTimer(current, duration);
            }
        }

        // Event when timeupdate
        video.on('timeupdate ', function (e) {
            display();
			instance.loader(false);
        });

        // Event when click on progress bar
		// Then get position of mouse and count the time go to
        progressBar.on("click", function (e) {
            let offset = $(this).offset();
            let left = (e.pageX - offset.left);
            let totalWidth = progressBar.width();
            let percentage = (left / totalWidth);
            let vidTime = video.get(0).duration * percentage;
            video.get(0).currentTime = vidTime;
			setLoaded(left, totalWidth);
			instance.loader(true);
        });
		
		// Event when hover on progress
		// Then get position of mouse, count the time go to and get information
		progressBar.on("mousemove", function (e) {
            let offset = $(this).offset();
            let left = (e.pageX - offset.left);
            let totalWidth = progressBar.width();
            let percentage = (left / totalWidth);
			let current = video.get(0).duration * percentage;
			
			let hours = Math.floor(current / 3600);
			let minutes = Math.floor((current - hours * 3600) / 60);
			let seconds = Math.floor(current - (minutes * 60 + hours * 3600));
			let currentTime = (hours > 0 ? (pad(hours, 2) + ':') : '') + pad(minutes, 2) + ':' + pad(seconds, 2);

			progressTimerTooltipText.css('left', left+'px').text(currentTime);
			progressTimerTooltipImage.css('left', left+'px');
			
			// Get picture
			tooltipCanvas.getContext('2d').drawImage(video.get(0), 0, 0, tooltipCanvas.width, tooltipCanvas.height);
        });

        // Event when loaded data
		// Then call display information on screen
        video.on('loadeddata', function (e) {
			display();
			instance.loader(false);
        });
		
		// Event when start load data
		video.on('loadstart', function (e) {
			instance.loader(true);
        });

        return this;
    }

    /**
     * Sound
     * @return {DilationPlayer}
     */
    sound() {
        // Defined elements
        let video = this.config.get('elements.video', true);
        let videoDom = video.get(0);
        let volume = this.config.get('elements.control_volume', true);
        let volumeRange = this.config.get('volume');
		let icons = this.config.get('icons');

        function makeIcon(){
            if (videoDom.muted == true) {
                volume.html(icons.volume_mute);
            } else {
                volume.html(icons.volume_1);
            }
        }

        // Set sound default
        if (volumeRange === 0) {
            videoDom.muted = true;
        }

        // Event click on button
        volume.on('click', function(){
            if (videoDom.muted == true) {
                videoDom.muted = false;
            } else {
                videoDom.muted = true;
            }

            makeIcon();
        });
		
		makeIcon();

        return this;
    }

    /**
     * Logo
     * return {DilationPlayer}
     */
    logo() {
        let logo = this.config.get('elements.logo', true);

		// Set size for Logo
        function resizeLogo(){
            let height = logo.height();
            logo.width(height);
        }

        $(window).resize(function(){
            resizeLogo();
        });

        resizeLogo();
		
		// Event when click on logo
		// Event when hover on logo

        return this;
    }

    /**
     * Toggle control
     * @return {DilationPlayer}
     */
    control() {
        // Defined elements
        let controlTime = null;
        let instance = this;
        let control = this.config.get('elements.control', true);
        let isMouseIn = false;
        let container = this.config.get('elements.container', true);
        let video = this.config.get('elements.video', true);

        function hidden() {
            if (!video.get(0).paused) {
                control.removeClass('active');

                if (isMouseIn) {
                    container.addClass('hidden-cursor');
                } else {
                    container.removeClass('hidden-cursor');
                }
            }
        }

        function open() {
            window.clearTimeout(controlTime);
            control.addClass('active');
            container.removeClass('hidden-cursor');

            controlTime = window.setTimeout(function () {
                hidden();
            }, 2000);
        }

        // Event when hover on video/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mousemove(function () {
            open();
            isMouseIn = true;
        });

        // Event when out on video/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mouseleave(function () {
            hidden();
            isMouseIn = false;
        });

        // Event when video pause or ended
        video.on('pause ended', function () {
            control.addClass('active');
        });

        return this;
    }
	
	/**
     * Toggle show/hidel loader
	 * @param disabled
     * @return {DilationPlayer}
     */
	loader(show, refresh){
		let loader = this.config.get('elements.loader', true);
		
		if (refresh === true) {
			let loaderIcon = this.config.get('elements.loader_icon', true);
			loaderIcon.html(this.config.get('icons.loader'));
		}
		
		if (show === true) {
			loader.show();
		} else if (show === false) {
			loader.hide();
		} else {
			loader.toggle();
		}
		
		return this;
	}
}