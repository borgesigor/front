import dashjs from "dashjs";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { isMobile } from "../../Utils/GetDeviceType";

const url = 
  "https://rdmedia.bbc.co.uk/testcard/simulcast/manifests/avc-full.mpd"
  // "https://dash.akamaized.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd"
  // "http://localhost/tmp_dash/stream/index.mpd"
  // "https://rdmedia.bbc.co.uk/testcard/lowlatency/manifests/ll-avc-full.mpd"
  // "https://d24rwxnt7vw9qb.cloudfront.net/v1/dash/e6d234965645b411ad572802b6c9d5a10799c9c1/All_Reference_Streams/6ba06d17f65b4e1cbd1238eaa05c02c1/index.mpd"

export function VideoPlayerComponent() {
  const videoContainer: any = useRef(null)
  const videoRef: any = useRef(null)
  const player: any = useRef(null)
  const subtitle: any = useRef(null)
  const sliderProgress: any = useRef(null)
  const volumeSlider: any = useRef(null)
  const isSeeking: any = useRef(false)
  const userPaused: any = useRef(false)
  const isLive: any = useRef(false)

  const [paused, setPaused] = useState(true)
  const [duration, setDuration] = useState(0)
  const [actualTime, setActualTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [videoPercentage, setVideoPercentage] = useState(0)
  const [iconVolume, setIconVolume] = useState(0)

  function convertToTimeCode(value: number){
    return player.current.convertToTimeCode(value)
  }

  function onPlay(){
    setPaused(false)
  }

  function onPause(){
    setPaused(true)
  }

  function onPlaybackWaiting(){
    setIsLoading(true)
  }

  function canPlay(){
    player.current.isDynamic() ? isLive.current = true : isLive.current = false

    setIsLoading(false)
    setApplicationVolume()
  }

  function toggleFullscreen(){
    if(document.fullscreenElement){
      document.exitFullscreen()
    }else{
      videoContainer.current.requestFullscreen()
    }
  }

  function getPlayerVolume(){
    return player.current.isMuted() ? 0 : player.current.getVolume()
  }

  function changePlayerVolume(){
    player.current.setVolume(parseFloat(volumeSlider.current.value))
    volumeSlider.current.value > 0 ? player.current.setMute(false) : player.current.setMute(true)
    setIconVolume(getPlayerVolume())
  }

  function setApplicationVolume(){
    volumeSlider.current.value = getPlayerVolume()
    setIconVolume(getPlayerVolume())
  }

  function togglePlayPause(){
    if (player.current.isPaused()){
      player.current.play()
      userPaused.current = false
    } else {
      player.current.pause()
      userPaused.current = true
    }
  }

  function mediaDuration(){
    if(!isLive.current){
      return player.current.duration()
    }

    return player.current.getDVRWindowSize() - player.current.getTargetLiveDelay()
  }

  function syncToTheEdge(){
    player.current.seekToOriginalLive();

    player.current.off(dashjs.MediaPlayer.events.CAN_PLAY, syncToTheEdge);
  }

  function seekToLiveEdge(){
    player.current.seekToOriginalLive();

    player.current.on(dashjs.MediaPlayer.events.CAN_PLAY, syncToTheEdge);
  }

  function sliderProgressUpdate(){
    if(!isSeeking.current){
      sliderProgress.current.value = player.current.time()
      sliderProgress.current.max = mediaDuration()
    }
  }

  function timeCodeUpdate(){
    setDuration(convertToTimeCode(sliderProgress.current.max))
    setActualTime(convertToTimeCode(sliderProgress.current.value))
  }

  function sliderTrackUpdate(){
    setVideoPercentage((sliderProgress.current.value / sliderProgress.current.max) * 100)
  }

  function sliderSeeking(){
    timeCodeUpdate()
    sliderTrackUpdate()
  }

  function sliderSeekStart(){
    player.current.pause()
    isSeeking.current = true
  }

  function sliderSeekEnd(){
    player.current.seek(parseFloat(sliderProgress.current.value))
    
    if(!userPaused.current){
      player.current.play()
    }

    isSeeking.current = false
  }

  // function nowTime(){
  //   let nowTime = 'não sei: ' + convertToTimeCode(player.current.getDVRWindowSize()) + ' duração: ' + convertToTimeCode(player.current.getDVRSeekOffset(0))
  //   return nowTime
  // }

  function timeUpdate(){
    sliderProgressUpdate()
    timeCodeUpdate()
    sliderTrackUpdate()

    // console.info(nowTime())
    // console.log(sliderProgress.current.value)
  }

  function firstLoad(){
    sliderProgress.current.value = 0;
    volumeSlider.current.value = 0;
  }

  useEffect(() => {

    if (videoRef.current) {
      const video = videoRef.current;

      player.current = dashjs.MediaPlayer().create();

      player.current.initialize(video, url, true);
      player.current.attachView(video);
      player.current.attachTTMLRenderingDiv(subtitle.current);

      firstLoad()

      player.current.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, onPlay);
      player.current.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, onPause);
      player.current.on(dashjs.MediaPlayer.events.PLAYBACK_WAITING, onPlaybackWaiting);
      player.current.on(dashjs.MediaPlayer.events.CAN_PLAY, canPlay);
      player.current.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, timeUpdate);
      // player.current.on(dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED, subtitlesUpdate)

      sliderProgress.current.addEventListener('mousedown', sliderSeekStart);
      sliderProgress.current.addEventListener('mouseup', sliderSeekEnd);
      // sliderProgress.current.addEventListener('change', sliderSeeking);

    }

    return () => {
      if (player.current) {
        player.current.destroy();
        player.current = null;
      }
    };

  }, [player.current]);

  return (
    <>
      <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'black', overflow: 'hidden' }} ref={videoContainer} >
        <div ref={subtitle}></div>
        <video ref={videoRef} style={{ width: "100%" }} ></video>
        <SpinnerContainer>
          {
            isLoading &&
              <Spinner>
                  <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                  </svg>
              </Spinner>
          }
        </SpinnerContainer>
        <DataContainer>
          <Card>
            <span className="tag" style={{ fontSize: '0.9em' }} >Acervo</span>
            <div className="texts">
              <span style={{ fontSize: '1em' }}>Testemunho</span>
              <span style={{ fontWeight: 400, fontSize: '0.9em', opacity: 0.6 }} >João</span>
            </div>
          </Card>
        </DataContainer>
        <ScreenClickContainer $paused={userPaused.current} onClick={togglePlayPause}>
          <button>
            <span style={{ fontSize: '2rem' }} className="material-symbols-rounded">
              { userPaused.current ? 'play_arrow' : 'pause' }
            </span>
          </button>
        </ScreenClickContainer>
        <ControlBarContainer>
          <ControlBarUpper>
            <ProgressBar>
              <input ref={sliderProgress} type="range" style={{ width: '100%' }} step={1} onChange={sliderSeeking} />
              <div className="new-input">
                <div className="track tracks"></div>
                <div className="past tracks" style={{ width: `${videoPercentage}%` }} ></div>
              </div>
            </ProgressBar>
          </ControlBarUpper>
          <ControlBarDown>
            <ControlBarDownLeft>
              {
                !isMobile() &&
                  <button onClick={togglePlayPause} >
                    <span style={{ fontSize: '2rem' }} className="material-symbols-rounded">
                      { paused ? 'play_arrow' : 'pause' }
                    </span>
                  </button>
              }
              {
                isLive.current ?
                  <LiveButton $isLiveEdge={videoPercentage > 99} onClick={seekToLiveEdge} >Ao Vivo</LiveButton>
                :
                  <Timecode>
                    <span className="actual">{actualTime ? actualTime : '0:00'}</span>
                    <span className="separator">/</span>
                    <span className="duration">{duration ? duration : '0:00'}</span>
                  </Timecode>
              }
            </ControlBarDownLeft>
            <ControlBarDownRight>
              {
                !isMobile() &&
                  <Volume>
                    <button >
                      <span className="material-symbols-rounded">
                        { 
                          iconVolume > 0 && 'volume_up'
                        }
                        {
                          iconVolume == 0 && 'volume_off'
                        }
                      </span>
                    </button>
                    <div className="volume-dropdown">

                      <ProgressBar>
                        <input ref={volumeSlider} step={0.01} max={1} type="range" onChange={changePlayerVolume} />
                        <div className="new-input">
                          <div className="track tracks"></div>
                          <div className="past tracks"></div>
                        </div>
                      </ProgressBar>

                    </div>
                  </Volume>
              }
              <button onClick={toggleFullscreen}>
                <span className="material-symbols-rounded"> 
                  fullscreen 
                </span>
              </button>
            </ControlBarDownRight>
          </ControlBarDown>
        </ControlBarContainer>
      </div>
    </>
  );
}

const DataContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem;
`

const Card = styled.div`
  background: white;
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  font-weight: 600;
  font-size: 1rem;
  gap: 1.5rem;
  color: #000;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.20);
  border-radius: 0.2rem;
  animation: move 22s ease;

  .texts{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tag{
    border: 1px solid;
    padding: 0.5em 1em;
    border-radius: 0.2em;
    border-color: #666;
    animation: move 22s ease;
  }

  @keyframes move {
    0%{
      transform: translateX(-200%);
      opacity: 0;
      width: -0%;
    }
    5%{
      transform: translateX(0%);
      width: 100%;
      opacity: 1;
    }
    95%{
      transform: translateX(0%);
      width: 100%;
      opacity: 1;
    }
    100%{
      transform: translateX(-200%);
      opacity: 0;
      width: -0%;
    }
  }
`

const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

const ScreenClickContainer = styled.div<{ $paused: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  button{
    border-radius: 100px;
    border: none;
    background: #ffffff;
    color: #141414;
    height: 3rem;
    width: 3rem;
    /* opacity: ${props => props.$paused ? 'fadeInOut' : '0'}; */
    opacity: 0;
    ${props => props.$paused && 'animation: fadeInOut .5s ease-in-out;' }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1.1);
    }
  }
`

const Spinner = styled.div`
  background: rgba(0,0,0,0.4);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 5em;
    transform-origin: center;
    animation: rotate4 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: rgba(255, 255, 255, 1);
    stroke-width: 4;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 2;
    stroke-linecap: round;
    animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash4 {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }

    100% {
      stroke-dashoffset: -125px;
    }
  }
`

const Volume = styled.div`
  display: flex;
  align-items: center;

  .volume-dropdown{
    width: 5rem;

    input{
      cursor: pointer;
    }
  }
`

const ControlBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  padding: 1rem 1rem;
  color: white;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(24,24,24,1) 100%);

  button{
    background: transparent;
    border: none;
    height: 100%;
    color: white;
    cursor: pointer;
    font-family: ${props => props.theme.secondaryFont};
    font-size: 0.9rem;

    .material-symbols-rounded{
      font-size: 2rem;
      position: relative;
    }
  }
`

const LiveButton = styled.button<{ $isLiveEdge: boolean }>`
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before{
    content: '';
    width: 8px;
    height: 8px;
    background: ${props => props.$isLiveEdge ? 'red' : 'grey'};
    display: block;
    border-radius: 100px;
  }
`

const ControlBarDown = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  height: 40px;
`

const ControlBarDownLeft = styled.div`
  display: flex;
  gap: 1rem;
`

const ControlBarDownRight = styled.div`
  display: flex;
  gap: 1rem;
`

const ProgressBar = styled.div`
  position: relative;

  .new-input{
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    z-index: 1;
  }

  .tracks{
    height: 2px;
    position: absolute;
  }
  
  .track{
    width: 100%;
    background: #ffffff5c;
    /* background: #43a4ff8b; */
  }

  .past{
    background: white;
    /* background: #43a4ff; */
  }

  input{
    position: relative;
    z-index: 2;
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    height: 1.5rem;
    /* background: red; */
 
    &::-webkit-slider-thumb{
      -webkit-appearance: none;
      appearance: none;
      width: 0.6rem;
      height: 0.6rem;
      background: white;
      /* background: #43a4ff; */
      border-radius: 50%;
      position: relative;
      top: 1px;
      transition: 100ms;
    }
  }

  &:hover{
    input::-webkit-slider-thumb{
      width: 1rem;
      height: 1rem;
    }

    .tracks{
      height: 4px;
    }
  }
`

const Timecode = styled.div`
  display: flex;
  gap: 0.5rem;
  font-family: ${props => props.theme.secondaryFont};
  align-items: center;
  font-size: 0.9rem;

  .separator{
    opacity: 0.3;
  }
`

const ControlBarUpper = styled.div`

`