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
        this.app = app;
        this.currentSetting = {};
        this.usedType = [];
    }

    /**
     * Run
     * @return {DilationPlayerPluginsAds}
     */
    init() {
        let icon = this.app.config.get('icons.close');
        let close = this.app.config.get('elements.adsClose', true);
        let instance = this;
        let runner = this.app.config.runner(true).node();
        this.isPlay = !runner.paused;
        this.runningAds = null;
        this.types = {full: 'full', line: 'line'};

        // Event when click on button close
        close.listen('click', function () {
            instance.close();
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
    open(content, conf) {
        let ads = this.app.config.get('elements.ads', true);
        let adsClose = this.app.config.get('elements.adsClose', true);
        let adsContent = this.app.config.get('elements.adsContent', true);
        let runner = this.app.config.runner(true).node();
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
                instance.close();
            }, this.currentSetting.time);
        }

        this.resize();

        return this;
    }

    /**
     * Close
     * @return {DilationPlayerPluginsAds}
     */
    close(){
        let ads = this.app.config.get('elements.ads', true);

        window.clearTimeout(this.runningAds);
        ads.active(false);

        if (this.currentSetting.type === this.types.full && this.isPlay) {
            this.app.source.play();
        }
    }
}