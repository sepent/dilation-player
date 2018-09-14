let DPTranslateData = {
    en: {
        menu: {
            loop: 'Loop this video',
            copy_url: 'Copy video\'s url'
        },

        app: {
            loading: 'Loading...',
            not_support_video: 'This browser not support video'
        }
    },

    vi: {
        menu: {
            loop: 'Lặp video này',
            copy_url: 'Copy đường dẫn video'
        },

        app: {
            loading: 'Đang tải...',
            not_support_video: 'Trình duyệt không hỗ trợ video'
        }
    }
}

// ====================================================
// Class {DPConfig}
// ====================================================
class DPConfig {
    /**
     * Constructor
     * @param config
     */
    constructor(config) {
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
            poster: this.or(config.poster, null)
        }

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
        ;

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
            logo: this.or(config.elements.logo, '.dp-logo'),
            progress: this.or(config.elements.progress, '.dp-progress'),
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
            volume3: this.or(config.icons.volume3, '<i class="icons icon-volume-3"></i>')
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
     * Check if value is undefined then return or
     * @param value
     * @param or
     * @return mixed
     */
    or(value, or) {
        return value === undefined ? or : value;
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
}

// ====================================================
// Class {DPView}
// ====================================================
class DPView {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
    }

    /**
     * Render view
     * @return {DPView}
     */
    async render() {
        let view = this.config.get('view');
        let sources = this.config.get('sources');
        let object = this.config.get('object', true);

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
        let video = this.config.get('elements.video', true);

        if (poster) {
            video.get(0).poster = poster;
        }

        if (sources !== undefined) {
            video.html(this.translate.get('app.not_support_video'));

            // Generate video from resources
            if (typeof sources === 'string') {
                video.get(0).src = sources;
            } else if (sources.length == 1) {
                video.get(0).src = sources[0].src;
            } else {
                for (var i in sources) {
                    let source = document.createElement('source');
                    $(source).attr({src: sources[i].src, type: sources[i].type});
                    video.append(source);
                }
            }

            video.get(0).load();
        }

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
class DPTranslator {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
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
// Class {DPMenu}
// ====================================================
class DPMenu {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
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
    render() {
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

        return this;
    }

    /**
     * Event menu
     * @param config
     * @return {DPMenu}
     */
    events() {
        let instance = this;
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
            if (menuList.has(event.target).length == 0
                && !menuList.is(event.target)) {
                instance.closeMenu();
            }
        });

        // Event when click menu item
        menuItem.click(function () {
            let name = $(this).attr('dp-menu:name');
            instance.execute(this, name);
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

        let video = this.config.get('elements.video', true).get(0);

        if (video.loop) {
            video.loop = false;
            $(item).removeClass('active');
        } else {
            video.loop = true;
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

        let video = this.config.get('elements.video', true).get(0);

        this.closeMenu();

        return this;
    }
}

// ====================================================
// Class {DPLogo}
// ====================================================
class DPLogo {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
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

        return this;
    }

    /**
     * render
     * @return {DPLogo}
     */
    render() {
        let logo = this.config.get('elements.logo', true);
        let logoConfig = this.config.get('logo');
        let instance = this;

        // Check if logo is hidden
        if (logoConfig === false) {
            this.status = false;
            logo.hide();
            return this;
        }

        // Make logo
        logo.css({backgroundImage: 'url(\'' + logoConfig.url + '\')'});

        // Event when resize window
        $(window).resize(function () {
            instance.resize();
        });

        // Default
        instance.resize();

        // Event when click on logo
        // Event when hover on logo

        return this;
    }
}

// ====================================================
// Class {DPModal}
// ====================================================
class DPModal {
    /**
     * Constructor
     * @param config
     */
    constructor(app) {
        this.config = app.config;
        this.translate = app.translate;
        this.app = app;
    }

    /**
     * Render
     */
    render() {
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
        let videoDom = this.config.get('elements.video', true).get(0);
        modal.removeClass('active');

        if (config === undefined) {
            if (!isNaN(videoDom.duration)) {
                if (videoDom.paused) {
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
            } else if (config.player === true || videoDom.paused) {
                player.addClass('active');
            }
        }

        return this;
    }
}

// ====================================================
// Class {DPModal}
// ====================================================
class DBControl {
    constructor(app) {
        this.config = app.config;
        this.app = app;
        this.isMouseIn = false;
        this.controlTime = null;
    }

    /**
     * Render
     */
    render() {
        let instance = this;
        let video = this.config.get('elements.video', true);
        let videoDom = video.get(0);
        let control = this.config.get('elements.control', true);

        // Event when hover on video/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mousemove(function () {
            instance.open();
            instance.isMouseIn = true;
        });

        $(window).scroll(function () {
            instance.open();
        });

        // Event when out on video/container/control
        $(this.config.get('elements.container')
            + ',' + this.config.get('elements.control')
            + ',' + this.config.get('elements.video')).mouseleave(function () {
            instance.hidden();
            instance.isMouseIn = false;
        });

        // Event when video pause or ended
        video.on('pause ended', function () {
            control.addClass('active');
        });

        // Default
        videoDom.controls = false;

        return this;
    }

    /**
     * Hidden
     */
    hidden() {
        let control = this.config.get('elements.control', true);
        let video = this.config.get('elements.video', true).get(0);
        let container = this.config.get('elements.container', true);

        if (!video.paused) {
            control.removeClass('active');

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
    open() {
        let control = this.config.get('elements.control', true);
        let container = this.config.get('elements.container', true);
        let inst = this;

        window.clearTimeout(this.controlTime);
        control.addClass('active');
        container.removeClass('hidden-cursor');

        this.controlTime = window.setTimeout(function () {
            inst.hidden();
        }, 2000);
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
    constructor(object, config) {
        if (config == undefined) {
            config = {};
        }

        config.object = object;
        this.config = new DPConfig(config);
        this.translate = new DPTranslator(this);
        this.view = new DPView(this);
        this.control = new DBControl(this);
        this.menu = new DPMenu(this);
        this.logo = new DPLogo(this);
        this.modal = new DPModal(this);
        this.rendered = false;
        this.apply();
    }

    /**
     * Load
     * @param resources
     */
    load(resources) {
        if (this.rendered) {
            let video = this.config.get('video', true);
            var source = document.createElement('source');
            source.setAttribute('src', resources);
            video.appendChild(source);
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
            .fullScreen()
            .progress()
            .sound()
            .contextLogo()
            .contextModal()
            .contextMenu();
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
        let video = this.config.get('elements.video', true);
        let player = this.config.get('elements.playerModal', true);
        let btn = this.config.get('elements.controlPlayPause', true);
        let icons = this.config.get('icons');
        let videoDom = video.get(0);
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
                if (!isNaN(videoDom.duration)) {
                    if (videoDom.paused) {
                        videoDom.play();
                    } else {
                        videoDom.pause();
                    }
                }
            },

            /**
             * Make icon
             */
            makeIcon: function () {
                if (videoDom.paused) {
                    btn.html(icons.play);
                } else {
                    btn.html(icons.pause);
                }

                instance.modal.toggle();
            }
        };

        // Event when click on button play/pause
        btn.click(function () {
            helper.toggle();
        });

        player.click(function () {
            helper.toggle();
        });

        // Event when click on video
        video.click(function () {
            helper.toggle();
        });

        // Event when video play
        video.on('play', function () {
            helper.makeIcon();
        });

        // Event when video pause or ended
        video.on('pause ended', function () {
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
    fullScreen() {
        // Defined elements
        let element = this.config.get('elements.container', true).get(0);
        let btnFull = this.config.get('elements.controlFullScreen', true);
        let btnLarge = this.config.get('elements.controlLargeScreen', true);
        let icons = this.config.get('icons');
        let object = this.config.get('object', true);
        let sizeConfig = this.config.get('size');
        let defaultSize = null;
        let largeScreen = this.config.get('largeScreen');
        let instance = this;

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

                let videoSize = 0;
                let h = 0;

                if (this.isLarge) {
                    videoSize = $(window).width();

                    object.width(videoSize);
                    h = (videoSize * defaultSize.height / defaultSize.width);
                    let windowH = $(window).height() * 85 / 100;

                    if (h > windowH) {
                        h = windowH;
                    }
                } else {
                    videoSize = object.width();
                    h = (videoSize * defaultSize.height / defaultSize.width);
                }

                object.css({height: h + 'px'});

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

                isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

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
                    this.defaultScreen();
                } else {
                    this.isLarge = true;
                    this.rateScreenSize();
                }

                instance.logo.resize();

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
        let instance = this;
        let video = this.config.get('elements.video', true);
        let videoDom = video.get(0);
        let progressBar = this.config.get('elements.progress', true);
        let progress = progressBar.find('.playing');
        let timer = this.config.get('elements.controlTimer', true);
        let progressTimerTooltipText = this.config.get('elements.progressHoverTooltipText', true);
        let progressTimerTooltipImage = this.config.get('elements.progressToverTooltipImage', true);
        let tooltipCanvas = progressTimerTooltipImage.find('canvas').get(0);
        tooltipCanvas.width = 90;
        tooltipCanvas.height = 70;

        // Create preview elements
        let videoPreview = document.createElement('video');

        video.find('source').each(function (num, val) {
            var source = document.createElement('source');
            $(source).prop('src', $(this).attr('src'));
            videoPreview.append(source);
        });

        videoPreview.load();
        // videoPreview.pause();

        /**
         * Helper object
         * @type {{pad: (function(*, *, *=): *), setLoaded: setLoaded, setTimer: setTimer, display: display}}
         */
        let helper = {
            /**
             * Pad
             * @param n
             * @param width
             * @param z
             * @return {*}
             */
            pad: function (n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            },

            /**
             * Set loaded data
             * @param current
             * @param duration
             */
            setLoaded: function (current, duration) {
                progress.width((current / duration * 100) + '%');
            },

            /**
             * Set timer
             * @param current
             * @param duration
             */
            setTimer: function (current, duration) {
                let hours = Math.floor(current / 3600);
                let minutes = Math.floor((current - hours * 3600) / 60);
                let seconds = Math.floor(current - (minutes * 60 + hours * 3600));
                let currentTime = (hours > 0 ? (this.pad(hours, 2) + ':') : '') + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);

                hours = Math.floor(duration / 3600);
                minutes = Math.floor((duration - hours * 3600) / 60);
                seconds = Math.floor(duration - (minutes * 60 + hours * 3600));
                let totalTime = (hours > 0 ? (this.pad(hours, 2) + ':') : '') + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);

                timer.html(currentTime + ' / ' + totalTime);
            },

            /**
             * Display
             */
            display: function () {
                if (!isNaN(videoDom.duration)) {
                    let current = videoDom.currentTime;
                    let duration = videoDom.duration;

                    helper.setLoaded(current, duration);
                    helper.setTimer(current, duration);
                }
            }
        }

        // Event when timeupdate
        video.on('timeupdate ', function (e) {
            helper.display();
            instance.modal.toggle({loader: false});
        });

        // Event when click on progress bar
        // Then get position of mouse and count the time go to
        progressBar.on("click", function (e) {
            if (!isNaN(videoDom.duration)) {
                let offset = $(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let vidTime = videoDom.duration * percentage;
                videoDom.currentTime = vidTime;
                helper.setLoaded(left, totalWidth);
                instance.modal.toggle({loader: true});
            }
        });

        // Event when hover on progress
        // Then get position of mouse, count the time go to and get information
        progressBar.on("mousemove", function (e) {
            if (!isNaN(videoDom.duration)) {
                progressTimerTooltipText.show();
                progressTimerTooltipImage.show();

                let offset = $(this).offset();
                let left = (e.pageX - offset.left);
                let totalWidth = progressBar.width();
                let percentage = (left / totalWidth);
                let current = videoDom.duration * percentage;

                let hours = Math.floor(current / 3600);
                let minutes = Math.floor((current - hours * 3600) / 60);
                let seconds = Math.floor(current - (minutes * 60 + hours * 3600));
                let currentTime = (hours > 0 ? (helper.pad(hours, 2) + ':') : '') + helper.pad(minutes, 2) + ':' + helper.pad(seconds, 2);

                progressTimerTooltipText.css('left', left + 'px').text(currentTime);
                progressTimerTooltipImage.css('left', left + 'px');

                // Get picture
                //videoPreview.currentTime = current;
                //tooltipCanvas.getContext('2d').drawImage(videoPreview, 0, 0, tooltipCanvas.width, tooltipCanvas.height);
            } else {
                progressTimerTooltipText.hide();
                progressTimerTooltipImage.hide();
            }
        });

        // Event when loaded data
        // Then call display information on screen
        video.on('loadeddata', function (e) {
            helper.display();
            instance.modal.toggle({loader: false});
        });

        // Event when start load data
        video.on('loadstart', function (e) {
            instance.modal.toggle({loader: true});
        });

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
                if (videoDom.muted == true || videoDom.volume == 0) {
                    volume.html(icons.volumeMute);
                } else if (videoDom.volume <= 0.5) {
                    volume.html(icons.volume1);
                } else {
                    volume.html(icons.volume2);
                }
            },

            /**
             * Set volume for video
             * @param number
             */
            setVolume: function (number) {
                videoDom.volume = number / 100;

                if (videoDom.volume > 0) {
                    videoDom.muted = false;
                }
            },

            /**
             * Toggle mute video
             */
            toggleMute: function () {
                if (videoDom.muted == true) {
                    videoDom.muted = false;
                } else if (videoDom.volume > 0) {
                    videoDom.muted = true;
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
        video.on('volumechange', function () {
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
        this.logo.render();
        return this;
    }

    /**
     * Toggle control
     * @return {DilationPlayer}
     */
    contextControl() {
        this.control.render();
        return this;
    }

    /**
     * Toggle show/hidel loader
     * @param disabled
     * @return {DilationPlayer}
     */
    contextModal(config) {
        this.modal.render();

        return this;
    }

    /**
     * Menu
     * @return {DilationPlayer}
     */
    contextMenu() {
        this.menu.render().events();
        return this;
    }
}