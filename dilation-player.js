let DPTranslateData = {
    en: {
        menu: {
            loop: 'Loop this video',
            copy_url: 'Copy video\'s url'
        },

        app: {
            loading: 'Loading...',
            not_support: 'This browser not support player'
        }
    },

    vi: {
        menu: {
            loop: 'Lặp video này',
            copy_url: 'Copy đường dẫn video'
        },

        app: {
            loading: 'Đang tải...',
            not_support: 'Trình duyệt không hỗ trợ player'
        }
    }
}

// ====================================================
// Class {Base}
// ====================================================
class DPBase {
    /**
     * Check if value is undefined then return or
     * @param value
     * @param or
     * @return mixed
     */
    or(value, or) {
        return value === undefined ? or : value;
    }
}

// ====================================================
// Class {DPConfig}
// ====================================================
class DPConfig extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(config) {
        super();

        // Set default
        config.logo = this.or(config.logo, {});
        config.size = this.or(config.size, {});

        // Config for elements
        this.config = {
            elements: this.mergeElements(config),
            // Config for icon
            icons: this.mergeIcons(config),
            // Config default
            volume: this.or(config.volume, 100),
            object: this.or(config.object, null),
            view: this.mergeView(config),
            sources: this.or(config.sources, []),
            logo: this.mergeLogo(config),
            size: this.mergeSize(config),
            largeScreen: this.or(config.largeScreen, false),
            locale: this.or(config.locale, 'en'),
            menu: this.mergeMenu(config),
            poster: this.or(config.poster, null),
            schedules: this.mergeSchedules(config),
            type: this.or(config.type, 'video'), // audio or video
            plugins: this.mergePlugins(config)
        };

        // Function

        // Init cache
        this.cache = {
            dom: {
                object: $(this.config.object)
            },
            config: {}
        };
    }

    /**
     * Merge menu
     * @return {object}
     */
    mergeMenu(config) {
        if (config.menu === false) {
            return false;
        }

        let rs = this.or(config.menu, {});

        rs.loop = this.or(rs.loop, {
            text: 'menu.loop',
            element: 'menuItemLoop',
            execute: function (item, menu, config) {
                menu.execLoop(item, config);
            }
        });

        rs.copyUrl = this.or(rs.copyUrl, {
            text: 'menu.copy_url',
            element: 'menuItemCopyUrl',
            execute: function (item, menu, config) {
                menu.execCopyUrl(item, config);
            }
        });

        return rs;
    }

    /**
     * Merge Elements
     * @return {object}
     */
    mergeElements(config) {
        config.elements = this.or(config.elements, {});

        return {
            container: this.or(config.elements.container, '.dp'),
            video: this.or(config.elements.video, '.dp-video'),
            audio: this.or(config.elements.audio, '.dp-audio'),
            logo: this.or(config.elements.logo, '.dp-logo'),
            progress: this.or(config.elements.progress, '.dp-progress'),
            progressLoading: this.or(config.elements.progressLoading, '.dp-progress .dp-loading'),
            progressPlaying: this.or(config.elements.progressPlaying, '.dp-progress .dp-playing'),
            progressHoverTooltipText: this.or(config.elements.progressHoverTooltipText, '.dp-progress-tooltip-text'),
            progressToverTooltipImage: this.or(config.elements.progressToverTooltipImage, '.dp-progress-tooltip-image'),
            control: this.or(config.elements.control, '.dp-control'),
            button: this.or(config.elements.button, '.dp-button'),
            controlPlayPause: this.or(config.elements.controlPlayPause, '.dp-btn-play'),
            controlFullScreen: this.or(config.elements.controlFullScreen, '.dp-btn-fullscreen'),
            controlLargeScreen: this.or(config.elements.controlLargeScreen, '.dp-btn-largescreen'),
            controlVolume: this.or(config.elements.controlVolume, '.dp-btn-volume'),
            controlVolumeTooltip: this.or(config.elements.controlVolumeTooltip, '.dp-volume-tooltip'),
            controlVolumeRange: this.or(config.elements.controlVolumeRange, '.dp-volume-range'),
            controlTimer: this.or(config.elements.controlTimer, '.dp-timer'),
            modal: this.or(config.elements.modal, '.dp-modal'),
            loaderModal: this.or(config.elements.loaderModal, '.dp-modal-loader'),
            loaderModalIcon: this.or(config.elements.loaderModalIcon, '.dp-modal-loader-icon'),
            playerModal: this.or(config.elements.playerModal, '.dp-modal-player'),
            playerModalIcon: this.or(config.elements.playerModalIcon, '.dp-modal-player-icon'),
            menu: this.or(config.elements.menu, '.dp-menu'),
            menuList: this.or(config.elements.menuList, '.dp-menu-list'),
            menuItem: this.or(config.elements.menuItem, '.dp-menu-item'),
            menuItemLoop: this.or(config.elements.menuItemLoop, '.dp-menu-item-loop'),
            menuItemCopyUrl: this.or(config.elements.menuItemCopyUrl, '.dp-menu-item-copy-url'),
            ads: this.or(config.elements.ads, '.dp-ads'),
            adsItem: this.or(config.elements.adsItem, '.dp-ads .dp-ads-item'),
            adsContent: this.or(config.elements.adsContent, '.dp-ads .dp-ads-content'),
            adsClose: this.or(config.elements.adsClose, '.dp-ads .dp-ads-close'),
        };
    }

    /**
     * Merge Icons
     * @return {object}
     */
    mergeIcons(config) {
        config.icons = this.or(config.icons, {});

        return {
            loaderModal: this.or(config.icons.loaderModal, '<i class="fa fa-spin fa-spinner"></i>'),
            playerModal: this.or(config.icons.loaderModal, '<i class="icons icon-control-play"></i>'),
            fullScreen: this.or(config.icons.fullScreen, '<i class="icons icon-size-fullscreen"></i>'),
            actualScreen: this.or(config.icons.actualScreen, '<i class="icons icon-size-actual"></i>'),
            largeScreen: this.or(config.icons.largeScreen, '<i class="icons icon-frame"></i>'),
            smallScreen: this.or(config.icons.smallScreen, '<i class="icons icon-frame"></i>'),
            pause: this.or(config.icons.pause, '<i class="icons icon-control-pause"></i>'),
            play: this.or(config.icons.play, '<i class="icons icon-control-play"></i>'),
            volumeMute: this.or(config.icons.volumeMute, '<i class="icons icon-volume-off"></i>'),
            volume1: this.or(config.icons.volume1, '<i class="icons icon-volume-1"></i>'),
            volume2: this.or(config.icons.volume2, '<i class="icons icon-volume-2"></i>'),
            volume3: this.or(config.icons.volume3, '<i class="icons icon-volume-3"></i>'),
            close: this.or(config.icons.close, '[X]')
        };
    }

    /**
     * Merge logo
     * @return {object}
     */
    mergeLogo(config) {
        // Check if logo is false, its mean is not show
        if (config.logo === false) {
            return config.logo;
        }

        // Check if logo is undefined then get default value
        config.logo = this.or(config.logo, {});

        let rs = {};

        if (config.logo.height !== undefined) {
            rs.height = config.logo.height;

            if (config.logo.width !== undefined) {
                rs.width = config.logo.width;
            } else {
                rs.rate = this.or(config.logo.rate, 1);
            }
        } else if (config.logo.width !== undefined) {
            rs.width = config.logo.width;

            if (config.logo.height !== undefined) {
                rs.height = config.logo.height;
            } else {
                rs.rate = this.or(config.logo.rate, 1);
            }
        } else {
            rs.height = '10%';
            rs.rate = 1;
        }

        rs.url = this.or(config.logo.url, null);

        return rs;
    }

    /**
     * Merge size
     * @return {object}
     */
    mergeSize(config) {
        config.size = this.or(config.size, {});
        let rs = {};

        if (config.size.height !== undefined) {
            rs.height = config.size.height;

            if (config.size.width !== undefined) {
                rs.width = config.size.width;
            } else {
                rs.rate = this.or(config.size.rate, 3 / 2);
            }
        } else if (config.size.width !== undefined) {
            rs.width = config.size.width;

            if (config.size.height !== undefined) {
                rs.height = config.size.height;
            } else {
                rs.rate = this.or(config.size.rate, 2 / 3);
            }
        } else {
            rs.width = '100%';
            rs.rate = 2 / 3;
        }

        return rs;
    }

    /**
     * Merge view
     * @return {object}
     */
    mergeView(config) {
        if (config.view == false
            || config.view == undefined) {
            config.view = {};
        }

        return {
            content: this.or(config.view.content, null),
            import: this.or(config.view.import, null)
        };
    }

    /**
     * Merge schedules
     * @param config
     * @return {object}
     */
    mergeSchedules(config) {
        if (!config.schedules) {
            return [];
        }

        let rs = this.or(config.schedules, []);

        return rs;
    }

    /**
     * Merge plugins
     * @param config
     * @return {object}
     */
    mergePlugins(config) {
        return this.or(config.plugins, {});
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
        if (dom === true && (typeof config === 'string')) {
            if (this.cache.dom[key] === undefined) {
                this.cache.dom[key] = this.cache.dom['object'].find(config);
            }

            return this.cache.dom[key];
        }

        return config;
    }

    /**
     * Get runner
     * @param isDom
     * @return {mixed}
     */
    runner(isDom) {
        let type = this.get('type');
        return this.get('elements.' + type, isDom);
    }
}

// ====================================================
// Class {DPHelper}
// ====================================================
class DPHelper extends DPBase {
    constructor(app) {
        super();
        this.app = app;
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    parseTime(times) {
        let hours = Math.floor(times / 3600);
        let minutes = Math.floor((times - hours * 3600) / 60);
        let seconds = Math.floor(times - (minutes * 60 + hours * 3600));
        let format = (hours > 0 ? (this.pad(hours, 2) + ':') : '') + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);

        return format;
    }
}

// ====================================================
// Class {DPEvent}
// ====================================================
class DPEvent extends DPBase {
    /**
     * constructor
     */
    constructor(app) {
        super();
        this.app = app;
    }

    /**
     * Init
     */
    init(){
        this.events = {};
        this.viewEvents()
            .logoEvents()
            .menuEvents()
            .controlEvents()
            .screenEvents()
            .modalEvents();
    }

    /**
     * View events
     * @return {DPEvent}
     */
    viewEvents() {
        let instance = this;

        this.events['dp.view.rendering'] = function(parameters){
            return instance.createEvent('dp.view.rendering', parameters);
        };

        this.events['dp.view.rendered'] = function(parameters){
            return instance.createEvent('dp.view.rendered', parameters);
        };

        return this;
    }

    /**
     * Logo events
     * @return {DPEvent}
     */
    logoEvents(){
        let instance = this;

        this.events['dp.logo.resize'] = function(parameters){
            return instance.createEvent('dp.logo.resize', parameters);
        };

        return this;
    }

    /**
     * Menu events
     * @return {DPEvent}
     */
    menuEvents(){
        let instance = this;

        this.events['dp.menu.open'] = function(parameters){
            return instance.createEvent('dp.menu.open', parameters);
        };

        this.events['dp.menu.close'] = function(parameters){
            return instance.createEvent('dp.menu.close', parameters);
        };

        return this;
    }

    /**
     * Control events
     * @return {DPEvent}
     */
    controlEvents(){
        let instance = this;

        this.events['dp.control.show'] = function(parameters){
            return instance.createEvent('dp.control.show', parameters);
        };

        this.events['dp.control.hide'] = function(parameters){
            return instance.createEvent('dp.control.hide', parameters);
        };

        return this;
    }

    /**
     * Logo events
     * @return {DPEvent}
     */
    modalEvents(){
        let instance = this;

        // Event for loader
        this.events['dp.modal.loader.show'] = function(parameters){
            return instance.createEvent('dp.modal.loader.show', parameters);
        };

        this.events['dp.modal.loader.hide'] = function(parameters){
            return instance.createEvent('dp.modal.loader.hide', parameters);
        };

        // Event for player
        this.events['dp.modal.player.show'] = function(parameters){
            return instance.createEvent('dp.modal.player.show', parameters);
        };

        this.events['dp.modal.player.hide'] = function(parameters){
            return instance.createEvent('dp.modal.player.hide', parameters);
        };

        return this;
    }

    /**
     * Screen events
     * @return {DPEvent}
     */
    screenEvents() {
        let instance = this;

        // Event for large screen
        this.events['dp.screen.large.active'] = function(parameters) {
            return [
                instance.createEvent('dp.screen.large.change', parameters),
                instance.createEvent('dp.screen.large.active', parameters)
            ];
        };

        this.events['dp.screen.large.inactive'] = function(parameters) {
            return [
                instance.createEvent('dp.screen.large.change', parameters),
                instance.createEvent('dp.screen.large.inactive', parameters)
            ];
        };

        // Event for full screen
        this.events['dp.screen.full.active'] = function(parameters) {
            return [
                instance.createEvent('dp.screen.full.change', parameters),
                instance.createEvent('dp.screen.full.active', parameters)
            ];
        };

        this.events['dp.screen.full.inactive'] = function(parameters) {
            return [
                instance.createEvent('dp.screen.full.change', parameters),
                instance.createEvent('dp.screen.full.inactive', parameters)
            ];
        };

        this.events['dp.screen.change'] = function(parameters) {
            return instance.createEvent('dp.screen.change', parameters);
        };

        return this;
    }

    /**
     * Create event
     * @param name
     * @param parameters
     */
    createEvent(name, parameters){
        return new CustomEvent(name, parameters);
    }

    /**
     * Trigger event
     * @param name
     * @param parameters
     */
    trigger(name, parameters){
        let events = this.events[name](this.or(parameters, {}));
        let ob = this.app.config.get('object', true);
        let dom = ob.get(0);

        if (events instanceof Array) {
            events.forEach(function (item, index) {
                //console.log(name, item, index);
                dom.dispatchEvent(item);
                ob.trigger(item.type);
            });
        } else {
            dom.dispatchEvent(events);
            ob.trigger(events.type);
        }
    }
}

// ====================================================
// Class {DPView}
// ====================================================
class DPView extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
    }

    /**
     * Render view
     * @return {DPView}
     */
    async render() {
        this.app.event.trigger('dp.view.rendering');

        let view = this.config.get('view');
        let sources = this.config.get('sources');
        let object = this.config.get('object', true);
        let sizeConfig = this.config.get('size');

        // Render size
        object.css({maxWidth: '100%'});

        if (sizeConfig.height !== undefined) {
            object.css({height: sizeConfig.height});

            if (sizeConfig.width !== undefined) {
                object.css({width: sizeConfig.width});
            } else {
                object.css({width: (object.height() * sizeConfig.rate) + 'px'});
            }
        } else {
            object.css({width: sizeConfig.width});

            if (sizeConfig.height !== undefined) {
                object.css({height: sizeConfig.height});
            } else {
                object.css({height: (object.width() * sizeConfig.rate) + 'px'});
            }
        }

        // Read content in template
        if (!view.content) {
            if (view.import) {
                object.html(this.translate.get('app.loading'));

                let response = await $.ajax({
                    url: view.import,
                    data: {},
                    method: 'GET',
                    success: function (response) {
                        return response;
                    },
                    error: function () {
                        return null;
                    }
                });

                let content = this.replace(response);
                object.html(content);
            }
        } else {
            let content = this.replace(view.content);
            object.html(content);
        }

        // Setting
        // Poster
        let poster = this.config.get('poster');
        let runner = this.config.runner(true);

        if (poster) {
            runner.get(0).poster = poster;
        }

        if (sources !== undefined) {
            runner.html(this.translate.get('app.not_support'));

            // Generate video from resources
            if (typeof sources === 'string') {
                runner.get(0).src = sources;
            } else if (sources.length == 1) {
                runner.get(0).src = sources[0].src;
            } else {
                for (var i in sources) {
                    let source = document.createElement('source');
                    $(source).attr({src: sources[i].src, type: sources[i].type});
                    runner.append(source);
                }
            }

            runner.get(0).load();
        }

        this.app.event.trigger('dp.view.rendered');

        return true;
    }

    /**
     * replace
     * @return string
     */
    replace(content) {
        return content;
    }
}

// ====================================================
// Class {DPTranslator}
// ====================================================
class DPTranslator extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.app = app;

        if (typeof DPTranslateData !== 'undefined') {
            this.languages = DPTranslateData;
        } else {
            this.languages = {};
        }
    }

    /**
     * Get translate
     * @param key
     * @param attributes
     * @return mixed
     */
    get(key, attributes) {
        if (attributes == undefined) {
            attributes = {};
        }

        var keys = key.split('.');
        var messages = this.or(this.languages[this.config.get('locale')], {});
        let message = messages;

        // Get message format
        for (var i in keys) {
            if (message[keys[i]] == undefined) {
                return key;
            }

            message = message[keys[i]];
        }

        // Get attribute in message format
        for (var attrKey in attributes) {
            if (messages[keys[0]].attributes == undefined) {
                return message;
            }

            if (messages[keys[0]].attributes[attrKey] == undefined) {
                return message;
            }

            var fields = messages[keys[0]].attributes[attrKey];
            var attr = (fields[attributes[attrKey]] != undefined ? fields[attributes[attrKey]] : attributes[attrKey]);
            var regex = new RegExp(':' + attrKey, 'g');
            message = message.replace(regex, attr);
        }

        return message;
    }
}

// ====================================================
// Class {DPMenu}
// ====================================================
class DPMenu extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
        this.status = true;
    }

    /**
     * Render menu
     * @param config
     * @return {DPMenu}
     */
    init() {
        let enableMenuList = this.config.get('menu');
        let menu = this.config.get('elements.menu', true);

        if (enableMenuList === false) {
            menu.hide();
            this.status = false;
            return this;
        }

        let container = this.config.get('elements.container', true);

        let menuList = this.config.get('elements.menuList', true);
        let menuItemClass = this.config.get('elements.menuItem').replace('.', '');

        for (var name in enableMenuList) {
            let div = document.createElement('div');
            $(div).addClass(menuItemClass)
                .attr('dp-menu:name', name)
                .html(this.translate.get(enableMenuList[name].text));

            menuList.append(div);
        }

        this.events();

        return this;
    }

    /**
     * Open menu
     * @param config
     * @return {DPMenu}
     */
    openMenu(event) {
        if (!this.status) {
            return this;
        }

        let container = this.config.get('elements.container', true);
        let menu = this.config.get('elements.menu', true);
        let menuList = this.config.get('elements.menuList', true);

        menu.addClass('active');

        let height = menuList.height();
        let width = menuList.width();

        let cheight = $(window).height();
        let cwidth = $(window).width();

        let left = event.pageX;
        let top = event.pageY;

        if ((cheight - top) < height) {
            top = cheight - height;
        }

        if ((cwidth - left) < width) {
            left = cwidth - width;
        }

        menuList.css({left: left + 'px', top: top + 'px'});

        this.app.event.trigger('dp.menu.open');

        return this;
    }

    /**
     * Close menu
     * @param config
     * @return {DPMenu}
     */
    closeMenu() {
        if (!this.status) {
            return this;
        }

        let menu = this.config.get('elements.menu', true);
        menu.removeClass('active');

        this.app.event.trigger('dp.menu.close');

        return this;
    }

    /**
     * Event menu
     * @param config
     * @return {DPMenu}
     */
    events() {
        let dp = this;
        let container = this.config.get('elements.container', true);
        let menuList = this.config.get('elements.menuList', true);
        let menuItem = this.config.get('elements.menuItem', true);

        // Event when right click or open menu
        container.mousedown(function (event) {
            var isRightMB;
            event = event || window.event;

            if (event.which === 3) {
                container.bind('contextmenu', function () {
                    return false;
                });
            }
            else {
                container.unbind('contextmenu');
            }

            if (!dp.status) {
                return;
            }

            // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            if ("which" in event)
                isRightMB = event.which == 3;
            // IE, Opera
            else if ("button" in event)
                isRightMB = event.button == 2;

            // Open menu
            if (isRightMB) {
                dp.openMenu(event);
            }
        });

        // Event when click out menu
        $(window).click(function (event) {
            if (menuList.has(event.target).length == 0
                && !menuList.is(event.target)) {
                dp.closeMenu();
            }
        });

        // Event when click menu item
        menuItem.click(function () {
            let name = $(this).attr('dp-menu:name');
            dp.execute(this, name);
        });

        return this;
    }

    /**
     * execute
     * @param name
     * @return {DilationPlayerMenu}
     */
    execute(item, name) {
        if (!this.status) {
            return this;
        }

        let config = this.config.get('menu.' + name);

        if (config.execute !== undefined) {
            config.execute(item, this, config);
        }

        return this;
    }

    /**
     * Exec Loop
     * @return {DilationPlayerMenu}
     */
    execLoop(item, config) {
        if (!this.status) {
            return this;
        }

        let runner = this.config.runner(true).get(0);

        if (runner.loop) {
            runner.loop = false;
            $(item).removeClass('active');
        } else {
            runner.loop = true;
            $(item).addClass('active');
        }

        this.closeMenu();

        return this;
    }

    /**
     * Exec Copy Video Url
     * @return {DilationPlayerMenu}
     */
    execCopyUrl(item, config) {
        if (!this.status) {
            return this;
        }

        let runner = this.config.runner(true).get(0);

        this.closeMenu();

        return this;
    }
}

// ====================================================
// Class {DPLogo}
// ====================================================
class DPLogo extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
        this.status = true;
    }

    /**
     * resizeLogo
     * @return {DPLogo}
     */
    resize() {
        if (!this.status) {
            return this;
        }

        let logo = this.config.get('elements.logo', true);
        let logoConfig = this.config.get('logo');

        if (logoConfig.height !== undefined) {
            logo.css({height: logoConfig.height});

            if (logoConfig.width !== undefined) {
                logo.css({width: logoConfig.width});
            } else {
                logo.css({width: (logo.height() * logoConfig.rate) + 'px'});
            }
        } else {
            logo.css({width: logoConfig.width});

            if (logoConfig.height !== undefined) {
                logo.css({height: logoConfig.height});
            } else {
                logo.css({height: (logo.width() * logoConfig.rate) + 'px'});
            }
        }

        this.app.event.trigger('dp.logo.resize');

        return this;
    }

    /**
     * render
     * @return {DPLogo}
     */
    init() {
        let logo = this.config.get('elements.logo', true);
        let logoConfig = this.config.get('logo');
        let dp = this;
        let object = this.config.get('object', true);

        // Check if logo is hidden
        if (logoConfig === false) {
            this.status = false;
            logo.hide();
            return this;
        }

        // Make logo
        logo.css({backgroundImage: 'url(\'' + logoConfig.url + '\')'});

        // Event when screen change
        object.on('dp.screen.change', function(){
            dp.resize();
        });

        // Default
        dp.resize();

        // Event when click on logo
        // Event when hover on logo

        return this;
    }
}

// ====================================================
// Class {DPModal}
// ====================================================
class DPModal extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        super();
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
    }

    /**
     * Render
     */
    init() {
        return this;
    }

    /**
     * Show
     * @param config
     */
    toggle(config) {
        let loader = this.config.get('elements.loaderModal', true);
        let player = this.config.get('elements.playerModal', true);
        let modal = this.config.get('elements.modal', true);
        let runnerDom = this.config.runner(true).get(0);
        let isLoaderActive = loader.hasClass('active');
        let isPlayerActive = player.hasClass('active');

        modal.removeClass('active');

        if (config === undefined) {
            if (!isNaN(runnerDom.duration)) {
                if (runnerDom.paused) {
                    player.addClass('active');
                } else {
                    player.removeClass('active');
                }
            } else {
                loader.addClass('active');
            }
        } else {
            if (config.loader === true) {
                loader.addClass('active');
            } else if (config.player === true || runnerDom.paused) {
                player.addClass('active');
            }
        }

        // Check event
        if (loader.hasClass('active') !== isLoaderActive) {
            !isLoaderActive ? this.app.event.trigger('dp.modal.loader.show') : this.app.event.trigger('dp.modal.loader.hide');
        }

        if (player.hasClass('active') !== isPlayerActive) {
            !isPlayerActive ? this.app.event.trigger('dp.modal.player.show') : this.app.event.trigger('dp.modal.player.hide');
        }

        return this;
    }
}

// ====================================================
// Class {DPModal}
// ====================================================
class DPControl extends DPBase {
    constructor(app) {
        super();
        this.config = app.config;
        this.app = app;
        this.isMouseIn = false;
        this.controlTime = null;
    }

    /**
     * Render
     */
    init() {
        let dp = this;
        let runner = this.config.runner(true);
        let runnerDom = runner.get(0);
        let control = this.config.get('elements.control', true);

        // Event when hover on runner/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.runner()).mousemove(function () {
            dp.openControl();
            dp.isMouseIn = true;
        });

        $(window).scroll(function () {
            dp.openControl();
        });

        // Event when out on runner/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.runner()).mouseleave(function () {
            dp.closeControl();
            dp.isMouseIn = false;
        });

        // Event when runner pause or ended
        runner.on('pause ended', function () {
            control.addClass('active');
        });

        // Default
        runnerDom.controls = false;

        return this;
    }

    /**
     * Hidden
     */
    closeControl() {
        let control = this.config.get('elements.control', true);
        let runner = this.config.runner(true).get(0);
        let container = this.config.get('elements.container', true);

        if (!runner.paused) {
            control.removeClass('active');
            this.app.event.trigger('dp.control.hide');

            if (this.isMouseIn) {
                container.addClass('hidden-cursor');
            } else {
                container.removeClass('hidden-cursor');
            }
        }
    }

    /**
     * open
     */
    openControl() {
        let control = this.config.get('elements.control', true);
        let container = this.config.get('elements.container', true);
        let inst = this;

        window.clearTimeout(this.controlTime);
        control.addClass('active');
        container.removeClass('hidden-cursor');
        this.app.event.trigger('dp.control.show');

        this.controlTime = window.setTimeout(function () {
            inst.closeControl();
        }, 2000);
    }
}

// ====================================================
// Class {DPSchedule}
// ====================================================
class DPSchedule extends DPBase {
    constructor(app) {
        super();
        this.config = app.config;
        this.app = app;
        this.helper = app.helper;
        this.schedules = {};
        this.alias = {};
        this.lastTime = null;
    }

    /**
     * Run
     */
    init() {
        let schedules = this.config.get('schedules');
        let dp = this;
        let runner = this.config.runner(true);
        let runnerDom = runner.get(0);

        for (var i in schedules) {
            // Add schedule to progress bar
            if (this.schedules[schedules[i].at] === undefined) {
                this.schedules[schedules[i].at] = [];
            }

            schedules[i].name = schedules[i].name || Math.random().toString(36).substring(10);
            this.alias[schedules[i].name] = schedules[i];
            this.schedules[schedules[i].at].push(schedules[i]);
        }

        // Event when timeupdate
        runner.on('timeupdate ', function (e) {
            let current = runnerDom.currentTime;
            let time = dp.helper.parseTime(current);

            if (this.lastTime === time) {
                return;
            }

            this.lastTime = time;

            let list = dp.or(dp.schedules[time], []);

            for (let i in list) {
                dp.execute(list[i].name);

                if (list[i].loop !== true) {
                    delete dp.schedules[time][i];
                }
            }
        });
    }

    /**
     * Execute schedule
     * @param name
     */
    execute(name) {
        let schedule = this.alias[name];
        schedule.execute(this.app);
    }
}

// ====================================================
// Plugin {DPAds}
// ====================================================
class DPPlugin extends DPBase {
    constructor(app) {
        super();
        this.config = app.config;
        this.app = app;
        this.helper = app.helper;
    }

    /**
     * Init
     * @return {Promise<DPPlugin>}
     */
    async init() {
        let list = this.config.get('plugins');

        for (let name in list) {
            this.app[name] = await eval('new ' + list[name].className + '(this.app)');
            this.app[name].init();
        }

        return this;
    }
}

// ====================================================
// Class {DilationPlayer}
// ====================================================
class DilationPlayer extends DPBase {
    /**
     * Constructor
     * @param config
     */
    constructor(object, config) {
        super();

        if (config == undefined) {
            config = {};
        }

        config.object = object;
        this.rendered = false;

        this.config = new DPConfig(config);
        this.event = new DPEvent(this);
        this.contextEvent();

        this.translate = new DPTranslator(this);
        this.helper = new DPHelper(this);
        this.view = new DPView(this);
        this.control = new DPControl(this);
        this.menu = new DPMenu(this);
        this.logo = new DPLogo(this);
        this.modal = new DPModal(this);
        this.plugin = new DPPlugin(this);
        this.schedule = new DPSchedule(this);

        this.apply();
    }

    /**
     * Load
     * @param resources
     */
    load(resources) {
        if (this.rendered) {
            let runner = this.config.runner(true);
            var source = document.createElement('source');
            source.setAttribute('src', resources);
            runner.appendChild(source);
        }
    }

    /**
     * Apply
     */
    async apply() {
        await this.render();

        // Regist events
        this.contextControl()
            .playPause()
            .screen()
            .progress()
            .sound()
            .contextLogo()
            .contextModal()
            .contextMenu()
            .contextPlugin()
            .contextSchedule();
    }

    /**
     * Render view
     * @return {Promise<boolean>}
     */
    async render() {
        let rendered = await this.view.render();
        this.rendered = true;

        let icons = this.config.get('icons');
        let loaderIcon = this.config.get('elements.loaderModalIcon', true);
        let playerIcon = this.config.get('elements.playerModalIcon', true);

        // default
        playerIcon.html(icons.playerModal);
        loaderIcon.html(icons.loaderModal);

        return rendered;
    }

    /**
     * Toggle play pause
     * @return {DilationPlayer}
     */
    playPause() {
        // Defined elements
        let runner = this.config.runner(true);
        let player = this.config.get('elements.playerModal', true);
        let btn = this.config.get('elements.controlPlayPause', true);
        let icons = this.config.get('icons');
        let runnerDom = runner.get(0);
        let dp = this;

        /**
         * Helper
         * @type {{toggle: toggle, makeIcon: makeIcon}}
         */
        let helper = {
            /**
             * Toggle play or pause
             */
            toggle: function () {
                if (!isNaN(runnerDom.duration)) {
                    if (runnerDom.paused) {
                        runnerDom.play();
                    } else {
                        runnerDom.pause();
                    }
                }
            },

            /**
             * Make icon
             */
            makeIcon: function () {
                if (runnerDom.paused) {
                    btn.html(icons.play);
                } else {
                    btn.html(icons.pause);
                }

                dp.modal.toggle();
            }
        };

        // Event when click on button play/pause
        btn.click(function () {
            helper.toggle();
        });

        player.click(function () {
            helper.toggle();
        });

        // Event when click on runner
        runner.click(function () {
            helper.toggle();
        });

        // Event when runner play
        runner.on('play', function () {
            helper.makeIcon();
        });

        // Event when runner pause or ended
        runner.on('pause ended', function () {
            helper.makeIcon();
        });

        // Init display icon in button play/pause
        helper.makeIcon();

        return this;
    }

    /**
     * Toggle full screen event
     * @return {DilationPlayer}
     */
    screen() {
        // Defined elements
        let element = this.config.get('elements.container', true).get(0);
        let btnFull = this.config.get('elements.controlFullScreen', true);
        let btnLarge = this.config.get('elements.controlLargeScreen', true);
        let icons = this.config.get('icons');
        let object = this.config.get('object', true);
        let sizeConfig = this.config.get('size');
        let defaultSize = null;
        let largeScreen = this.config.get('largeScreen');
        let dp = this;

        /**
         * Helper
         * @type {{makeIcon: makeIcon, request: request, cancel: cancel}}
         */
        let helper = {
            isLarge: false,

            /**
             * Default screen
             */
            defaultScreen: function () {
                if (sizeConfig.height !== undefined) {
                    object.css({height: sizeConfig.height});

                    if (sizeConfig.width !== undefined) {
                        object.css({width: sizeConfig.width});
                    } else {
                        object.css({width: (object.height() * sizeConfig.rate) + 'px'});
                    }
                } else {
                    object.css({width: sizeConfig.width});

                    if (sizeConfig.height !== undefined) {
                        object.css({height: sizeConfig.height});
                    } else {
                        object.css({height: (object.width() * sizeConfig.rate) + 'px'});
                    }
                }

                if (!defaultSize) {
                    defaultSize = {
                        width: object.width(),
                        height: object.height()
                    };
                }

                object.css({maxWidth: '100%'});
                this.rateScreenSize();

                return this;
            },

            /**
             * Rate screen size
             */
            rateScreenSize: function (isLg) {
                if (isLg == undefined) {
                    isLg = this.isLarge;
                }

                let runnerSize = 0;
                let h = 0;

                if (this.isLarge) {
                    runnerSize = $(window).width();

                    object.width(runnerSize);
                    h = (runnerSize * defaultSize.height / defaultSize.width);
                    let windowH = $(window).height() * 85 / 100;

                    if (h > windowH) {
                        h = windowH;
                    }
                } else {
                    runnerSize = object.width();
                    h = (runnerSize * defaultSize.height / defaultSize.width);
                }

                object.css({height: h + 'px'});
                dp.event.trigger('dp.screen.change');

                return this;
            },

            /**
             * Make icon
             * @param isFull
             */
            makeIconForFullScreen: function (isFull) {
                if (isFull === undefined) {
                    isFull = document.fullscreenElement
                        || document.mozFullScreenElement
                        || document.webkitFullscreenElement;
                }

                if (isFull) {
                    btnFull.html(icons.actualScreen);
                } else {
                    btnFull.html(icons.fullScreen);
                }

                return this;
            },

            /**
             * Toggle
             * @param event
             */
            toggleFullScreen: function () {
                // Check if event is html element
                // if (event instanceof HTMLElement) {
                //   element = event;
                // }

                var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

                element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () {
                    return false;
                };

                document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
                    return false;
                };

                isFullscreen ? (function(){
                    dp.event.trigger('dp.screen.full.inactive');
                    document.cancelFullScreen();
                })() : (function(){
                    dp.event.trigger('dp.screen.full.active');
                    element.requestFullScreen();
                })();

                return this;
            },

            /**
             * Make icon
             * @param isFull
             */
            makeIconForLargeScreen: function (isLg) {
                if (isLg === undefined) {
                    isLg = this.isLarge;
                }

                if (isLg) {
                    btnLarge.html(icons.smallScreen);
                } else {
                    btnLarge.html(icons.largeScreen);
                }

                return this;
            },

            /**
             * Toggle
             * @param event
             */
            toggleLargeScreen: function () {
                if (this.isLarge) {
                    this.isLarge = false;
                    dp.event.trigger('dp.screen.large.inactive');
                    this.defaultScreen();
                } else {
                    this.isLarge = true;
                    dp.event.trigger('dp.screen.large.active');
                    this.rateScreenSize();
                }

                return this;
            }
        };

        // Event when click on button fullscreen
        // Then call to check full or cancel
        btnFull.on('click', function (event) {
            helper.toggleFullScreen();
        });

        // Event when click on button large
        // Then call to check large or cancel
        btnLarge.on('click', function (event) {
            helper.toggleLargeScreen();
            helper.makeIconForLargeScreen();
        });

        // Event when change screen
        // Then get status and change icon
        $(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange", function () {
            helper.makeIconForFullScreen();
        });

        // Event when window resize
        $(window).resize(function () {
            helper.rateScreenSize();
        });

        helper.defaultScreen();
        helper.makeIconForFullScreen(false);

        if (largeScreen) {
            helper.toggleLargeScreen();
        }

        helper.makeIconForLargeScreen();

        return this;
    }

    /**
     * Progress
     * @return {DilationPlayer}
     */
    progress() {
        let dp = this;
        let runner = this.config.runner(true);
        let runnerDom = runner.get(0);
        let progressBar = this.config.get('elements.progress', true);
        let playing = this.config.get('elements.progressPlaying', true);
        let timer = this.config.get('elements.controlTimer', true);
        let progressTimerTooltipText = this.config.get('elements.progressHoverTooltipText', true);
        let progressTimerTooltipImage = this.config.get('elements.progressToverTooltipImage', true);
        let tooltipCanvas = progressTimerTooltipImage.find('canvas').get(0);
        tooltipCanvas.width = 90;
        tooltipCanvas.height = 70;

        // Create preview elements
        let runnerPreview = document.createElement('video');

        runner.find('source').each(function (num, val) {
            var source = document.createElement('source');
            $(source).prop('src', $(this).attr('src'));
            runnerPreview.append(source);
        });

        runnerPreview.load();
        // runnerPreview.pause();

        /**
         * Helper object
         * @type {{pad: (function(*, *, *=): *), setLoaded: setLoaded, setTimer: setTimer, display: display}}
         */
        let helper = {
            /**
             * Set loaded data
             * @param current
             * @param duration
             */
            setLoaded: function (current, duration) {
                playing.width((current / duration * 100) + '%');
            },

            /**
             * Set timer
             * @param current
             * @param duration
             */
            setTimer: function (current, duration) {
                current = dp.helper.parseTime(current);
                duration = dp.helper.parseTime(duration);
                timer.html(current + ' / ' + duration);
            },

            /**
             * Display
             */
            display: function () {
                if (!isNaN(runnerDom.duration)) {
                    let current = runnerDom.currentTime;
                    let duration = runnerDom.duration;

                    helper.setLoaded(current, duration);
                    helper.setTimer(current, duration);
                }
            }
        };

        // Event when timeupdate
        runner.on('timeupdate ', function (e) {
            helper.display();
            dp.modal.toggle({loader: false});
        });

        // Event when click on progress bar
        // Then get position of mouse and count the time go to
        progressBar.on("click", function (e) {
            if (!isNaN(runnerDom.duration)) {
                let offset = $(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let vidTime = runnerDom.duration * percentage;
                runnerDom.currentTime = vidTime;
                helper.setLoaded(left, totalWidth);
                dp.modal.toggle({loader: true});
            }
        });

        // Event when hover on progress
        // Then get position of mouse, count the time go to and get information
        progressBar.on("mousemove", function (e) {
            if (!isNaN(runnerDom.duration)) {
                progressTimerTooltipText.show();
                progressTimerTooltipImage.show();

                let offset = $(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let current = runnerDom.duration * percentage;

                let parseTime = dp.helper.parseTime(current);
                progressTimerTooltipText.css('left', left + 'px').text(parseTime);
                progressTimerTooltipImage.css('left', left + 'px');

                // Get picture
                //runnerPreview.currentTime = current;
                //tooltipCanvas.getContext('2d').drawImage(runnerPreview, 0, 0, tooltipCanvas.width, tooltipCanvas.height);
            } else {
                progressTimerTooltipText.hide();
                progressTimerTooltipImage.hide();
            }
        });

        // Event when loaded data
        // Then call display information on screen
        runner.on('loadeddata', function (e) {
            helper.display();
            dp.modal.toggle({loader: false});
        });

        // Event when start load data
        runner.on('loadstart', function (e) {
            dp.modal.toggle({loader: true});
        });

        return this;
    }

    /**
     * Sound
     * @return {DilationPlayer}
     */
    sound() {
        // Defined elements
        let runner = this.config.runner(true);
        let runnerDom = runner.get(0);
        let volume = this.config.get('elements.controlVolume', true);
        let volumeRange = this.config.get('elements.controlVolumeRange', true);
        let range = this.config.get('volume');
        let icons = this.config.get('icons');

        /**
         * Helper
         * @type {{makeIcon: makeIcon, setVolume: setVolume, toggleMute: toggleMute}}
         */
        let helper = {
            /**
             * Make icon for button
             */
            makeIcon: function () {
                if (runnerDom.muted == true || runnerDom.volume == 0) {
                    volume.html(icons.volumeMute);
                } else if (runnerDom.volume <= 0.5) {
                    volume.html(icons.volume1);
                } else {
                    volume.html(icons.volume2);
                }
            },

            /**
             * Set volume for runner
             * @param number
             */
            setVolume: function (number) {
                runnerDom.volume = number / 100;

                if (runnerDom.volume > 0) {
                    runnerDom.muted = false;
                }
            },

            /**
             * Toggle mute runner
             */
            toggleMute: function () {
                if (runnerDom.muted == true) {
                    runnerDom.muted = false;
                } else if (runnerDom.volume > 0) {
                    runnerDom.muted = true;
                }
            }
        };


        // Event click on button
        volume.on('click', function () {
            helper.toggleMute();
        });

        // Event when change input of range
        // Then call change volume and icon
        volumeRange.on('change', function () {
            let range = $(this).val();
            helper.setVolume(range);
        });

        // Event when volume change
        runner.on('volumechange', function () {
            helper.makeIcon();
        });

        // Set volume default
        helper.setVolume(range);
        volumeRange.val(range);
        helper.makeIcon();

        return this;
    }

    /**
     * Logo
     * return {DilationPlayer}
     */
    contextLogo() {
        this.logo.init();
        return this;
    }

    /**
     * Toggle control
     * @return {DilationPlayer}
     */
    contextControl() {
        this.control.init();
        return this;
    }

    /**
     * Context modal
     * @return {DilationPlayer}
     */
    contextModal() {
        this.modal.init();

        return this;
    }

    /**
     * Menu
     * @return {DilationPlayer}
     */
    contextMenu() {
        this.menu.init();
        return this;
    }

    /**
     * Alarm
     * @return {DilationPlayer}
     */
    contextSchedule() {
        this.schedule.init();
        return this;
    }

    /**
     * Plugin
     * @return {DilationPlayer}
     */
    contextPlugin() {
        this.plugin.init();
        return this;
    }

    /**
     * Event
     * @return {DilationPlayer}
     */
    contextEvent() {
        this.event.init();
        return this;
    }
}