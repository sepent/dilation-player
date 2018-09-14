# DilationPlayer

DilationPlayer is object, It provide methods to play video/audio.

**Platform**
- Jquery

**Using**

Import file DilationPlayer.js to your html page.

Sample: **[Video demo](http://dilationplayer.cobonla.org/)**

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="http://cdn.lib.cobonla.org/dilation-player/dilation-player.css">
</head>
<body>
    <div id="video-container"></div>
    <script src="http://cdn.lib.cobonla.org/jquery/v3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="http://cdn.lib.cobonla.org/dilation-player/dilation-player.js"></script>
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
        container: '.dp',
        video: '.dp-video',
        logo: '.dp-logo',
        progress: '.dp-progress',
        progressHoverTooltipText: '.dp-progress-tooltip-text',
        progressToverTooltipImage: '.dp-progress-tooltip-image',
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
        volume3: '<i class="icons icon-volume-3"></i>'
    },
    volume: 100,
    view: {
        content: null,
        import: null
    },
    sources: [],
    logo: {
        height: '10%',
        width: undefined,
        rate: 1
    },
    size: {
        height: undefined,
        width: '100%',
        rate: 2 / 3
    },
    largeScreen: false,
    locale: 'en',
    menu: {
        name: {
            text: 'translate.key',
            element: 'class_name',
            execute: function (item, menu, config) {
            }
        }
    },
    poster: null
}
```

Example, you would like to show video without **logo** then:

```
var player = new DilationPlayer('#your_container_id', {
    logo: false
});
```

Or you want to show the poster before start video then:

```
var player = new DilationPlayer('#your_container_id', {
    poster: 'https://mywebsite.com/poster.png'
});
```

OK, now it's working!
