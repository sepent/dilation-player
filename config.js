// ====================================================
// Class {DPScreen}
// ====================================================
class DPScreen extends DPBase {
    /**
     * Constructor
     * @param app
     */
    constructor(app) {
        super();
        this.app = app;
    }

    /**
     * Default screen
     */
    defaultScreen() {
        let sizeConfig = this.app.config.get('size', false);
        let elObject = this.app.config.get('elements.object', true);

        if (sizeConfig.height !== undefined) {
            elObject.css({height: sizeConfig.height});

            if (sizeConfig.width !== undefined) {
                elObject.css({width: sizeConfig.width});
            } else {
                elObject.css({width: (elObject.height() * sizeConfig.rate) + 'px'});
            }
        } else {
            elObject.css({width: sizeConfig.width});

            if (sizeConfig.height !== undefined) {
                elObject.css({height: sizeConfig.height});
            } else {
                elObject.css({height: (elObject.width() * sizeConfig.rate) + 'px'});
            }
        }

        if (!this.defaultSize) {
            this.defaultSize = {
                width: elObject.width(),
                height: elObject.height()
            };
        }

        elObject.css({maxWidth: '100%'});
        this.rateScreenSize();

        return this;
    }

    /**
     * Rate screen size
     */
    rateScreenSize() {
        let elObject = this.app.config.get('elements.object', true);
        let runnerSize = 0;
        let h = 0;

        if (this.isLarge) {
            runnerSize = $(window).width();

            elObject.width(runnerSize);
            h = (runnerSize * this.defaultSize.height / this.defaultSize.width);
            let windowH = $(window).height() * 85 / 100;

            if (h > windowH) {
                h = windowH;
            }
        } else {
            runnerSize = elObject.width();
            h = (runnerSize * this.defaultSize.height / this.defaultSize.width);
        }

        elObject.css({height: h + 'px'});
        this.app.event.trigger('dp.screen.change');

        return this;
    }

    /**
     * Make icon
     * @param isFull
     */
    makeIconForFullScreen(isFull) {
        let icons = this.app.config.get('icons', false);
        let elBtnFullScreen = this.app.config.get('elements.controlFullScreen', true);

        if (isFull === undefined) {
            isFull = document.fullscreenElement
                || document.mozFullScreenElement
                || document.webkitFullscreenElement;
        }

        if (isFull) {
            elBtnFullScreen.html(icons.actualScreen);
        } else {
            elBtnFullScreen.html(icons.fullScreen);
        }

        return this;
    }

    /**
     * Toggle
     * @param event
     */
    toggleFullScreen() {
        let elContainer = this.app.config.get('elements.container', true);
        let isFullScreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        let container = elContainer.get(0);
        let instance = this;

        container.requestFullScreen = container.requestFullScreen || container.webkitRequestFullScreen || container.mozRequestFullScreen || function () {
            return false;
        };

        document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
            return false;
        };

        isFullScreen ? (function () {
            instance.app.event.trigger('dp.screen.full.inactive');
            document.cancelFullScreen();
        })() : (function () {
            instance.app.event.trigger('dp.screen.full.active');
            container.requestFullScreen();
        })();

        return this;
    }

    /**
     * Make icon
     * @param isFull
     */
    makeIconForLargeScreen(isLg) {
        let elBtnLargeScreen = this.app.config.get('elements.controlLargeScreen', true);

        if (isLg === undefined) {
            isLg = this.isLarge;
        }

        if (isLg) {
            elBtnLargeScreen.html(this.icons.smallScreen);
        } else {
            elBtnLargeScreen.html(this.icons.largeScreen);
        }

        return this;
    }

    /**
     * Toggle
     * @param event
     */
    toggleLargeScreen() {
        if (this.isLarge) {
            this.isLarge = false;
            this.app.event.trigger('dp.screen.large.inactive');
            this.defaultScreen();
        } else {
            this.isLarge = true;
            this.app.event.trigger('dp.screen.large.active');
            this.rateScreenSize();
        }

        return this;
    }

    /**
     * Init
     * @return {DPScreen}
     */
    init() {
        // Defined the common variable for object
        this.isLarge = false;
        this.defaultSize = null;

        let elBtnFullScreen = this.app.config.get('elements.controlFullScreen', true);
        let elBtnLargeScreen = this.app.config.get('elements.controlLargeScreen', true);
        let largeScreen = this.app.config.get('largeScreen');
        let instance = this;

        // Event when click on button fullscreen
        // Then call to check full or cancel
        elBtnFullScreen.on('click', function (event) {
            instance.toggleFullScreen();
        });

        // Event when click on button large
        // Then call to check large or cancel
        elBtnLargeScreen.on('click', function (event) {
            instance.toggleLargeScreen();
            instance.makeIconForLargeScreen();
        });

        // Event when change screen
        // Then get status and change icon
        $(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange", function () {
            instance.makeIconForFullScreen();
        });

        // Event when window resize
        $(window).resize(function () {
            instance.rateScreenSize();
        });

        // Call when init screen
        this.defaultScreen();
        this.makeIconForFullScreen(false);

        // Check if config is setting true large as default
        if (largeScreen) {
            instance.toggleLargeScreen();
        }

        this.makeIconForLargeScreen();

        return this;
    }
}