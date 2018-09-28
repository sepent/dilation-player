// ====================================================
// Plugin {DPAds}
// ====================================================
class DPAdsPlugin extends DPBase {
    /**
     * constructor
     * @param app
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.app = app;
        this.helper = app.helper;
        this.currentSetting = {};
        this.usedType = [];
    }

    /**
     * Run
     * @return {DilationPlayerPluginsAds}
     */
    init() {
        let icon = this.config.get('icons.close');
        let close = this.config.get('elements.adsClose', true);
        let ads = this.config.get('elements.ads');
        let instance = this;
        let runner = this.config.runner(true).node();
        this.isPlay = !runner.paused;
        this.runningAds = null;
        this.types = {full: 'full', line: 'line'};

        // Event when click on button close
        close.listen('click', function () {
            window.clearTimeout(this.runningAds);
            __dp.node(this).closest(ads).removeClass('active');

            if (instance.currentSetting.type === this.types.full && instance.isPlay) {
                instance.app.source.play();
            }
        });

        close.html(icon);

        function __callResize(){
            instance.resize();
        }

        __dp.node(window).listen('resize', __callResize);

        // Event when control change
        this.app.event.listen('dp.control.hide', __callResize)
                .listen('dp.control.show', __callResize);

        return this;
    }

    /**
     * Resize
     */
    resize(){
        if (this.currentSetting.type === 'line') {
            let control = this.config.get('elements.control', true);
            let ads = this.config.get('elements.ads', true);

            if (control.hasClass('active')) {
                let height = control.height();
                ads.css('bottom', (height + 1)+'px');
            } else {
                ads.css('bottom', '10px');
            }
        }
    }

    /**
     * Run
     * @return {DilationPlayerPluginsAds}
     */
    show(content, conf) {
        let ads = this.config.get('elements.ads', true);
        let adsClose = this.config.get('elements.adsClose', true);
        let adsContent = this.config.get('elements.adsContent', true);
        let runner = this.config.runner(true).node();
        let instance = this;
        this.isPlay = !runner.paused;

        if (conf !== undefined) {
            this.currentSetting = this.or(conf, {});
        }

        this.currentSetting.type = this.or(this.currentSetting.type, this.types.line);

        ads.removeClass(this.types.line)
            .removeClass(this.types.full)
            .addClass(this.currentSetting.type);
        ads.addClass('active');
        adsClose.addClass('active');

        if (content !== undefined) {
            adsContent.html(content);
        }

        if (this.currentSetting.type === this.types.full) {
            this.app.source.pause();

            this.runningAds = window.setTimeout(function(){
                ads.removeClass('active');

                if (instance.isPlay) {
                    instance.app.source.play();
                }
            }, this.currentSetting.time);
        }

        this.resize();

        return this;
    }
}