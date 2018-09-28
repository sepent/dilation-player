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
        let close = this.app.config.el('elements.adsClose');
        let instance = this;
        let runner = this.app.config.runner(true).node();
        this.isPlay = !runner.paused;
        this.runningAds = null;
        this.types = {full: 'full', line: 'line', require: 'require'};

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
            let control = this.app.config.el('elements.control');
            let ads = this.app.config.el('elements.ads');

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
        let ads = this.app.config.el('elements.ads');
        let adsClose = this.app.config.el('elements.adsClose');
        let adsContent = this.app.config.el('elements.adsContent');
        let runner = this.app.config.runner(true).node();
        let instance = this;
        this.isPlay = !runner.paused;

        if (conf !== undefined) {
            this.currentSetting = this.or(conf, {});
        }

        this.currentSetting.type = this.or(this.currentSetting.type, this.types.line);

        ads.removeClass(this.types.line)
            .removeClass(this.types.full)
            .removeClass(this.types.require)
            .addClass(this.currentSetting.type);
        ads.active(true);

        if (content !== undefined) {
            adsContent.html(content);
        }

        if (this.currentSetting.type === this.types.require) {
            this.app.source.pause();
            adsClose.active(false);

            this.runningAds = window.setTimeout(function(){
                instance.close();
            }, this.currentSetting.time);
        } else if (this.currentSetting.type === this.types.full) {
            this.app.source.pause();
            adsClose.active(true);
        } else {
            adsClose.active(true);
        }

        this.resize();

        return this;
    }

    /**
     * Close
     * @return {DilationPlayerPluginsAds}
     */
    close(){
        let ads = this.app.config.el('elements.ads');

        window.clearTimeout(this.runningAds);
        ads.active(false);

        if ((this.currentSetting.type === this.types.require
            || this.currentSetting.type === this.types.full)
            && this.isPlay) {
            this.app.source.play();
        }
    }
}