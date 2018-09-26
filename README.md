# DilationPlayer

DilationPlayer is object, It provide methods to play video/audio. **[Video demo](http://dilationplayer.cobonla.org/)**

**Using**

Import file DilationPlayer.js to your html page.

Html page: 

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="http://cdn.lib.cobonla.org/dilation-player/1.0.0/dilation-player.min.css">
</head>
<body>
    <div id="video-container"></div>
    <script type="text/javascript" src="http://cdn.lib.cobonla.org/dilation-player/1.0.0/dilation-player.min.js"></script>
    <script type="text/javascript"
        src="http://cdn.lib.cobonla.org/dilation-player/1.0.0/plugins/dilation-player.plugin.ads.min.js"></script>
</body>
```

Then create new object.

```
var player = new DilationPlayer('#video-container', json_config);
```

Then it auto apply to your elements. If you want to custom, then change **json_config** value bellow.

```
{
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
    startAt: 0
}
```

Example, you would like to show video without **logo** then:

```
var player = new DilationPlayer('#video-container', {
    logo: false
});
```

Or you want to show the poster before start video then:

```
var player = new DilationPlayer('#video-container', {
    poster: 'https://mywebsite.com/poster.png'
});
```

Full source code after config:

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="http://cdn.lib.cobonla.org/dilation-player/1.0.0/dilation-player.min.css">
</head>
<body>
    <div id="video-container"></div>
    <script type="text/javascript" src="http://cdn.lib.cobonla.org/dilation-player/1.0.0/dilation-player.min.js"></script>
    <script type="text/javascript"
        src="http://cdn.lib.cobonla.org/dilation-player/1.0.0/plugins/dilation-player.plugin.ads.min.js"></script>
    <script>
    var player = new DilationPlayer('#video-container', {
        poster: 'https://mywebsite.com/poster.png',
        logo: false
    });
    </script>
</body>
```

OK, now it's working!
