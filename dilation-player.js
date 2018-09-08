// ====================================================
// Class {DilationPlayerConfig}
// ====================================================
class DilationPlayerConfig {
    /**
     * Constructor
     * @param config
     */
    constructor(config) {
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
        this.config.elements.button = this.or(config.elements.button, '.dilation-player-button');
        this.config.elements.controls.playPause = this.or(config.elements.controls.playPause, '.dilation-player-btn-play');
        this.config.elements.controls.fullscreen = this.or(config.elements.controls.fullscreen, '.dilation-player-btn-fullscreen');
        this.config.elements.controls.sound = this.or(config.elements.controls.playPause, '.dilation-player-btn-sound');
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
    get(key) {
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
        this.toggleControl()
            .togglePlayPause()
            .toggleFullscreen()
            .progress();
    }

    /**
     * Toggle play pause
     */
    togglePlayPause() {
        let video = $(this.config.get('elements.video'));
        let btn = $(this.config.get('elements.controls.playPause'));
        let icon = btn.find('i');

        function toggleIcon() {
            if (video.get(0).paused) {
                video.get(0).play();
                icon.attr('class', 'icons icon-control-pause');
            } else {
                video.get(0).pause();
                icon.attr('class', 'icons icon-control-play');
            }
        }

        btn.click(function () {
            toggleIcon();
        });

        video.click(function () {
            toggleIcon();
        });

        video.on('play', function(){
            icon.attr('class', 'icons icon-control-pause');
        });

        video.on('pause ended', function(){
            icon.attr('class', 'icons icon-control-play');
        });

        if (video.get(0).paused) {
            icon.attr('class', 'icons icon-control-play');
        } else {
            icon.attr('class', 'icons icon-control-pause');
        }

        return this;
    }

    /**
     *  Toggle full screen event
     */
    toggleFullscreen() {
        let element = $(this.config.get('elements.container')).get(0);
        let icon = $(this.config.get('elements.controls.fullscreen')).find('i');

        function request() {
            element.requestFullScreen();
            icon.attr('class', 'icons icon-size-actual');
        }

        function cancel() {
            document.cancelFullScreen();
            icon.attr('class', 'icons icon-size-fullscreen');
        }

        $(document).on('click', this.config.get('elements.controls.fullscreen'), function (event) {
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

    progress() {
        let video = $(this.config.get('elements.video'));
        let progressBar = $(this.config.get('elements.progress'));
        let progress = progressBar.find('.load');
        let control = $(this.config.get('elements.control'));

        progress.width(0);

        video.on('timeupdate ', function (e) {
            if (!isNaN(video.get(0).duration)) {
                var percent = video.get(0).currentTime / video.get(0).duration;
                progress.width((percent*100) + '%');
            }
        });

        // Event when hover on
        progressBar.hover(function(){
            control.addClass('progress-hover');
        });

        progressBar.mouseout(function(){
            control.removeClass('progress-hover');
        });

        return this;
    }

    toggleControl() {
        let controlTime = null;
        let instance = this;
        let control = $(instance.config.get('elements.control'));
        let isMouseIn = false;
        let container = $(this.config.get('elements.container'));
        let video = $(this.config.get('elements.video'));

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

        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mousemove(function () {
            open();
            isMouseIn = true;
        });

        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mouseleave(function () {
            hidden();
            isMouseIn = false;
        });

        video.on('pause ended', function(){
            control.addClass('active');
        });

        return this;
    }
}