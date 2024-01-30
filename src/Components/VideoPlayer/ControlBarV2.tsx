import { MediaPlayerClass, MediaPlayer } from "dashjs";

interface ComponentsProps {
  videoController: React.RefObject<HTMLDivElement>;
  playPauseBtn: React.RefObject<HTMLButtonElement>;
  bitrateListBtn: React.RefObject<HTMLButtonElement>;
  captionBtn: React.RefObject<HTMLButtonElement>;
  trackSwitchBtn: React.RefObject<HTMLButtonElement>;
  seekbar: React.RefObject<HTMLInputElement>;
  seekbarPlay: React.RefObject<HTMLDivElement>;
  seekbarBuffer: React.RefObject<HTMLDivElement>;
  muteBtn: React.RefObject<HTMLButtonElement>;
  volumebar: React.RefObject<HTMLInputElement>;
  fullscreenBtn: React.RefObject<HTMLButtonElement>;
  timeDisplay: React.RefObject<HTMLDivElement>;
  durationDisplay: React.RefObject<HTMLDivElement>;
  thumbnailContainer: React.RefObject<HTMLDivElement>;
  thumbnailElem: React.RefObject<HTMLImageElement>;
  thumbnailTimeLabel: React.RefObject<HTMLDivElement>;
}

export let ControlBar = function (player: MediaPlayerClass, components: ComponentsProps) {

  let captionMenu: any = null;
  let bitrateListMenu: any = null;
  let trackSwitchMenu: any = null;
  let menuHandlersList: any = {
      bitrate: null,
      caption: null,
      track: null
  };
  let lastVolumeLevel: any = NaN;
  let seeking: any = false;
  let videoControllerVisibleTimeout: any = 0;
  let liveThresholdSecs: any = 1;
  let textTrackList: any = {};
  let forceQuality = false;
  let video: any,
      videoContainer: any = components.videoc,
      videoController: any,
      playPauseBtn: any,
      bitrateListBtn: any,
      captionBtn: any,
      trackSwitchBtn: any,
      seekbar: any,
      seekbarPlay: any,
      seekbarBuffer: any,
      muteBtn: any,
      nativeTextTracks: any,
      volumebar: any,
      fullscreenBtn: any,
      timeDisplay: any,
      durationDisplay: any,
      thumbnailContainer: any,
      thumbnailElem: any,
      thumbnailTimeLabel: any,
      idSuffix: any,
      seekbarBufferInterval: any;

  //************************************************************************************
  // THUMBNAIL CONSTANTS
  //************************************************************************************
  // Maximum percentage of player height that the thumbnail will fill
  let maxPercentageThumbnailScreen = 0.15;
  // Separation between the control bar and the thumbnail (in px)
  let bottomMarginThumbnail = 10;
  // Maximum scale so small thumbs are not scaled too high
  let maximumScale = 2;

  let addPlayerEventsListeners = function () {
    player.on(MediaPlayer.events.PLAYBACK_STARTED, _onPlayStart, player);
    player.on(MediaPlayer.events.PLAYBACK_PAUSED, _onPlaybackPaused, player);
    player.on(MediaPlayer.events.PLAYBACK_TIME_UPDATED, _onPlayTimeUpdate, player);
    player.on(MediaPlayer.events.STREAM_ACTIVATED, _onStreamActivated, player);
    player.on(MediaPlayer.events.STREAM_DEACTIVATED, _onStreamDeactivated, player);
    player.on(MediaPlayer.events.STREAM_TEARDOWN_COMPLETE, _onStreamTeardownComplete, player);
    player.on(MediaPlayer.events.TEXT_TRACKS_ADDED, _onTracksAdded, player);
    player.on(MediaPlayer.events.BUFFER_LEVEL_UPDATED, _onBufferLevelUpdated, player);
  };

  let removePlayerEventsListeners = function () {
    player.off(MediaPlayer.events.PLAYBACK_STARTED, _onPlayStart, player);
    player.off(MediaPlayer.events.PLAYBACK_PAUSED, _onPlaybackPaused, player);
    player.off(MediaPlayer.events.PLAYBACK_TIME_UPDATED, _onPlayTimeUpdate, player);
    player.off(MediaPlayer.events.STREAM_ACTIVATED, _onStreamActivated, player);
    player.off(MediaPlayer.events.STREAM_DEACTIVATED, _onStreamDeactivated, player);
    player.off(MediaPlayer.events.STREAM_TEARDOWN_COMPLETE, _onStreamTeardownComplete, player);
    player.off(MediaPlayer.events.TEXT_TRACKS_ADDED, _onTracksAdded, player);
    player.off(MediaPlayer.events.BUFFER_LEVEL_UPDATED, _onBufferLevelUpdated, player);
  };

  let getControlId = function (id: string) {
    return id + (idSuffix ? idSuffix : '');
  };

  let setPlayer = function () {
    if (player) {
      removePlayerEventsListeners();
    }
    addPlayerEventsListeners();
  };

  //************************************************************************************
  // PLAYBACK
  //************************************************************************************

  let togglePlayPauseBtnState = function () {
    if (player.isPaused()) {
      setPlayBtn();
    } else {
      setPauseBtn();
    }
  };

  let setPlayBtn = function () {
    let span = document.getElementById(getControlId('iconPlayPause'));
    if (span !== null) {
        span.classList.remove('icon-pause');
        span.classList.add('icon-play');
    }
  };

  let setPauseBtn = function () {
      let span = document.getElementById(getControlId('iconPlayPause'));
      if (span !== null) {
        span.classList.remove('icon-play');
        span.classList.add('icon-pause');
      }
  };

  let _onPlayPauseClick = function (/*e*/) {
      togglePlayPauseBtnState.call(player);
      player.isPaused() ? player.play() : player.pause();
  };

  let _onPlaybackPaused = function (/*e*/) {
      togglePlayPauseBtnState();
  };

  let _onPlayStart = function (/*e*/) {
      setTime(player.timeAsUTC());
      updateDuration();
      togglePlayPauseBtnState();
      if (seekbarBufferInterval) {
          clearInterval(seekbarBufferInterval);
      }
  };

  let _onPlayTimeUpdate = function (/*e*/) {
      updateDuration();
      if (!seeking) {
          setTime(player.timeAsUTC());
          if (seekbarPlay) {
              seekbarPlay.style.width = (player.time() / player.duration() * 100) + '%';
          }

          if (seekbar.getAttribute('type') === 'range') {
              seekbar.value = player.time();
          }

      }
  };

  var getBufferLevel = function () {
      var bufferLevel = 0;
      if (player.getDashMetrics) {
          var dashMetrics = player.getDashMetrics();
          if (dashMetrics) {
              bufferLevel = dashMetrics.getCurrentBufferLevel('video');
              if (!bufferLevel) {
                  bufferLevel = dashMetrics.getCurrentBufferLevel('audio');
              }
          }
      }
      return bufferLevel;
  };

  //************************************************************************************
  // VOLUME
  //************************************************************************************

  let toggleMuteBtnState = function () {
      let span: HTMLElement | null = document.getElementById(getControlId('iconMute'));

      if(!span){
        throw new Error('This element doesnt exits.')
      }

      if (player.isMuted()) {
        span.classList.remove('icon-mute-off');
        span.classList.add('icon-mute-on');
      } else {
        span.classList.remove('icon-mute-on');
        span.classList.add('icon-mute-off');
      }
  };

  let onMuteClick = function (/*e*/) {
      if (player.isMuted() && !isNaN(lastVolumeLevel)) {
          setVolume(lastVolumeLevel);
      } else {
          lastVolumeLevel = parseFloat(volumebar.value);
          setVolume(0);
      }
      player.setMute(player.getVolume() === 0);
      toggleMuteBtnState();
  };

  let setVolume = function (value: number) {
      volumebar.value = value;
      player.setVolume(parseFloat(volumebar.value));
      player.setMute(player.getVolume() === 0);
      if (isNaN(lastVolumeLevel)) {
          lastVolumeLevel = player.getVolume();
      }
      toggleMuteBtnState();
  };

  //************************************************************************************
  // SEEKING
  // ************************************************************************************

  let calculateTimeByEvent = function (event: any) {
      let seekbarRect = seekbar.getBoundingClientRect();
      return Math.floor(player.duration() * (event.clientX - seekbarRect.left) / seekbarRect.width);
  };

  let onSeeking = function (event: any) {
      //TODO Add call to seek in trick-mode once implemented. Preview Frames.
      seeking = true;
      let mouseTime = calculateTimeByEvent(event);
      if (seekbarPlay) {
          seekbarPlay.style.width = (mouseTime / player.duration() * 100) + '%';
      }
      setTime(mouseTime);
      document.addEventListener('mousemove', onSeekBarMouseMove, true);
      document.addEventListener('mouseup', onSeeked, true);
  };

  let onSeeked = function (event: any) {
      seeking = false;
      document.removeEventListener('mousemove', onSeekBarMouseMove, true);
      document.removeEventListener('mouseup', onSeeked, true);

      // seeking
      let mouseTime = calculateTimeByEvent(event);
      if (!isNaN(mouseTime)) {
          mouseTime = mouseTime < 0 ? 0 : mouseTime;
          player.seek(mouseTime);
      }

      onSeekBarMouseMoveOut();

      if (seekbarPlay) {
          seekbarPlay.style.width = (mouseTime / player.duration() * 100) + '%';
      }
  };

  let onSeekBarMouseMove = function (event: any) {
      if (!thumbnailContainer || !thumbnailElem) return;

      // Take into account page offset and seekbar position
      let elem = videoContainer || video;
      let videoContainerRect = elem.getBoundingClientRect();
      let seekbarRect = seekbar.getBoundingClientRect();
      let videoControllerRect = videoController.getBoundingClientRect();

      // Calculate time position given mouse position
      let left = event.clientX - seekbarRect.left;
      let mouseTime = calculateTimeByEvent(event);
      if (isNaN(mouseTime)) return;

      // Update timer and play progress bar if mousedown (mouse click down)
      if (seeking) {
          setTime(mouseTime);
          if (seekbarPlay) {
              seekbarPlay.style.width = (mouseTime / player.duration() * 100) + '%';
          }
      }

      // Get thumbnail information
      if (player.provideThumbnail) {
          player.provideThumbnail(mouseTime, function (thumbnail) {

              if (!thumbnail) return;

              // Adjust left variable for positioning thumbnail with regards to its viewport
              left += (seekbarRect.left - videoContainerRect.left);
              // Take into account thumbnail control
              let ctrlWidth = parseInt(window.getComputedStyle(thumbnailElem).width);
              if (!isNaN(ctrlWidth)) {
                  left -= ctrlWidth / 2;
              }

              let scale = (videoContainerRect.height * maxPercentageThumbnailScreen) / thumbnail.height;
              if (scale > maximumScale) {
                  scale = maximumScale;
              }

              // Set thumbnail control position
              thumbnailContainer.style.left = left + 'px';
              thumbnailContainer.style.display = '';
              thumbnailContainer.style.bottom += Math.round(videoControllerRect.height + bottomMarginThumbnail) + 'px';
              thumbnailContainer.style.height = Math.round(thumbnail.height) + 'px';

              let backgroundStyle = 'url("' + thumbnail.url + '") ' + (thumbnail.x > 0 ? '-' + thumbnail.x : '0') +
                  'px ' + (thumbnail.y > 0 ? '-' + thumbnail.y : '0') + 'px';
              thumbnailElem.style.background = backgroundStyle;
              thumbnailElem.style.width = thumbnail.width + 'px';
              thumbnailElem.style.height = thumbnail.height + 'px';
              thumbnailElem.style.transform = 'scale(' + scale + ',' + scale + ')';

              if (thumbnailTimeLabel) {
                thumbnailTimeLabel.textContent = player.formatUTC(mouseTime, 'Brazil', true, false)
              }
          });
      }
  };

  var onSeekBarMouseMoveOut = function () {
      if (!thumbnailContainer) return;
      thumbnailContainer.style.display = 'none';
  };

  var seekLive = function () {
    player.seekToOriginalLive();
  };

  //************************************************************************************
  // TIME/DURATION
  //************************************************************************************
  var setDuration = function (value: number) {
      if (player.isDynamic()) {
          durationDisplay.textContent = '● LIVE';
          if (!durationDisplay.onclick) {
              durationDisplay.onclick = seekLive;
              durationDisplay.classList.add('live-icon');
          }
      } else if (!isNaN(value) && isFinite(value)) {
          durationDisplay.textContent = player.formatUTC(value, 'Brazil', true, false);
          durationDisplay.classList.remove('live-icon');
      }
  };

  var setTime = function (value: number) {
      if (value < 0) {
          return;
      }
      if (player.isDynamic() && player.duration()) {
          var liveDelay = player.duration() - value;
          var targetLiveDelay = player.getTargetLiveDelay();

          if (liveDelay < targetLiveDelay + liveThresholdSecs) {
              durationDisplay.classList.add('live');
          } else {
              durationDisplay.classList.remove('live');
          }
          timeDisplay.textContent = '- ' + player.convertToTimeCode(liveDelay);
      } else if (!isNaN(value)) {
          timeDisplay.textContent = player.formatUTC(value, 'Brazil', true, false);
      }
  };

  var updateDuration = function () {
      var duration = player.duration();
      if (duration !== parseFloat(seekbar.max)) { //check if duration changes for live streams..
          setDuration(player.durationAsUTC());
          seekbar.max = duration;
      }
  };

  //************************************************************************************
  // FULLSCREEN
  //************************************************************************************

  var onFullScreenChange = function (/*e*/) {
      var icon;
      if (isFullscreen()) {
          enterFullscreen();
          icon = fullscreenBtn.querySelector('.icon-fullscreen-enter');
          icon.classList.remove('icon-fullscreen-enter');
          icon.classList.add('icon-fullscreen-exit');
      } else {
          exitFullscreen();
          icon = fullscreenBtn.querySelector('.icon-fullscreen-exit');
          icon.classList.remove('icon-fullscreen-exit');
          icon.classList.add('icon-fullscreen-enter');
      }
  };

  var isFullscreen = function () {
      return document.fullscreenElement;
  };

  var enterFullscreen = function () {
      var element = videoContainer || video;
      if (!document.fullscreenElement) {
          if (element.requestFullscreen) {
              element.requestFullscreen();
          } else if (element.msRequestFullscreen) {
              element.msRequestFullscreen();
          } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else {
              element.webkitRequestFullScreen();
          }
      }

      videoController.classList.add('video-controller-fullscreen');
      window.addEventListener('mousemove', onFullScreenMouseMove);
      onFullScreenMouseMove();
  };

  var onFullScreenMouseMove = function () {
      clearFullscreenState();
      videoControllerVisibleTimeout = setTimeout(function () {
          videoController.classList.add('hide');
      }, 4000);
  };

  var clearFullscreenState = function () {
      clearTimeout(videoControllerVisibleTimeout);
      videoController.classList.remove('hide');
  };

  var exitFullscreen = function () {
      window.removeEventListener('mousemove', onFullScreenMouseMove);
      clearFullscreenState();

      if (document.fullscreenElement) {

          if (document.exitFullscreen) {
              document.exitFullscreen();
          }
      }

      videoController.classList.remove('video-controller-fullscreen');
  };

  var onFullscreenClick = function (/*e*/) {
      if (!isFullscreen()) {
          enterFullscreen();
      } else {
          exitFullscreen();
      }
      if (captionMenu) {
          captionMenu.classList.add('hide');
      }
      if (bitrateListMenu) {
          bitrateListMenu.classList.add('hide');
      }
      if (trackSwitchMenu) {
          trackSwitchMenu.classList.add('hide');
      }
  };

  //************************************************************************************
  // Audio Video MENU
  //************************************************************************************

  var _onStreamDeactivated = function (e: any) {
      if (e.streamInfo && textTrackList[e.streamInfo.id]) {
          delete textTrackList[e.streamInfo.id];
      }
  };

  var _onStreamActivated = function (e: any) {
      var streamInfo = e.streamInfo;

      updateDuration();

      //Bitrate Menu
      createBitrateSwitchMenu();

      //Track Switch Menu
      createTrackSwitchMenu();

      //Text Switch Menu
      createCaptionSwitchMenu(streamInfo);
  };

  var createBitrateSwitchMenu = function () {
      var contentFunc;

      if (bitrateListBtn) {
          destroyMenu(bitrateListMenu, bitrateListBtn, menuHandlersList.bitrate);
          bitrateListMenu = null;
          var availableBitrates: any = { menuType: 'bitrate' };
          availableBitrates.audio = player.getBitrateInfoListFor && player.getBitrateInfoListFor('audio') || [];
          availableBitrates.video = player.getBitrateInfoListFor && player.getBitrateInfoListFor('video') || [];
          availableBitrates.images = player.getBitrateInfoListFor && player.getBitrateInfoListFor('image') || [];

          if (availableBitrates.audio.length >= 1 || availableBitrates.video.length >= 1 || availableBitrates.images.length >= 1) {
              contentFunc = function (element: any, index: any) {
                  var result = isNaN(index) ? ' Auto Switch' : Math.floor(element.bitrate / 1000) + ' kbps';
                  result += element && element.width && element.height ? ' (' + element.width + 'x' + element.height + ')' : '';
                  return result;
              };

              bitrateListMenu = createMenu(availableBitrates, contentFunc);
              var func = function () {
                  onMenuClick(bitrateListMenu, bitrateListBtn);
              };
              menuHandlersList.bitrate = func;
              bitrateListBtn.addEventListener('click', func);
              bitrateListBtn.classList.remove('hide');

          } else {
              bitrateListBtn.classList.add('hide');
          }
      }
  };

  var createTrackSwitchMenu = function () {
      var contentFunc;

      if (trackSwitchBtn) {

          destroyMenu(trackSwitchMenu, trackSwitchBtn, menuHandlersList.track);
          trackSwitchMenu = null;

          var availableTracks: any = { menuType: 'track' };
          availableTracks.audio = player.getTracksFor('audio');
          availableTracks.video = player.getTracksFor('video'); // these return empty arrays so no need to check for null

          if (availableTracks.audio.length > 1 || availableTracks.video.length > 1) {
              contentFunc = function (element: any) {
                  var label = getLabelForLocale(element.labels);
                  var info = '';

                  if (element.lang) {
                      info += 'Language - ' + element.lang + ' ';
                  }

                  if (element.roles[0]) {
                      info += '- Role: ' + element.roles[0] + ' ';
                  }

                  if (element.codec) {
                      info += '- Codec: ' + element.codec + ' ';
                  }

                  return label || info
              };
              trackSwitchMenu = createMenu(availableTracks, contentFunc);
              var func = function () {
                  onMenuClick(trackSwitchMenu, trackSwitchBtn);
              };
              menuHandlersList.track = func;
              trackSwitchBtn.addEventListener('click', func);
              trackSwitchBtn.classList.remove('hide');
          }
      }
  };

  // Match up the current dashjs text tracks against native video element tracks by ensuring they have matching properties
  var _matchTrackWithNativeTrack = function(track: any, nativeTrack: any) {
      let label = track.id !== undefined ? track.id.toString() : track.lang;

      return !!(
          (track.kind === nativeTrack.kind) &&
          (track.lang === nativeTrack.language) &&
          (track.isTTML === nativeTrack.isTTML) &&
          (track.isEmbedded === nativeTrack.isEmbedded) &&
          (label === nativeTrack.label)
      );
  }

  // Compare track information against native video element tracks to get the current track mode
  var _getNativeVideoTrackMode = function (track: any) {
      const nativeTracks = video.textTracks;
      let trackMode;
      for (let i = 0; i < nativeTracks.length; i++) {
          const nativeTrack = nativeTracks[i];
          if (_matchTrackWithNativeTrack(track, nativeTrack)) {
              trackMode = nativeTrack.mode;
              break;
          }
      };

      return (trackMode === undefined) ? 'showing' : trackMode;
  };

  var createCaptionSwitchMenu = function (streamId: any) {
      // Subtitles/Captions Menu //XXX we need to add two layers for captions & subtitles if present.

      var activeStreamInfo = player.getActiveStream()?.getStreamInfo();

      if(!activeStreamInfo){
        throw new Error('getStreamInfo() doesnt exists')
      }

      if (captionBtn && (!activeStreamInfo.id || activeStreamInfo.id === streamId)) {

          destroyMenu(captionMenu, captionBtn, menuHandlersList.caption);
          captionMenu = null;

          var tracks = textTrackList[streamId] || [];
          var contentFunc = function (element: any, index: any) {
              if (isNaN(index)) {
                  return {
                      mode: 'showing',
                      text: 'OFF'
                  };
              }

              var label = getLabelForLocale(element.labels);
              var trackText;
              if (label) {
                  trackText = label + ' : ' + element.type;
              } else {
                  trackText = element.lang + ' : ' + element.kind;
              }

              return {
                  mode: _getNativeVideoTrackMode(element),
                  text: trackText
              }
          };
          captionMenu = createMenu({ menuType: 'caption', arr: tracks }, contentFunc);

          var func = function () {
              onMenuClick(captionMenu, captionBtn);
          };

          menuHandlersList.caption = func;
          captionBtn.addEventListener('click', func);
          captionBtn.classList.remove('hide');
      }

  };

  var _onTracksChanged = function () {
      var activeStreamInfo = player.getActiveStream()?.getStreamInfo();

      if(!activeStreamInfo){
        throw new Error('getStreamInfo() doesnt exists')
      }

      createCaptionSwitchMenu(activeStreamInfo.id);
  }

  var _onTracksAdded = function (e: any) {
      // Subtitles/Captions Menu //XXX we need to add two layers for captions & subtitles if present.
      if (!textTrackList[e.streamId]) {
          textTrackList[e.streamId] = [];
      }

      textTrackList[e.streamId] = textTrackList[e.streamId].concat(e.tracks);

      nativeTextTracks = video.textTracks;
      nativeTextTracks.addEventListener('change', _onTracksChanged);

      createCaptionSwitchMenu(e.streamId);
  };

  var _onBufferLevelUpdated = function () {
      if (seekbarBuffer) {
          seekbarBuffer.style.width = ((player.time() + getBufferLevel()) / player.duration() * 100) + '%';
      }
  };

  var _onStreamTeardownComplete = function (/*e*/) {
      setPlayBtn();
      timeDisplay.textContent = '00:00';
  };

  var createMenu = function (info: any, contentFunc: any) {
      var menuType = info.menuType;
      var el = document.createElement('div');
      el.id = menuType + 'Menu';
      el.classList.add('menu');
      el.classList.add('hide');
      el.classList.add('unselectable');
      el.classList.add('menu-item-unselected');
      videoController.appendChild(el);

      switch (menuType) {
          case 'caption':
              el.appendChild(document.createElement('ul'));
              el = createMenuContent(el, getMenuContent(menuType, info.arr, contentFunc), 'caption', menuType + '-list');
              setMenuItemsState(getMenuInitialIndex(info, menuType), menuType + '-list');
              break;
          case 'track':
          case 'bitrate':
              if (info.video.length >= 1) {
                  el.appendChild(createMediaTypeMenu('video'));
                  el = createMenuContent(el, getMenuContent(menuType, info.video, contentFunc), 'video', 'video-' + menuType + '-list');
                  setMenuItemsState(getMenuInitialIndex(info.video, menuType, 'video'), 'video-' + menuType + '-list');
              }
              if (info.audio.length >= 1) {
                  el.appendChild(createMediaTypeMenu('audio'));
                  el = createMenuContent(el, getMenuContent(menuType, info.audio, contentFunc), 'audio', 'audio-' + menuType + '-list');
                  setMenuItemsState(getMenuInitialIndex(info.audio, menuType, 'audio'), 'audio-' + menuType + '-list');
              }
              if (info.images && info.images.length >= 1) {
                  el.appendChild(createMediaTypeMenu('image'));
                  el = createMenuContent(el, getMenuContent(menuType, info.images, contentFunc, false), 'image', 'image-' + menuType + '-list');
                  setMenuItemsState(getMenuInitialIndex(info.images, menuType, 'image'), 'image-' + menuType + '-list');
              }
              break;
      }

      window.addEventListener('resize', handleMenuPositionOnResize, true);
      return el;
  };

  var getMenuInitialIndex = function (info?: any, menuType?: any, mediaType?: any) {
      if (menuType === 'track') {
          var mediaInfo = player.getCurrentTrackFor(mediaType);
          var idx = 0;
          info.some(function (element: any, index: any) {
              if (isTracksEqual(element, mediaInfo)) {
                  idx = index;
                  return true;
              }
          });
          return idx;

      } else if (menuType === 'bitrate') {
          var cfg: any = player.getSettings();
          if (cfg.streaming && cfg.streaming.abr && cfg.streaming.abr.initialBitrate) {
              return cfg.streaming.abr.initialBitrate['mediaType'] | 0;
          }
          return 0;
      } else if (menuType === 'caption') {
          return player.getCurrentTextTrackIndex() + 1;
      }
  };

  var isTracksEqual = function (t1: any, t2: any) {
      var sameId = t1.id === t2.id;
      var sameViewpoint = t1.viewpoint === t2.viewpoint;
      var sameLang = t1.lang === t2.lang;
      var sameRoles = t1.roles.toString() === t2.roles.toString();
      var sameAccessibility = (!t1.accessibility && !t2.accessibility) || (t1.accessibility && t2.accessibility && t1.accessibility.toString() === t2.accessibility.toString());
      var sameAudioChannelConfiguration = (!t1.audioChannelConfiguration && !t2.audioChannelConfiguration) || (t1.audioChannelConfiguration && t2.audioChannelConfiguration && t1.audioChannelConfiguration.toString() === t2.audioChannelConfiguration.toString());

      return (sameId && sameViewpoint && sameLang && sameRoles && sameAccessibility && sameAudioChannelConfiguration);
  };

  var getMenuContent = function (type?: any, arr?: any, contentFunc?: any, autoswitch?: any) {
      autoswitch = (autoswitch !== undefined) ? autoswitch : true;

      var content = [];
      arr.forEach(function (element: any, index: any) {
          content.push(contentFunc(element, index));
      });
      if (type !== 'track' && autoswitch) {
          content.unshift(contentFunc(null, NaN));
      }
      return content;
  };

  var getBrowserLocale = function () {
      return (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
  };

  var getLabelForLocale = function (labels: any) {
      var locales = getBrowserLocale();

      for (var i = 0; i < labels.length; i++) {
          for (var j = 0; j < locales.length; j++) {
              if (labels[i].lang && locales[j] && locales[j].indexOf(labels[i].lang) > -1) {
                  return labels[i].text;
              }
          }
      }

      return labels.length === 1 ? labels[0].text : null;
  };

  var createMediaTypeMenu = function (type: any) {
      var div = document.createElement('div');
      var title = document.createElement('div');
      var content = document.createElement('ul');

      div.id = type;

      title.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      title.classList.add('menu-sub-menu-title');

      content.id = type + 'Content';
      content.classList.add(type + '-menu-content');

      div.appendChild(title);
      div.appendChild(content);

      return div;
  };

  var createMenuContent = function (menu: any, arr: any, mediaType: any, name: any) {
      for (var i = 0; i < arr.length; i++) {
          var item: any = document.createElement('li');
          item.id = name + 'Item_' + i;
          item.index = i;
          item.mediaType = mediaType;
          item.name = name;
          item.selected = false;
          if (isObject(arr[i])) {
              // text tracks need extra properties
              item.mode = arr[i].mode;
              item.textContent = arr[i].text;
          } else {
              // Other tracks will just have their text
              item.textContent = arr[i];
          }
          
          item.onmouseover = function (/*e*/) {
              if (this.selected !== true) {
                  this.classList.add('menu-item-over');
              }
          };
          item.onmouseout = function (/*e*/) {
              this.classList.remove('menu-item-over');
          };
          item.onclick = setMenuItemsState.bind(item);

          var el;
          if (mediaType === 'caption') {
              el = menu.querySelector('ul');
          } else {
              el = menu.querySelector('.' + mediaType + '-menu-content');
          }

          if (mediaType === 'caption') {
              if (item.mode !== 'disabled') {
                  el.appendChild(item);
              }
          } else {
              el.appendChild(item);
          }
      }

      return menu;
  };

  var onMenuClick = function (menu: any, btn: any) {
      if (menu.classList.contains('hide')) {
          menu.classList.remove('hide');
          menu.onmouseleave = function (/*e*/) {
              this.classList.add('hide');
          };
      } else {
          menu.classList.add('hide');
      }
      menu.style.position = isFullscreen() ? 'fixed' : 'absolute';
      positionMenu(menu, btn);
  };

  var setMenuItemsState = function (value: any, type: any) {
      try {
          var item = value;
          if (item) {
              var nodes = item.parentElement.children;

              for (var i = 0; i < nodes.length; i++) {
                  nodes[i].selected = false;
                  nodes[i].classList.remove('menu-item-selected');
                  nodes[i].classList.add('menu-item-unselected');
              }
              item.selected = true;
              item.classList.remove('menu-item-over');
              item.classList.remove('menu-item-unselected');
              item.classList.add('menu-item-selected');

              if (type === undefined) { // User clicked so type is part of item binding.
                  switch (item.name) {
                      case 'video-bitrate-list':
                      case 'audio-bitrate-list':
                          var cfg: any = {
                              'streaming': {
                                  'abr': {
                                      'autoSwitchBitrate': {}
                                  }
                              }
                          };

                          if (item.index > 0) {
                              cfg.streaming.abr.autoSwitchBitrate[item.mediaType] = false;
                              player.updateSettings(cfg);
                              player.setQualityFor(item.mediaType, item.index - 1, forceQuality);
                          } else {
                              cfg.streaming.abr.autoSwitchBitrate[item.mediaType] = true;
                              player.updateSettings(cfg);
                          }
                          break;
                      case 'image-bitrate-list':
                          player.setQualityFor(item.mediaType, item.index);
                          break;
                      case 'caption-list':
                          player.setTextTrack(item.index - 1);
                          break;
                      case 'video-track-list':
                      case 'audio-track-list':
                          player.setCurrentTrack(player.getTracksFor(item.mediaType)[item.index]);
                          break;
                  }
              }
          }
      } catch (e) {
          console.error(e);
      }
  };

  var handleMenuPositionOnResize = function (/*e*/) {
      if (captionMenu) {
          positionMenu(captionMenu, captionBtn);
      }
      if (bitrateListMenu) {
          positionMenu(bitrateListMenu, bitrateListBtn);
      }
      if (trackSwitchMenu) {
          positionMenu(trackSwitchMenu, trackSwitchBtn);
      }
  };

  var positionMenu = function (menu: any, btn: any) {
      if (btn.offsetLeft + menu.clientWidth >= videoController.clientWidth) {
          menu.style.right = '0px';
          menu.style.left = '';
      } else {
          menu.style.left = btn.offsetLeft + 'px';
      }
      var menu_y = videoController.offsetTop - menu.offsetHeight;
      menu.style.top = menu_y + 'px';
  };

  var destroyMenu = function (menu: any, btn: any, handler: any) {
      try {
          if (menu && videoController) {
              btn.removeEventListener('click', handler);
              videoController.removeChild(menu);
          }
      } catch (e) {
      }
  };

  var removeMenu = function (menu: any, btn: any) {
      try {
          if (menu) {
              videoController.removeChild(menu);
              menu = null;
              btn.classList.add('hide');
          }
      } catch (e) {
      }
  };

  //************************************************************************************
  //Utilities
  //************************************************************************************

  var isObject = function (obj: any) {
      return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
  }

  //************************************************************************************
  // PUBLIC API
  //************************************************************************************

  return {
      setVolume: setVolume,
      setDuration: setDuration,
      setTime: setTime,
      setPlayer: setPlayer,
      removeMenu: removeMenu,

      initialize: function (suffix: any) {

          if (!player) {
              throw new Error('Please pass an instance of MediaPlayer.js when instantiating the ControlBar Object');
          }
          video = player.getVideoElement();
          if (!video) {
              throw new Error('Please call initialize after you have called attachView on MediaPlayer.js');
          }

          video.controls = false;
          videoContainer = video.parentNode;
          captionBtn.classList.add('hide');
          if (trackSwitchBtn) {
              trackSwitchBtn.classList.add('hide');
          }
          addPlayerEventsListeners();
          playPauseBtn.addEventListener('click', _onPlayPauseClick);
          muteBtn.addEventListener('click', onMuteClick);
          fullscreenBtn.addEventListener('click', onFullscreenClick);
          seekbar.addEventListener('mousedown', onSeeking, true);
          seekbar.addEventListener('mousemove', onSeekBarMouseMove, true);
          // set passive to true for scroll blocking listeners (https://www.chromestatus.com/feature/5745543795965952)
          seekbar.addEventListener('touchmove', onSeekBarMouseMove, { passive: true });
          seekbar.addEventListener('mouseout', onSeekBarMouseMoveOut, true);
          seekbar.addEventListener('touchcancel', onSeekBarMouseMoveOut, true);
          seekbar.addEventListener('touchend', onSeekBarMouseMoveOut, true);
          volumebar.addEventListener('input', setVolume, true);
          document.addEventListener('fullscreenchange', onFullScreenChange, false);
          document.addEventListener('MSFullscreenChange', onFullScreenChange, false);
          document.addEventListener('mozfullscreenchange', onFullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', onFullScreenChange, false);
      },

      show: function () {
          videoController.classList.remove('hide');
      },

      hide: function () {
          videoController.classList.add('hide');
      },

      disable: function () {
          videoController.classList.add('disable');
      },

      enable: function () {
          videoController.classList.remove('disable');
      },

      forceQualitySwitch: function (value: any) {
          forceQuality = value;
      },

      resetSelectionMenus: function () {
          if (menuHandlersList.bitrate) {
              bitrateListBtn.removeEventListener('click', menuHandlersList.bitrate);
          }
          if (menuHandlersList.track) {
              trackSwitchBtn.removeEventListener('click', menuHandlersList.track);
          }
          if (menuHandlersList.caption) {
              captionBtn.removeEventListener('click', menuHandlersList.caption);
              nativeTextTracks.removeEventListener('change', _onTracksChanged);
          }
          if (captionMenu) {
              this.removeMenu(captionMenu, captionBtn);
          }
          if (trackSwitchMenu) {
              this.removeMenu(trackSwitchMenu, trackSwitchBtn);
          }
          if (bitrateListMenu) {
              this.removeMenu(bitrateListMenu, bitrateListBtn);
          }
      },

      reset: function () {
          window.removeEventListener('resize', handleMenuPositionOnResize);

          this.resetSelectionMenus();

          menuHandlersList = [];
          seeking = false;

          if (seekbarPlay) {
              seekbarPlay.style.width = '0%';
          }

          if (seekbarBuffer) {
              seekbarBuffer.style.width = '0%';
          }
      },

      destroy: function () {
          this.reset();

          playPauseBtn.removeEventListener('click', _onPlayPauseClick);
          muteBtn.removeEventListener('click', onMuteClick);
          fullscreenBtn.removeEventListener('click', onFullscreenClick);
          seekbar.removeEventListener('mousedown', onSeeking);
          volumebar.removeEventListener('input', setVolume);
          seekbar.removeEventListener('mousemove', onSeekBarMouseMove);
          seekbar.removeEventListener('touchmove', onSeekBarMouseMove);
          seekbar.removeEventListener('mouseout', onSeekBarMouseMoveOut);
          seekbar.removeEventListener('touchcancel', onSeekBarMouseMoveOut);
          seekbar.removeEventListener('touchend', onSeekBarMouseMoveOut);

          removePlayerEventsListeners();

          document.removeEventListener('fullscreenchange', onFullScreenChange);
          document.removeEventListener('MSFullscreenChange', onFullScreenChange);
          document.removeEventListener('mozfullscreenchange', onFullScreenChange);
          document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
      }
  };
};