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
            dom: {},
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
            object: this.or(config.elements.object, null),
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
    get(key, dom, cache) {
        let config = null;
        cache = cache !== undefined ? cache : true;

        // Get config cache
        if (this.cache.config[key] !== undefined && cache) {
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

        if (dom === true) {
            // Check if is object elements
            if (key === 'elements.object' && (this.cache.dom[key] === undefined || !cache)) {
                this.cache.dom[key] = $(config);

                return this.cache.dom[key];
            }
            // Check get dom is true and dom is created
            // Then return dom in cache
            else if (typeof config === 'string') {
                if (this.cache.dom[key] === undefined || !cache) {
                    this.cache.dom[key] = this.cache.dom['elements.object'].find(config);
                }

                return this.cache.dom[key];
            }
        }

        return config;
    }

    /**
     * Get runner
     * @param isDom
     * @return {mixed}
     */
    runner(isDom, cache) {
        let type = this.get('type');
        return this.get('elements.' + type, isDom, cache);
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
    init() {
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

        this.events['dp.view.rendering'] = function (parameters) {
            return instance.createEvent('dp.view.rendering', parameters);
        };

        this.events['dp.view.rendered'] = function (parameters) {
            return instance.createEvent('dp.view.rendered', parameters);
        };

        return this;
    }

    /**
     * Logo events
     * @return {DPEvent}
     */
    logoEvents() {
        let instance = this;

        this.events['dp.logo.resize'] = function (parameters) {
            return instance.createEvent('dp.logo.resize', parameters);
        };

        return this;
    }

    /**
     * Menu events
     * @return {DPEvent}
     */
    menuEvents() {
        let instance = this;

        this.events['dp.menu.open'] = function (parameters) {
            return instance.createEvent('dp.menu.open', parameters);
        };

        this.events['dp.menu.close'] = function (parameters) {
            return instance.createEvent('dp.menu.close', parameters);
        };

        return this;
    }

    /**
     * Control events
     * @return {DPEvent}
     */
    controlEvents() {
        let instance = this;

        this.events['dp.control.show'] = function (parameters) {
            return instance.createEvent('dp.control.show', parameters);
        };

        this.events['dp.control.hide'] = function (parameters) {
            return instance.createEvent('dp.control.hide', parameters);
        };

        return this;
    }

    /**
     * Logo events
     * @return {DPEvent}
     */
    modalEvents() {
        let instance = this;

        // Event for loader
        this.events['dp.modal.loader.show'] = function (parameters) {
            return instance.createEvent('dp.modal.loader.show', parameters);
        };

        this.events['dp.modal.loader.hide'] = function (parameters) {
            return instance.createEvent('dp.modal.loader.hide', parameters);
        };

        // Event for player
        this.events['dp.modal.player.show'] = function (parameters) {
            return instance.createEvent('dp.modal.player.show', parameters);
        };

        this.events['dp.modal.player.hide'] = function (parameters) {
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
        this.events['dp.screen.large.active'] = function (parameters) {
            return [
                instance.createEvent('dp.screen.large.change', parameters),
                instance.createEvent('dp.screen.large.active', parameters)
            ];
        };

        this.events['dp.screen.large.inactive'] = function (parameters) {
            return [
                instance.createEvent('dp.screen.large.change', parameters),
                instance.createEvent('dp.screen.large.inactive', parameters)
            ];
        };

        // Event for full screen
        this.events['dp.screen.full.active'] = function (parameters) {
            return [
                instance.createEvent('dp.screen.full.change', parameters),
                instance.createEvent('dp.screen.full.active', parameters)
            ];
        };

        this.events['dp.screen.full.inactive'] = function (parameters) {
            return [
                instance.createEvent('dp.screen.full.change', parameters),
                instance.createEvent('dp.screen.full.inactive', parameters)
            ];
        };

        this.events['dp.screen.change'] = function (parameters) {
            return instance.createEvent('dp.screen.change', parameters);
        };

        return this;
    }

    /**
     * Create event
     * @param name
     * @param parameters
     */
    createEvent(name, parameters) {
        return new CustomEvent(name, parameters);
    }

    /**
     * Trigger event
     * @param name
     * @param parameters
     */
    trigger(name, parameters) {
        let events = this.events[name](this.or(parameters, {}));
        let ob = this.app.config.get('elements.object', true);
        let dom = ob.get(0);

        if (events instanceof Array) {
            events.forEach(function (item, index) {
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
        this.app = app;
    }

    /**
     * Init
     * @return {DPView}
     */
    init() {
        return this;
    }

    /**
     * Render view
     * @return {DPView}
     */
    async render() {
        let viewConfig = this.app.config.get('view', false);
        let posterUrl = this.app.config.get('poster', false);
        let elObject = this.app.config.get('elements.object', true);
        let sizeConfig = this.app.config.get('size', false);

        this.app.event.trigger('dp.view.rendering');

        // Render size
        elObject.css({maxWidth: '100%'});

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

        // Read content in template
        if (!viewConfig.content) {
            if (viewConfig.import) {
                elObject.html(this.app.translate.get('app.loading'));

                let response = await $.ajax({
                    url: viewConfig.import,
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
                elObject.html(content);
            }
        } else {
            let content = this.replace(viewConfig.content);
            elObject.html(content);
        }

        // Render the poster for video
        if (this.poster) {
            let runner = this.app.config.runner(true);
            runner.get(0).poster = posterUrl;
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
        this.app = app;
    }

    /**
     * Render menu
     * @param config
     * @return {DPMenu}
     */
    init() {
        this.status = true;

        let menuList = this.app.config.get('menu', false);
        let elMenuList = this.app.config.get('elements.menuList', true);

        if (menuList === false) {
            this.status = false;
            return this;
        }

        let menuItemClass = this.app.config.get('elements.menuItem', false).replace('.', '');

        for (var name in menuList) {
            let div = document.createElement('div');
            $(div).addClass(menuItemClass)
                .attr('dp-menu:name', name)
                .html(this.app.translate.get(menuList[name].text));

            elMenuList.append(div);
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

        let elMenu = this.app.config.get('elements.menu', true);
        let elMenuList = this.app.config.get('elements.menuList', true);

        elMenu.addClass('active');

        let height = elMenuList.height();
        let width = elMenuList.width();

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

        elMenuList.css({left: left + 'px', top: top + 'px'});

        this.app.event.trigger('dp.menu.open');

        return this;
    }

    /**
     * Close menu
     * @param config
     * @return {DPMenu}
     */
    closeMenu() {
        let elMenu = this.app.config.get('elements.menu', true);

        if (!this.status) {
            return this;
        }

        elMenu.removeClass('active');

        this.app.event.trigger('dp.menu.close');

        return this;
    }

    /**
     * Event menu
     * @param config
     * @return {DPMenu}
     */
    events() {
        let instance = this;
        let elMenuList = this.app.config.get('elements.menuList', true);
        let elMenuItem = this.app.config.get('elements.menuItem', true);
        let elContainer = this.app.config.get('elements.container', true);

        // Event when right click or open menu
        elContainer.mousedown(function (event) {
            var isRightMB;
            event = event || window.event;

            if (event.which === 3) {
                elContainer.bind('contextmenu', function () {
                    return false;
                });
            }
            else {
                elContainer.unbind('contextmenu');
            }

            if (!instance.status) {
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
                instance.openMenu(event);
            }
        });

        // Event when click out menu
        $(window).click(function (event) {
            if (elMenuList.has(event.target).length == 0
                && !elMenuList.is(event.target)) {
                instance.closeMenu();
            }
        });

        // Event when click menu item
        elMenuItem.click(function () {
            let name = $(this).attr('dp-menu:name');
            instance.execute(this, name);
        });

        return this;
    }

    /**
     * execute
     * @param name
     * @return {DPMenu}
     */
    execute(item, name) {
        if (!this.status) {
            return this;
        }

        let config = this.app.config.get('menu.' + name);

        if (config.execute !== undefined) {
            config.execute(item, this, config);
        }

        return this;
    }

    /**
     * Exec Loop
     * @return {DPMenu}
     */
    execLoop(item, config) {
        if (!this.status) {
            return this;
        }

        let elRunner = this.app.config.runner(true);
        let runner = elRunner.get(0);

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
     * @return {DPMenu}
     */
    execCopyUrl(item, config) {
        if (!this.status) {
            return this;
        }

        let elRunner = this.app.config.runner(true);
        let runner = elRunner.get(0);

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
        this.app = app;
    }

    /**
     * resizeLogo
     * @return {DPLogo}
     */
    resize() {
        if (!this.status) {
            return this;
        }

        let elLogo = this.app.config.get('elements.logo', true);
        let logoConfig = this.app.config.get('logo', false);

        if (logoConfig.height !== undefined) {
            elLogo.css({height: logoConfig.height});

            if (logoConfig.width !== undefined) {
                elLogo.css({width: logoConfig.width});
            } else {
                elLogo.css({width: (elLogo.height() * logoConfig.rate) + 'px'});
            }
        } else {
            elLogo.css({width: logoConfig.width});

            if (logoConfig.height !== undefined) {
                elLogo.css({height: logoConfig.height});
            } else {
                elLogo.css({height: (elLogo.width() * logoConfig.rate) + 'px'});
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
        this.status = true;

        let elLogo = this.app.config.get('elements.logo', true);
        let logoConfig = this.app.config.get('logo', false);
        let elObject = this.app.config.get('elements.object', true);
        let instance = this;

        // Check if logo is hidden
        if (logoConfig === false) {
            this.status = false;
            elLogo.removeClass('active');
            return this;
        }

        elLogo.addClass('active');
        elLogo.css({backgroundImage: 'url(\'' + logoConfig.url + '\')'});

        // Event when screen change
        elObject.on('dp.screen.change', function () {
            instance.resize();
        });

        // Default
        instance.resize();

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
        this.app = app;
    }

    /**
     * Render
     */
    init() {
        let icons = this.app.config.get('icons', false);
        let elLoaderIcon = this.app.config.get('elements.loaderModalIcon', true);
        let elPlayerIcon = this.app.config.get('elements.playerModalIcon', true);

        // default
        elPlayerIcon.html(icons.playerModal);
        elLoaderIcon.html(icons.loaderModal);

        return this;
    }

    /**
     * Show
     * @param config
     */
    toggle(config) {
        let elLoaderModal = this.app.config.get('elements.loaderModal', true);
        let elPlayerModal = this.app.config.get('elements.playerModal', true);
        let elModal = this.app.config.get('elements.modal', true);
        let elRunner = this.app.config.runner(true);

        let runnerDom = elRunner.get(0);
        let isLoaderActive = elLoaderModal.hasClass('active');
        let isPlayerActive = elPlayerModal.hasClass('active');

        elModal.removeClass('active');

        if (config === undefined) {
            if (!isNaN(runnerDom.duration)) {
                if (runnerDom.paused) {
                    elPlayerModal.addClass('active');
                } else {
                    elPlayerModal.removeClass('active');
                }
            } else {
                elLoaderModal.addClass('active');
            }
        } else {
            if (config.loader === true) {
                elLoaderModal.addClass('active');
            } else if (config.player === true || runnerDom.paused) {
                elPlayerModal.addClass('active');
            }
        }

        // Check event
        if (elLoaderModal.hasClass('active') !== isLoaderActive) {
            !isLoaderActive ? this.app.event.trigger('dp.modal.loader.show') : this.app.event.trigger('dp.modal.loader.hide');
        }

        if (elPlayerModal.hasClass('active') !== isPlayerActive) {
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
        this.app = app;
    }

    /**
     * Render
     */
    init() {
        this.isMouseIn = false;
        this.controlTime = null;

        let elRunner = this.app.config.runner(true);
        let instance = this;
        let runnerDom = elRunner.get(0);
        let elControl = this.app.config.get('elements.control', true);

        // Event when hover on runner/container/control
        $(this.app.config.get('elements.container', false)
            + ',' + this.app.config.get('elements.control', false)
            + ',' + this.app.config.runner()).mousemove(function () {
            instance.openControl();
            instance.isMouseIn = true;
        });

        $(window).scroll(function () {
            instance.openControl();
        });

        // Event when out on runner/container/control
        $(this.app.config.get('elements.container', false)
            + ',' + this.app.config.get('elements.control', false)
            + ',' + this.app.config.runner()).mouseleave(function () {
            instance.closeControl();
            instance.isMouseIn = false;
        });

        // Event when runner pause or ended
        elRunner.on('pause ended', function () {
            elControl.addClass('active');
        });

        // Default
        runnerDom.controls = false;

        return this;
    }

    /**
     * Hidden
     */
    closeControl() {
        let elRunner = this.app.config.runner(true);
        let elControl = this.app.config.get('elements.control', true);
        let elContainer = this.app.config.get('elements.container', true);

        let runner = elRunner.get(0);

        if (!runner.paused) {
            elControl.removeClass('active');
            this.app.event.trigger('dp.control.hide');

            if (this.isMouseIn) {
                elContainer.addClass('hidden-cursor');
            } else {
                elContainer.removeClass('hidden-cursor');
            }
        }
    }

    /**
     * open
     */
    openControl() {
        let instance = this;

        let elControl = this.app.config.get('elements.control', true);
        let elContainer = this.app.config.get('elements.container', true);

        window.clearTimeout(this.controlTime);
        elControl.addClass('active');
        elContainer.removeClass('hidden-cursor');
        this.app.event.trigger('dp.control.show');

        this.controlTime = window.setTimeout(function () {
            instance.closeControl();
        }, 2000);
    }
}

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
        let icons = this.app.config.get('icons', false);
        let elBtnLargeScreen = this.app.config.get('elements.controlLargeScreen', true);

        if (isLg === undefined) {
            isLg = this.isLarge;
        }

        if (isLg) {
            elBtnLargeScreen.html(icons.smallScreen);
        } else {
            elBtnLargeScreen.html(icons.largeScreen);
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

// ====================================================
// Class {DPSchedule}
// ====================================================
class DPSchedule extends DPBase {
    constructor(app) {
        super();
        this.app = app;
    }

    /**
     * Run
     */
    init() {
        // Common variable
        this.helper = this.app.helper;
        this.schedules = {};
        this.alias = {};
        this.lastTime = null;

        let schedules = this.app.config.get('schedules');
        let dp = this;
        let runner = this.app.config.runner(true);
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
        this.app = app;
    }

    /**
     * Init
     * @return {Promise<DPPlugin>}
     */
    async init() {
        let list = this.app.config.get('plugins');

        for (let name in list) {
            this.app[name] = await eval('new ' + list[name].className + '(this.app)');
            this.app[name].init();
        }

        return this;
    }
}

// ====================================================
// Plugin {DPSource}
// ====================================================
class DPSource extends DPBase {
    /**
     * Constructor
     */
    constructor(app) {
        super();
        this.app = app;
    }

    /**
     * Load
     * @param sources
     */
    load(sources) {
        if (this.app.rendered && sources !== undefined) {
            let runner = this.app.config.runner(true);

            runner.html(this.app.translate.get('app.not_support'));

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

        return this;
    }

    /**
     * Init
     * @return {DPSource}
     */
    init() {
        // Get list of source
        let sources = this.app.config.get('sources');
        this.load(sources);

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

        config.elements = this.or(config.elements, {});
        config.elements.object = object;

        this.rendered = false;
        this.config = new DPConfig(config);
        this.event = new DPEvent(this);
        this.contextEvent();

        this.translate = new DPTranslator(this);
        this.helper = new DPHelper(this);
        this.view = new DPView(this);

        this.source = new DPSource(this);
        this.control = new DPControl(this);
        this.screen = new DPScreen(this);
        this.menu = new DPMenu(this);
        this.logo = new DPLogo(this);
        this.modal = new DPModal(this);
        this.plugin = new DPPlugin(this);
        this.schedule = new DPSchedule(this);

        this.apply();
    }

    /**
     * Apply
     */
    async apply() {
        await this.render();

        // Regist events
        this.contextSource()
            .contextModal()
            .contextLogo()
            .contextControl()
            .contextScreen()
            .playPause()
            .progress()
            .sound()
            .contextMenu()
            .contextPlugin()
            .contextSchedule();
    }

    /**
     * Render view
     * @return {Promise<boolean>}
     */
    async render() {
        let rendered = await this.view.init().render();
        this.rendered = rendered;

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

    /**
     * Screen
     * @return {DilationPlayer}
     */
    contextScreen() {
        this.screen.init();
        return this;
    }

    /**
     * Source
     * @return {DilationPlayer}
     */
    contextSource() {
        this.source.init();
        return this;
    }
}