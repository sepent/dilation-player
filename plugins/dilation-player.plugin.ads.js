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

        // Event when click on button close
        close.on('click', function () {
            $(this).closest(ads).removeClass('active');

            if (this.currentSetting.type === 'full') {
                instance.app.source.play();
            }
        });

        close.html(icon);

        $(window).resize(function(){
            instance.resize();
        });

        return this;
    }

    /**
     * Resize
     */
    resize(){
        if (this.currentSetting.type === 'line') {
            let control = this.config.get('elements.control', true);
            let ads = this.config.get('elements.ads', true);
            let height = control.height();
            ads.css('bottom', (height + 1)+'px');
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
        let instance;

        if (conf === undefined) {
            conf = this.currentSetting;
        }

        this.currentSetting = this.or(conf, {});
        this.currentSetting.type = this.or(this.currentSetting.type, 'line');

        ads.removeClass(this.usedType.join(' '))
            .addClass(this.currentSetting.type);
        ads.addClass('active');
        adsClose.addClass('active');

        this.usedType.push(this.currentSetting.type);

        if (content !== undefined) {
            adsContent.html(content);
        }

        if (this.currentSetting.type === 'full') {
            this.app.source.pause();

            window.setTimeout(function(){
                instance.app.source.play();
            }, this.currentSetting.time);
        }

        this.resize();

        return this;
    }
}