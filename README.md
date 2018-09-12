# DilationPlayer

DilationPlayer is object, It provide methods to play video/audio.

**Platform**
- Jquery

**Using**

Import file DilationPlayer.js to your html page. Then create new object.

```
var player = new DilationPlayer('#your_container_id', config);
```

Then it auto apply to your elements. If you want to custom, then change **config** value bellow.

```
{
	// Config elements
	elements: {
		container: '.dilation-player',
		video: '.dilation-player-video',
		logo: '.dilation-player-logo',
		progress: '.dilation-player-progress',
		progressHoverTooltipText: '.dilation-player-progress-tooltip-text',
		progressToverTooltipImage: '.dilation-player-progress-tooltip-image',
		control: '.dilation-player-control',
		button: '.dilation-player-button',
		controlPlayPause: '.dilation-player-btn-play',
		controlFullscreen: '.dilation-player-btn-fullscreen',
		controlVolume: '.dilation-player-btn-volume',
		controlVolumeTooltip: '.dilation-player-volume-tooltip',
		controlVolumeRange: '.dilation-player-volume-range',
		controlTimer: '.dilation-player-timer',
		loader: '.dilation-player-loader',
		loaderIcon: '.dilation-player-loader-icon'
	},

	// Config for icon
	icons: {
		loader: '<i class="fa fa-spin fa-spinner"></i>',
		fullscreen: '<i class="icons icon-size-fullscreen"></i>',
		actualscreen: '<i class="icons icon-size-actual"></i>',
		pause: '<i class="icons icon-control-pause"></i>',
		play: '<i class="icons icon-control-play"></i>',
		volumeMute: '<i class="icons icon-volume-off"></i>',
		volume1: '<i class="icons icon-volume-1"></i>',
		volume2: '<i class="icons icon-volume-2"></i>',
		volume3: '<i class="icons icon-volume-3"></i>'
	},
	
	// Config default
	volume: 5,
	view: false,
	resources: {}
}
```

OK, now it's working!
