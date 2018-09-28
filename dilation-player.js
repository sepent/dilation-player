let __dp = {
    pad: function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },

    parseTime: function (times) {
        if (times < 0) {
            times = 0;
        }

        let hours = Math.floor(times / 3600);
        let minutes = Math.floor((times - hours * 3600) / 60);
        let seconds = Math.floor(times - (minutes * 60 + hours * 3600));
        let format = (hours > 0 ? (this.pad(hours, 2) + ':') : '') + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);

        return format;
    },

    node: function (element) {
        return new DPNode(element);
    },

    ready: function (call) {
        this.node(window).listen('load', call);
    }
};
__dp.defaultConfig = {
    elements: {
        object: null,
        container: '.dp',
        video: '.dp-video',
        audio: '.dp-audio',
        logo: '.dp-logo',
        progress: '.dp-progress',
        progressLoading: '.dp-progress .dp-loading',
        progressPlaying: '.dp-progress .dp-playing',
        progressHoverTooltipText: '.dp-progress-tooltip-text',
        progressHoverTooltipImage: '.dp-progress-tooltip-image',
        control: '.dp-control',
        button: '.dp-button',
        controlPlayPause: '.dp-btn-play',
        controlFullScreen: '.dp-btn-fullscreen',
        controlLargeScreen: '.dp-btn-largescreen',
        controlVolume: '.dp-btn-volume',
        controlVolumeTooltip: '.dp-volume-tooltip',
        controlVolumeRange: '.dp-volume-range',
        controlTimer: '.dp-timer',
        modal: '.dp-modal',
        loaderModal: '.dp-modal-loader',
        loaderModalIcon: '.dp-modal-loader-icon',
        playerModal: '.dp-modal-player',
        playerModalIcon: '.dp-modal-player-icon',
        menu: '.dp-menu',
        menuList: '.dp-menu-list',
        menuItem: '.dp-menu-item',
        menuItemLoop: '.dp-menu-item-loop',
        menuItemCopyUrl: '.dp-menu-item-copy-url',
        ads: '.dp-ads',
        adsItem: '.dp-ads .dp-ads-item',
        adsContent: '.dp-ads .dp-ads-content',
        adsClose: '.dp-ads .dp-ads-close',
    },
    icons: {
        loaderModal: '<i class="fa fa-spin fa-spinner"></i>',
        playerModal: '<i class="icons icon-control-play"></i>',
        fullScreen: '<i class="icons icon-size-fullscreen"></i>',
        actualScreen: '<i class="icons icon-size-actual"></i>',
        largeScreen: '<i class="icons icon-frame"></i>',
        smallScreen: '<i class="icons icon-frame"></i>',
        pause: '<i class="icons icon-control-pause"></i>',
        play: '<i class="icons icon-control-play"></i>',
        volumeMute: '<i class="icons icon-volume-off"></i>',
        volume1: '<i class="icons icon-volume-1"></i>',
        volume2: '<i class="icons icon-volume-2"></i>',
        volume3: '<i class="icons icon-volume-3"></i>',
        close: '[X]'
    },
    volume: 100,
    view: {
        content: null,
        import: null
    },
    sources: {},
    logo: {
        height: '10%',
        rate: 1
    },
    size: {
        width: '100%',
        rate: 2 / 3
    },
    largeScreen: false,
    locale: 'en',
    menu: {},
    poster: null,
    schedules: [],
    type: 'video',
    plugins: {},
    startAt: 0,
    preview: true
};
__dp.translateData = {
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
};

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
// Class {DPNode}
// ====================================================
class DPNode extends DPBase {
    /**
     * Constructor
     * @param selector
     */
    constructor(selector) {
        super();
        this.setSelector(selector);
    }

    /**
     * Convert to array
     * @param selector
     * @return {string|Array|*[]}
     */
    convertToArray(selector) {
        if (selector instanceof NodeList) {
            for (var a = [], l = selector.length; l--; a[l] = selector[l]) ;
            selector = a;
        } else if (typeof selector !== 'string'
            && !(selector instanceof Array)) {
            selector = [selector];
        }

        return selector;
    }

    /**
     * Set selector
     * @param selector
     * @return {DPNode}
     */
    setSelector(selector) {
        this.selectors = this.convertToArray(selector);

        return this;
    }

    /**
     * Get selectors
     * @return {*[]|NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>|*}
     */
    nodes() {
        if (typeof this.selectors === 'string') {
            let nodes = document.querySelectorAll(this.selectors);
            return this.convertToArray(nodes);
        }

        return this.selectors;
    }

    /**
     * Get selector
     * @return {*}
     */
    node() {
        if (typeof this.selectors === 'string') {
            return document.querySelector(this.selectors);
        }

        return this.selectors[0];
    }

    /**
     * Find elements
     * @param selector
     * @return {DPNode}
     */
    find(selector) {
        let children = this.node().querySelectorAll(selector);
        children = this.convertToArray(children);

        return new DPNode(children);
    }

    /**
     * Get parent
     * @return {DPNode}
     */
    parent() {
        return new DPNode(this.node().parentNode);
    }

    /**
     * Get/set height of element
     * @param value
     * @return {*}
     */
    height(value) {
        if (value === undefined) {
            let node = this.node();

            return node.getBoundingClientRect !== undefined ? node.getBoundingClientRect().height : (function () {
                var myHeight = 0;

                if (typeof(window.innerWidth) == 'number') {
                    myHeight = window.innerHeight;
                } else if (document.documentElement && document.documentElement.clientHeight) {
                    myHeight = document.documentElement.clientHeight;
                } else if (document.body && document.body.clientHeight) {
                    myHeight = document.body.clientHeight;
                }

                return myHeight;
            })();
        }

        this.node().style.height = value;

        return this;
    }

    /**
     * Get/set width of element
     * @return {number}
     * @return {*}
     */
    width(value) {
        if (value === undefined) {
            let node = this.node();

            return node.getBoundingClientRect !== undefined ? node.getBoundingClientRect().width : (function () {
                var myWidth = 0;

                if (typeof(window.innerWidth) == 'number') {
                    myWidth = window.innerWidth;
                } else if (document.documentElement && document.documentElement.clientWidth) {
                    myWidth = document.documentElement.clientWidth;
                } else if (document.body && document.body.clientWidth) {
                    myWidth = document.body.clientWidth;
                }

                return myWidth;
            })();
        }

        this.node().style.width = value;

        return this;
    }

    /**
     * Add class to element
     * @param name
     */
    addClass(name) {
        let selectors = this.nodes();

        for (var i = 0; i < selectors.length; ++i) {
            selectors[i].classList.add(name);
        }

        return this;
    }

    /**
     * Remove class
     * @param name
     */
    removeClass(name) {
        let selectors = this.nodes();

        for (var i = 0; i < selectors.length; ++i) {
            if (selectors[i].classList.contains(name)) {
                selectors[i].classList.remove(name);
            }
        }

        return this;
    }

    /**
     * CSS
     * @param key
     * @param value
     * @return {*}
     */
    css(key, value) {
        // Check if is get CSS
        if (typeof key === 'string' && value === undefined) {
            return this.node().style[key];
        }

        let selectors = this.nodes();
        let values = {};

        if (typeof key === 'string') {
            values[key] = value;
        } else {
            values = key;
        }

        for (let i = 0; i < selectors.length; i++) {
            for (let vKey in values) {
                selectors[i].style[vKey] = values[vKey];
            }
        }

        return this;
    }

    /**
     * Get attribute
     * @param key
     * @param value
     * @return {*}
     */
    attr(key, value) {
        // Check if is get value
        if (typeof key === "string" && value === undefined) {
            return this.node().getAttribute(key);
        }

        let selectors = this.nodes();
        let values = [];

        if (typeof key === 'string') {
            let val = {};
            val[key] = value;
            values.push(val);
        } else {
            values = key;
        }

        for (let i = 0; i < selectors.length; i++) {
            for (let vKey in values) {
                selectors[i].setAttribute(vKey, values[vKey]);
            }
        }
    }

    /***
     * Get/set html
     * @param value
     * @return *
     */
    html(value) {
        if (value === undefined) {
            return this.node().innerHTML;
        }

        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            selectors[i].innerHTML = value;
        }

        return this;
    }

    /**
     * Has Class
     * @param name
     * @return {boolean}
     */
    hasClass(name) {
        return this.node().classList.contains(name);
    }

    /**
     * Active status
     * @param status
     * @return {DPNode}
     */
    active(status) {
        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            if (status) {
                selectors[i].classList.add('active');
            } else if (selectors[i].classList.contains('active')) {
                selectors[i].classList.remove('active');
            }
        }

        return this;
    }

    /**
     * Is active
     * @return {boolean}
     */
    isActive() {
        return this.hasClass('active');
    }

    /**
     * Events
     * @param name
     * @param call
     */
    listen(key, call) {
        let keys = key.trim().replace(/\s/gi, ',').split(',');
        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            for (let j = 0; j < keys.length; j++) {
                selectors[i].addEventListener(keys[j], call);
            }
        }

        return this;
    }

    /**
     * Get value
     * @param value
     * @return {DPNode}
     */
    val(value) {
        if (value === undefined) {
            return this.node().value;
        }

        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            selectors[i].value = value;
        }

        return this;
    }

    /**
     * Get offset
     * @return {{}}
     */
    offset() {
        let bound = this.node().getBoundingClientRect();

        return {
            left: bound.left,
            top: bound.top,
            right: bound.right,
            bottom: bound.bottom
        };
    }

    /**
     * Has
     * @param selector
     * @return {boolean}
     */
    has(selector) {
        return this.node().contains(selector);
    }

    /**
     * is
     * @param selector
     */
    is(selector) {
        return this.node().isSameNode(selector);
    }

    /**
     * Closest
     * @param selector
     * @return {*|HTMLElementTagNameMap[keyof HTMLElementTagNameMap]|Element|SVGElementTagNameMap[keyof SVGElementTagNameMap]}
     */
    closest(selector) {
        return new DPNode(this.node().closest(selector));
    }

    /**
     * Append child
     * @param node
     * @return {DPNode}
     */
    append(node) {
        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            selectors[i].appendChild(node);
        }

        return this;
    }

    /**
     * Text
     * @param value
     * @return {*}
     */
    text(value) {
        if (value === undefined) {
            return this.node().textContent;
        }

        let selectors = this.nodes();

        for (let i = 0; i < selectors.length; i++) {
            selectors[i].textContent = value;
        }

        return this;
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
            volume: this.or(config.volume, __dp.defaultConfig.volume),
            view: this.mergeView(config),
            sources: this.or(config.sources, __dp.defaultConfig.sources),
            logo: this.mergeLogo(config),
            size: this.mergeSize(config),
            largeScreen: this.or(config.largeScreen, __dp.defaultConfig.largeScreen),
            locale: this.or(config.locale, __dp.defaultConfig.locale),
            menu: this.mergeMenu(config),
            poster: this.or(config.poster, __dp.defaultConfig.poster),
            schedules: this.mergeSchedules(config),
            type: this.or(config.type, __dp.defaultConfig.type), // audio or video
            plugins: this.mergePlugins(config),
            startAt: this.or(config.startAt, __dp.defaultConfig.startAt),
            preview: this.or(config.preview, __dp.defaultConfig.preview)
        };

        // Function

        // Init cache
        this.cache = {
            node: {},
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

        let rs = this.or(config.menu, __dp.defaultConfig.menu);

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
            object: this.or(config.elements.object, __dp.defaultConfig.elements.object),
            container: this.or(config.elements.container, __dp.defaultConfig.elements.container),
            video: this.or(config.elements.video, __dp.defaultConfig.elements.video),
            audio: this.or(config.elements.audio, __dp.defaultConfig.elements.audio),
            logo: this.or(config.elements.logo, __dp.defaultConfig.elements.logo),
            progress: this.or(config.elements.progress, __dp.defaultConfig.elements.progress),
            progressLoading: this.or(config.elements.progressLoading, __dp.defaultConfig.elements.progressLoading),
            progressPlaying: this.or(config.elements.progressPlaying, __dp.defaultConfig.elements.progressPlaying),
            progressHoverTooltipText: this.or(config.elements.progressHoverTooltipText, __dp.defaultConfig.elements.progressHoverTooltipText),
            progressHoverTooltipImage: this.or(config.elements.progressHoverTooltipImage, __dp.defaultConfig.elements.progressHoverTooltipImage),
            control: this.or(config.elements.control, __dp.defaultConfig.elements.control),
            button: this.or(config.elements.button, __dp.defaultConfig.elements.button),
            controlPlayPause: this.or(config.elements.controlPlayPause, __dp.defaultConfig.elements.controlPlayPause),
            controlFullScreen: this.or(config.elements.controlFullScreen, __dp.defaultConfig.elements.controlFullScreen),
            controlLargeScreen: this.or(config.elements.controlLargeScreen, __dp.defaultConfig.elements.controlLargeScreen),
            controlVolume: this.or(config.elements.controlVolume, __dp.defaultConfig.elements.controlVolume),
            controlVolumeTooltip: this.or(config.elements.controlVolumeTooltip, __dp.defaultConfig.elements.controlVolumeTooltip),
            controlVolumeRange: this.or(config.elements.controlVolumeRange, __dp.defaultConfig.elements.controlVolumeRange),
            controlTimer: this.or(config.elements.controlTimer, __dp.defaultConfig.elements.controlTimer),
            modal: this.or(config.elements.modal, __dp.defaultConfig.elements.modal),
            loaderModal: this.or(config.elements.loaderModal, __dp.defaultConfig.elements.loaderModal),
            loaderModalIcon: this.or(config.elements.loaderModalIcon, __dp.defaultConfig.elements.loaderModalIcon),
            playerModal: this.or(config.elements.playerModal, __dp.defaultConfig.elements.playerModal),
            playerModalIcon: this.or(config.elements.playerModalIcon, __dp.defaultConfig.elements.playerModalIcon),
            menu: this.or(config.elements.menu, __dp.defaultConfig.elements.menu),
            menuList: this.or(config.elements.menuList, __dp.defaultConfig.elements.menuList),
            menuItem: this.or(config.elements.menuItem, __dp.defaultConfig.elements.menuItem),
            menuItemLoop: this.or(config.elements.menuItemLoop, __dp.defaultConfig.elements.menuItemLoop),
            menuItemCopyUrl: this.or(config.elements.menuItemCopyUrl, __dp.defaultConfig.elements.menuItemCopyUrl),
            ads: this.or(config.elements.ads, __dp.defaultConfig.elements.ads),
            adsItem: this.or(config.elements.adsItem, __dp.defaultConfig.elements.adsItem),
            adsContent: this.or(config.elements.adsContent, __dp.defaultConfig.elements.adsContent),
            adsClose: this.or(config.elements.adsClose, __dp.defaultConfig.elements.adsClose),
        };
    }

    /**
     * Merge Icons
     * @return {object}
     */
    mergeIcons(config) {
        config.icons = this.or(config.icons, {});

        return {
            loaderModal: this.or(config.icons.loaderModal, __dp.defaultConfig.icons.loaderModal),
            playerModal: this.or(config.icons.loaderModal, __dp.defaultConfig.icons.playerModal),
            fullScreen: this.or(config.icons.fullScreen, __dp.defaultConfig.icons.fullScreen),
            actualScreen: this.or(config.icons.actualScreen, __dp.defaultConfig.icons.actualScreen),
            largeScreen: this.or(config.icons.largeScreen, __dp.defaultConfig.icons.largeScreen),
            smallScreen: this.or(config.icons.smallScreen, __dp.defaultConfig.icons.smallScreen),
            pause: this.or(config.icons.pause, __dp.defaultConfig.icons.pause),
            play: this.or(config.icons.play, __dp.defaultConfig.icons.play),
            volumeMute: this.or(config.icons.volumeMute, __dp.defaultConfig.icons.volumeMute),
            volume1: this.or(config.icons.volume1, __dp.defaultConfig.icons.volume1),
            volume2: this.or(config.icons.volume2, __dp.defaultConfig.icons.volume2),
            volume3: this.or(config.icons.volume3, __dp.defaultConfig.icons.volume3),
            close: this.or(config.icons.close, __dp.defaultConfig.icons.close)
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
                rs.rate = this.or(config.logo.rate, __dp.defaultConfig.logo.rate);
            }
        } else if (config.logo.width !== undefined) {
            rs.width = config.logo.width;

            if (config.logo.height !== undefined) {
                rs.height = config.logo.height;
            } else {
                rs.rate = this.or(config.logo.rate, __dp.defaultConfig.logo.rate);
            }
        } else {
            rs.height = __dp.defaultConfig.logo.height;
            rs.rate = __dp.defaultConfig.logo.rate;
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
                rs.rate = this.or(config.size.rate, __dp.defaultConfig.size.rate);
            }
        } else if (config.size.width !== undefined) {
            rs.width = config.size.width;

            if (config.size.height !== undefined) {
                rs.height = config.size.height;
            } else {
                rs.rate = this.or(config.size.rate, __dp.defaultConfig.size.rate);
            }
        } else {
            rs.width = __dp.defaultConfig.size.width;
            rs.rate = __dp.defaultConfig.size.rate;
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
            content: this.or(config.view.content, __dp.defaultConfig.view.content),
            import: this.or(config.view.import, __dp.defaultConfig.view.import)
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

        let rs = this.or(config.schedules, __dp.defaultConfig.schedules);

        return rs;
    }

    /**
     * Merge plugins
     * @param config
     * @return {object}
     */
    mergePlugins(config) {
        return this.or(config.plugins, __dp.defaultConfig.plugins);
    }

    /**
     * Access array
     * @param key
     * @return {*}
     */
    access(key) {
        let config = this.config;
        let keys = key.split('.');

        for (let i in keys) {
            if (config[keys[i]] === undefined) {
                config = undefined;
                break;
            }

            config = config[keys[i]];
        }

        return config;
    }

    /**
     * Get config
     * @param key
     * @return mixed
     */
    get(key, cache) {
        cache = cache !== undefined ? cache : true;

        // Get config cache
        if (!(this.cache.config[key] !== undefined && cache)) {
            this.cache.config[key] = this.access(key);
        }

        return this.cache.config[key];
    }

    /**
     * Get node
     * @param key
     * @param cache
     * @return {*|undefined}
     */
    el(key, cache){
        cache = cache !== undefined ? cache : true;
        let config = this.get(key, cache);

        // Check if is object elements
        if (key === 'elements.object' && (this.cache.node[key] === undefined || !cache)) {
            this.cache.node[key] = new DPNode(config);
        }
        // Check get dom is true and dom is created
        // Then return dom in cache
        else if (typeof config === 'string') {
            if (this.cache.node[key] === undefined || !cache) {
                this.cache.node[key] = this.cache.node['elements.object'].find(config);
            }
        }

        return this.cache.node[key];
    }

    /**
     * Get runner
     * @param isDom
     * @return {mixed}
     */
    runner(isDom, cache) {
        let type = this.get('type');

        if (isDom) {
            return this.el('elements.' + type, cache);
        }

        return this.get('elements.' + type, cache);
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
            .modalEvents()
            .sourceEvents();
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
     * sourceEvents
     * @return {DPEvent}
     */
    sourceEvents() {
        let instance = this;

        this.events['dp.source.play'] = function (parameters) {
            return instance.createEvent('dp.source.play', parameters);
        };

        this.events['dp.source.pause'] = function (parameters) {
            return instance.createEvent('dp.source.pause', parameters);
        };

        this.events['dp.source.ended'] = function (parameters) {
            return instance.createEvent('dp.source.ended', parameters);
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
        let events = null;

        if (this.events[name] !== undefined) {
            events = this.events[name](this.or(parameters, {}));
        } else {
            events = this.createEvent(name, this.or(parameters, {}));
        }

        let ob = this.app.config.el('elements.object');
        let dom = ob.node();

        if (events instanceof Array) {
            events.forEach(function (item, index) {
                dom.dispatchEvent(item);
            });
        } else {
            dom.dispatchEvent(events);
        }

        return this;
    }

    /**
     * Trigger event
     * @param name
     * @param parameters
     */
    listen(name, call) {
        let ob = this.app.config.el('elements.object');
        let dom = ob.node();

        dom.addEventListener(name, call);

        return this;
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
        let elObject = this.app.config.el('elements.object');
        let viewConfig = this.app.config.get('view');
        let posterUrl = this.app.config.get('poster');
        let sizeConfig = this.app.config.get('size');

        this.app.event.trigger('dp.view.rendering');

        // Render size
        elObject.css({maxWidth: '100%'});

        if (sizeConfig.height !== undefined) {
            elObject.css({height: sizeConfig.height});

            if (sizeConfig.width !== undefined) {
                elObject.css({width: sizeConfig.width});
            } else {
                elObject.css({width: (elObject.height() / sizeConfig.rate) + 'px'});
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
                let response = await this.loadTemplate();
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
            runner.node().poster = posterUrl;
        }

        this.app.event.trigger('dp.view.rendered');

        return true;
    }

    /**
     * Load template
     * @return {Promise<any>}
     */
    async loadTemplate() {
        let viewConfig = this.app.config.get('view');

        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', viewConfig.import);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
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
        this.app = app;

        // Get local config
        let locale = this.app.config.get('locale');
        this.languages = this.or(__dp.translateData[locale], {});
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
        var messages = this.languages;
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

        let menuList = this.app.config.get('menu');
        let elMenuList = this.app.config.el('elements.menuList');

        if (menuList === false) {
            this.status = false;
            return this;
        }

        let menuItemClass = this.app.config.get('elements.menuItem').replace('.', '');

        for (var name in menuList) {
            let div = document.createElement('div');
            div.classList.add(menuItemClass);
            div.setAttribute('dp-menu:name', name);
            div.innerHTML = this.app.translate.get(menuList[name].text);
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

        let elMenu = this.app.config.el('elements.menu');
        let elMenuList = this.app.config.el('elements.menuList');

        elMenu.active(true);

        let height = elMenuList.height();
        let width = elMenuList.width();

        let cHeight = window.innerHeight;
        let cWidth = window.innerWidth;

        let left = event.clientX;
        let top = event.clientY;

        if ((cHeight - top) < height) {
            top = cHeight - height;
        }

        if ((cWidth - left) < width) {
            left = cWidth - width;
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
        let elMenu = this.app.config.el('elements.menu');

        if (!this.status) {
            return this;
        }

        elMenu.active(false);

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
        let elMenuList = this.app.config.el('elements.menuList');
        let elMenuItem = this.app.config.el('elements.menuItem');
        let elContainer = this.app.config.el('elements.container');

        // Event when open context menu
        elContainer.listen('contextmenu', function (e) {
            if (instance.status) {
                instance.openMenu(e);
            }

            e.preventDefault();
        });

        // Event when click out menu
        __dp.node(window).listen('click', function (event) {
            if (!elMenuList.has(event.target)
                && !elMenuList.is(event.target)) {
                instance.closeMenu();
            }
        });

        // Event when click menu item
        elMenuItem.listen('click', function () {
            let name = __dp.node(this).attr('dp-menu:name');
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
        let runner = elRunner.node();

        if (runner.loop) {
            runner.loop = false;
            __dp.node(item).active(false);
        } else {
            runner.loop = true;
            __dp.node(item).active(true);
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
        let runner = elRunner.node();

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

        let elLogo = this.app.config.el('elements.logo');
        let logoConfig = this.app.config.get('logo');

        if (logoConfig.height !== undefined) {
            elLogo.css({height: logoConfig.height});

            if (logoConfig.width !== undefined) {
                elLogo.css({width: logoConfig.width});
            } else {
                elLogo.css({width: (elLogo.height() / logoConfig.rate) + 'px'});
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

        let elLogo = this.app.config.el('elements.logo');
        let logoConfig = this.app.config.get('logo');
        let instance = this;

        // Check if logo is hidden
        if (logoConfig === false) {
            this.status = false;
            elLogo.active(false);
            return this;
        }

        elLogo.active(true);
        elLogo.css({backgroundImage: 'url(\'' + logoConfig.url + '\')'});

        // Event when screen change
        this.app.event.listen('dp.screen.change', function () {
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
        let instance = this;
        let icons = this.app.config.get('icons');
        let elLoaderIcon = this.app.config.el('elements.loaderModalIcon');
        let elPlayerIcon = this.app.config.el('elements.playerModalIcon');
        let runner = this.app.config.runner(true);

        // default
        elPlayerIcon.html(icons.playerModal);
        elLoaderIcon.html(icons.loaderModal);

        this.toggle({loader: false, player: false});

        // Event when start load data
        runner.listen('loadstart', function (e) {
            instance.toggle({loader: true, player: false});
        });

        // Event when runner play
        runner.listen('play', function () {
            instance.toggle({loader: isNaN(runner.node().duration), player: false});
        });

        // Event when runner pause or ended
        runner.listen('pause ended', function () {
            instance.toggle({loader: isNaN(runner.node().duration), player: true});
        });

        // Event when timeupdate
        runner.listen('timeupdate ', function (e) {
            instance.toggle({loader: false, player: runner.node().paused});
        });

        // Event when loaded data
        // Then call display information on screen
        runner.listen('loadeddata', function (e) {
            instance.toggle({loader: false, player: runner.node().paused});
        });

        // Event when loading
        runner.listen('waiting', function () {
            instance.toggle({loader: true, player: false});
        });

        runner.listen('seeking', function () {
            instance.toggle({loader: true, player: false});
        });

        runner.listen('seeked', function () {
            instance.toggle({loader: false, player: runner.node().paused});
        });

        return this;
    }

    /**
     * Show
     * @param config
     */
    toggle(config) {
        let elLoaderModal = this.app.config.el('elements.loaderModal');
        let elPlayerModal = this.app.config.el('elements.playerModal');
        let elModal = this.app.config.el('elements.modal');
        let isLoaderActive = elLoaderModal.isActive();
        let isPlayerActive = elPlayerModal.isActive();

        elModal.active(false);
        elLoaderModal.active(config.loader === true);
        elPlayerModal.active(config.player === true);

        // Check event
        if (elLoaderModal.isActive() !== isLoaderActive) {
            !isLoaderActive ? this.app.event.trigger('dp.modal.loader.show') : this.app.event.trigger('dp.modal.loader.hide');
        }

        if (elPlayerModal.isActive() !== isPlayerActive) {
            !isPlayerActive ? this.app.event.trigger('dp.modal.player.show') : this.app.event.trigger('dp.modal.player.hide');
        }

        return this;
    }
}

// ====================================================
// Class {DPControl}
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
        let runnerDom = elRunner.node();

        // Event when hover on runner/container/control
        __dp.node(this.app.config.get('elements.container')
            + ',' + this.app.config.get('elements.control')
            + ',' + this.app.config.runner()).listen('mousemove', function () {
            instance.openControl();
            instance.isMouseIn = true;
        });

        __dp.node(window).listen('scroll', function () {
            instance.openControl();
        });

        // Event when out on runner/container/control
        __dp.node(this.app.config.get('elements.container')
            + ',' + this.app.config.get('elements.control')
            + ',' + this.app.config.runner()).listen('mouseleave', function () {
            instance.closeControl();
            instance.isMouseIn = false;
        });

        // Event when runner pause or ended
        elRunner.listen('pause ended', function () {
            instance.openControl();
        });

        // Event when runner pause or ended
        elRunner.listen('play', function () {
            if (!instance.isMouseIn) {
                instance.closeControl();
            }
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
        let elControl = this.app.config.el('elements.control');
        let elContainer = this.app.config.el('elements.container');

        let runner = elRunner.node();

        if (!runner.paused) {
            elControl.active(false);
            this.app.event.trigger('dp.control.hide');

            if (this.isMouseIn) {
                elContainer.node().style.cursor = "none";
                //elContainer.addClass('hidden-cursor');
            } else {
                elContainer.node().style.cursor = "default";
                //elContainer.removeClass('hidden-cursor');
            }
        }
    }

    /**
     * open
     */
    openControl() {
        let instance = this;

        let elControl = this.app.config.el('elements.control');
        let elContainer = this.app.config.el('elements.container');

        window.clearTimeout(this.controlTime);
        elControl.active(true);
        elContainer.node().style.cursor = "default";
        // elContainer.removeClass('hidden-cursor');
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
        let sizeConfig = this.app.config.get('size');
        let elObject = this.app.config.el('elements.object');

        if (sizeConfig.height !== undefined) {
            elObject.css({height: sizeConfig.height});

            if (sizeConfig.width !== undefined) {
                elObject.css({width: sizeConfig.width});
            } else {
                elObject.css({width: (elObject.height() / sizeConfig.rate) + 'px'});
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
        let elObject = this.app.config.el('elements.object');
        let runnerSize = 0;
        let h = 0;

        if (this.isLarge) {
            runnerSize = elObject.parent().width();
            elObject.css({width: runnerSize + 'px'})

            h = (runnerSize * this.defaultSize.height / this.defaultSize.width);
            let windowH = __dp.node(window).height() * 85 / 100;

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
        let icons = this.app.config.get('icons');
        let elBtnFullScreen = this.app.config.el('elements.controlFullScreen');

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
        let elContainer = this.app.config.el('elements.container');
        let isFullScreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        let container = elContainer.node();
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
        let icons = this.app.config.get('icons');
        let elBtnLargeScreen = this.app.config.el('elements.controlLargeScreen');

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

        let elBtnFullScreen = this.app.config.el('elements.controlFullScreen');
        let elBtnLargeScreen = this.app.config.el('elements.controlLargeScreen');
        let largeScreen = this.app.config.get('largeScreen');
        let instance = this;

        // Event when click on button fullscreen
        // Then call to check full or cancel
        elBtnFullScreen.listen('click', function (event) {
            instance.toggleFullScreen();
        });

        // Event when click on button large
        // Then call to check large or cancel
        elBtnLargeScreen.listen('click', function (event) {
            instance.toggleLargeScreen();
            instance.makeIconForLargeScreen();
        });

        // Event when change screen
        // Then get status and change icon
        __dp.node(document).listen("fullscreenchange webkitfullscreenchange mozfullscreenchange", function () {
            instance.makeIconForFullScreen();
        });

        // Event when window resize
        __dp.node(window).listen('resize', function () {
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
        let instance = this;
        let runner = this.app.config.runner(true);
        let runnerDom = runner.node();

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
        runner.listen('timeupdate ', function (e) {
            let current = runnerDom.currentTime;
            let time = __dp.parseTime(current);

            if (this.lastTime === time) {
                return;
            }

            this.lastTime = time;

            let list = instance.or(instance.schedules[time], []);

            for (let i in list) {
                instance.execute(list[i].name);

                if (list[i].loop !== true) {
                    delete instance.schedules[time][i];
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
// Class {DPPlugin}
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
// Class {DPSource}
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
                runner.node().src = sources;
            } else if (sources.length == 1) {
                runner.node().src = sources[0].src;
            } else {
                for (var i in sources) {
                    let source = document.createElement('source');
                    __dp.node(source).attr({src: sources[i].src, type: sources[i].type});
                    runner.append(source);
                }
            }

            runner.node().load();
        }

        return this;
    }

    /**
     * Play
     * @return {DPSource}
     */
    play() {
        if (this.app.rendered) {
            let runner = this.app.config.runner(true).node();
            runner.play();
        }

        return this;
    }

    /**
     * Pause
     * @return {DPSource}
     */
    pause() {
        if (this.app.rendered) {
            let runner = this.app.config.runner(true).node();
            runner.pause();
        }

        return this;
    }

    /**
     * Start At
     * @param time
     * @return {DPSource}
     */
    to(time) {
        let runner = this.app.config.runner(true).node();

        if (isNaN(time)) {
            time = time.split(':');

            if (time.length === 3) {
                time = time[2] * 1 + time[1] * 60 + time[0] * 3600;
            } else if (time.length === 2) {
                time = time[1] * 1 + time[0] * 60;
            } else {
                time = time[0] * 1;
            }
        }

        runner.currentTime = time;

        return this;
    }

    /**
     * Init
     * @return {DPSource}
     */
    init() {
        // Get list of source
        let sources = this.app.config.get('sources');
        let runner = this.app.config.runner(true);
        let event = this.app.event;
        let startAt = this.app.config.get('startAt');

        this.load(sources);

        // Event when video play
        // Event when runner play
        runner.listen('play', function () {
            event.trigger('dp.source.play');
        });

        // Event when runner pause or ended
        runner.listen('pause', function () {
            event.trigger('dp.source.pause');
        });

        // Event when runner pause or ended
        runner.listen('ended', function () {
            event.trigger('dp.source.ended');
        });

        // Start
        this.to(startAt);

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
        let player = this.config.el('elements.playerModal');
        let btn = this.config.el('elements.controlPlayPause');
        let icons = this.config.get('icons');
        let runnerDom = runner.node();
        let instance = this;

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
            }
        };

        // Event when loader show/hide
        this.event.listen('dp.modal.loader.show', function(){
            btn.html(icons.play);
        });

        this.event.listen('dp.modal.loader.hide', function(){
            helper.makeIcon();
        });

        // Event when click on button play/pause
        btn.listen('click', function () {
            helper.toggle();
        });

        player.listen('click', function () {
            helper.toggle();
        });

        // Event when click on runner
        runner.listen('click', function () {
            helper.toggle();
        });

        // Event when runner play
        runner.listen('play', function () {
            helper.makeIcon();
        });

        // Event when runner pause or ended
        runner.listen('pause ended', function () {
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
        let instance = this;
        let runner = this.config.runner(true);
        let runnerDom = runner.node();
        let progressBar = this.config.el('elements.progress');
        let playing = this.config.el('elements.progressPlaying');
        let timer = this.config.el('elements.controlTimer');
        let progressTimerTooltipText = this.config.el('elements.progressHoverTooltipText');
        let progressTimerTooltipImage = this.config.el('elements.progressHoverTooltipImage');
        let tooltipCanvas = progressTimerTooltipImage.find('canvas').node();
        tooltipCanvas.width = 90;
        tooltipCanvas.height = 70;

        // Create preview elements
        // let runnerPreview = document.createElement('video');

        // runner.find('source').each(function (num, val) {
        //     var source = document.createElement('source');
        //     source.src = __dp.node(this).attr('src');
        //     runnerPreview.append(source);
        // });

        // runnerPreview.load();

        /**
         * Helper object
         * @type {{pad: (function(*, *, *=): *), setLoaded: setLoaded, setTimer: setTimer, display: display}}
         */
        let helper = {
            isShowImage: this.config.get('preview'),

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
                current = __dp.parseTime(current);
                duration = __dp.parseTime(duration);
                timer.html(current + ' / ' + duration);
            },

            showImage: function(left){
                if (this.isShowImage) {
                    let totalWidth = progressBar.width();
                    let width = progressTimerTooltipImage.width() / 2;
                    let iLeft = left;
                    if (left > (totalWidth - width)) {
                        iLeft = totalWidth - width;
                    } else if (left < width) {
                        iLeft = width;
                    }

                    progressTimerTooltipImage.css('left', iLeft + 'px');
                    progressTimerTooltipImage.active(true);
                } else {
                    progressTimerTooltipImage.active(false);
                }
            },

            showTime: function(left, time) {
                progressTimerTooltipText.active(true);
                let totalWidth = progressBar.width();
                let width = progressTimerTooltipText.width() / 2;
                let tLeft = left;

                if (left > (totalWidth - width - 2)) {
                    tLeft = totalWidth - width - 2;
                } else if (left < (width + 2)) {
                    tLeft = width + 2;
                }

                let parseTime = __dp.parseTime(time);
                progressTimerTooltipText.css('left', tLeft + 'px').text(parseTime);
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
        runner.listen('timeupdate ', function (e) {
            helper.display();
        });

        // Event when click on progress bar
        // Then get position of mouse and count the time go to
        progressBar.listen("click", function (e) {
            if (!isNaN(runnerDom.duration)) {
                let offset = __dp.node(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let vidTime = runnerDom.duration * percentage;
                instance.source.to(vidTime);
                helper.setLoaded(left, totalWidth);
            }
        });

        // Event when move on progress
        // Then get position of mouse, count the time go to and get information
        progressBar.listen("mousemove", function (e) {
            if (!isNaN(runnerDom.duration)) {
                let offset = __dp.node(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let current = runnerDom.duration * percentage;

                // Set position for image
                helper.showImage(left, current);
                helper.showTime(left, current);
            } else {
                progressTimerTooltipText.active(false);
                progressTimerTooltipImage.active(false);
            }
        });

        // Event when loaded data
        // Then call display information on screen
        runner.listen('loadeddata', function (e) {
            helper.display();
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
        let runnerDom = runner.node();
        let volume = this.config.el('elements.controlVolume');
        let volumeRange = this.config.el('elements.controlVolumeRange');
        let range = this.config.get('volume');
        let icons = this.config.get('icons');
        // let instance = this;

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
        volume.listen('click', function () {
            helper.toggleMute();
        });

        // Event when change input of range
        // Then call change volume and icon
        volumeRange.listen('change', function () {
            let range = __dp.node(this).val();
            helper.setVolume(range);
        });

        // Event when volume change
        runner.listen('volumechange', function () {
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