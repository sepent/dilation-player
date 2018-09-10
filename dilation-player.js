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

        if (config.elements == undefined) {
            config.elements = {};
        }

        if (config.elements.controls == undefined) {
            config.elements.controls = {};
        }

        // Init config for config data
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
        this.config.elements.controls.volume = this.or(config.elements.controls.volume, '.dilation-player-btn-volume');
        this.config.elements.controls.timer = this.or(config.elements.controls.timer, '.dilation-player-timer');

        // Config default
        this.config.volume = this.or(config.volume, true);

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
        this.control()
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
        let btn = this.config.get('elements.controls.playPause', true);
        let icon = btn.find('i');

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
            icon.attr('class', 'icons icon-control-pause');
        });

        // Event when video pause or ended
        video.on('pause ended', function () {
            icon.attr('class', 'icons icon-control-play');
        });

        // Init display icon in button play/pause
        if (video.get(0).paused) {
            icon.attr('class', 'icons icon-control-play');
        } else {
            icon.attr('class', 'icons icon-control-pause');
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
        let btn = this.config.get('elements.controls.fullscreen', true);
        let icon = btn.find('i');

        // Method handle fullscreen
        function request() {
            element.requestFullScreen();
            icon.attr('class', 'icons icon-size-actual');
        }

        // Method handle turn off fullscreen
        function cancel() {
            document.cancelFullScreen();
            icon.attr('class', 'icons icon-size-fullscreen');
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
        let video = this.config.get('elements.video', true);
        let progressBar = this.config.get('elements.progress', true);
        let progress = progressBar.find('.playing');
        let timer = this.config.get('elements.controls.timer', true);

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        // Set loaded default is 0
        function resize() {
            if (!isNaN(video.get(0).duration)) {
                let current = video.get(0).currentTime;
                let duration = video.get(0).duration;

                progress.width((current / duration * 100) + '%');

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
        }

        // Event when timeupdate
        video.on('timeupdate ', function (e) {
            resize();
        });

        // Event when click on progress bar
        progressBar.on("click", function (e) {
            let offset = $(this).offset();
            let left = (e.pageX - offset.left);
            let totalWidth = progressBar.width();
            let percentage = (left / totalWidth);
            let vidTime = video.get(0).duration * percentage;
            video.get(0).currentTime = vidTime;
        });

        // Event when start load
        // video.on('loadstart', function (e) {
        //     resize();
        // });

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
        let volume = this.config.get('elements.controls.volume', true);
        let volumeRange = this.config.get('volume');
        let icon = volume.find('i');

        function makeIcon(){
            if (videoDom.muted == true) {
                icon.attr('class', 'icons icon-volume-off');
            } else {
                icon.attr('class', 'icons icon-volume-1');
            }
        }

        // Set sound default
        if (volumeRange === 0) {
            videoDom.muted = true;
        }

        makeIcon();

        // Event click on button
        volume.on('click', function(){
            if (videoDom.muted == true) {
                videoDom.muted = false;
            } else {
                videoDom.muted = true;
            }

            makeIcon();
        });

        return this;
    }

    /**
     * Logo
     * return {DilationPlayer}
     */
    logo() {
        let logo = this.config.get('elements.logo', true);

        function resizeLogo(){
            let height = logo.height();
            logo.width(height);
        }

        $(window).resize(function(){
            resizeLogo();
        });

        resizeLogo();

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
}