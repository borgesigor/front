import dashjs from "dashjs";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { isMobile } from "../../Utils/GetDeviceType";

const url = 
  // "https://rdmedia.bbc.co.uk/testcard/simulcast/manifests/avc-full.mpd"
  "https://dash.akamaized.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd"
  // "https://rdmedia.bbc.co.uk/testcard/lowlatency/manifests/ll-avc-full.mpd"
  // "https://d24rwxnt7vw9qb.cloudfront.net/v1/dash/e6d234965645b411ad572802b6c9d5a10799c9c1/All_Reference_Streams/6ba06d17f65b4e1cbd1238eaa05c02c1/index.mpd"

export function VideoPlayerComponent() {
  const videoRef: any = useRef(null);
  const player: any = useRef(null);
  const subtitle: any = useRef(null);
  const progressBar: any = useRef(null);
  const volumeSlider: any = useRef(null);
  const isSeeking: any = useRef(false);

  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  let progressInterval: any;

  // Update - atualizar tudo
  function update(){
    timecode()
    updateProgressBarDuration()
    updateProgressBar()
    changePercent()
    sliderVolumeSync()
    setIsPaused(player.current.isPaused())
  }

  const manualPause = () => {
    setUserPaused(true)
    player.current.pause()
  }

  const manualPlay = () => {
    setUserPaused(false)
    player.current.play()
  }

  // Toggle
  const togglePlayPause = () => {
    isPaused ? manualPlay() : manualPause()
  }

  // Utils - utilidades
  const streamingDuration = useCallback(() => {
    return player.current.getDVRWindowSize() - player.current.getTargetLiveDelay();
  }, []);

  const convertToTimeCode = useCallback((time: number) => {
    return player.current.convertToTimeCode(time);
  }, []);

  const [ percentOfVideo, setPercentOfVideo ] = useState(0)

  const changePercent = () => {
    if(player.current){
      setPercentOfVideo((progressBar.current.value / progressBar.current.max) * 100)
    }
  }

  // IsLive - verificar se é uma transmissão ao vivo
  const isLive = () => {
    if(player.current && player.current.isDynamic()){
      return true
    }
    return false
  }

  // Update - atualizaçao do progress bar
  const updateProgressBar = useCallback(() => {
    if (isSeeking.current === false) {
      progressBar.current.value = player.current.time();
    }
  }, [convertToTimeCode, streamingDuration]);

  const updateProgressBarDuration = useCallback(() => {
    if (isLive()) {
      progressBar.current.max = streamingDuration();
    } else {
      progressBar.current.max = player.current.duration();
    }
  }, [convertToTimeCode, streamingDuration]);

  // Screen Data - alterações nos dados mostrados na tela

  const [durationTimecode, setDurationTimecode] = useState('');
  const [actualTimecode, setActualTimecode] = useState('');

  const timecode = useCallback(() => {
    setActualTimecode(convertToTimeCode(player.current.time()));
    setDurationTimecode(convertToTimeCode(player.current.duration()));
  }, [convertToTimeCode]);

  // Seeking - ao selecionar o progress bar
  const seeking = useCallback(() => {
    isSeeking.current = true;

    player.current.pause();
    
    clearInterval(progressInterval);
  }, [progressInterval]);

  const seekingEnd = useCallback(() => {
    player.current.seek(parseFloat(progressBar.current.value));
    
    if(!userPaused){
      player.current.play();
    }

    isSeeking.current = false;

    progressInterval = setInterval(() => {
      update()
    }, 100);
  }, [updateProgressBarDuration, updateProgressBar, userPaused]);

  const seekToLiveEdge = () => {
    if(isLive()){
      player.current.seekToOriginalLive()
    }
  }

  // Volume 

  const [userVolume, setUserVolume] = useState(0);

  const toggleVolume = useCallback(()=>{
    // userVolume ? player.current.setVolume(userVolume) : player.current.setVolume(100)
    console.log(player.current.isMuted())
  }, [])

  const setMuted = (muted: boolean) => {
    if(muted){
      player.current.setMuted(true)
    }

    player.current.setMuted(false)
  }

  const setVolume = useCallback(() => {
    const volume = volumeSlider.current.value / 100

    player.current.setVolume(volume)

    if(volume == 0){
      
    }

  }, []);

  const sliderVolumeSync = useCallback(() => {
    if(!isMobile()){
      volumeSlider.current.value = player.current.getVolume() * 100
    }
  }, []);

  //
  useEffect(() => {

    if (videoRef.current) {
      const video = videoRef.current;

      player.current = dashjs.MediaPlayer().create();

      player.current.initialize(video, url, false);
      player.current.attachView(video);
      player.current.attachTTMLRenderingDiv(subtitle.current);

      progressInterval = setInterval(() => {
        update()
      }, 100);
    }

    return () => {
      if (player.current) {
        player.current.destroy();
        player.current = null;
      }

      clearInterval(progressInterval);
    };

  }, [updateProgressBarDuration, updateProgressBar]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div ref={subtitle}></div>
        <video ref={videoRef} style={{ width: "100%" }}></video>
        <ControlBarContainer>
          <ControlBarUpper>
            <ProgressBar>
              <input ref={progressBar} type="range" onMouseDown={seeking} onTouchStart={seeking} onMouseUp={seekingEnd} onTouchEnd={seekingEnd} onChange={changePercent} style={{ width: '100%' }} step={1} />
              <div className="new-input">
                <div className="track tracks"></div>
                <div className="past tracks" style={{ width: `${percentOfVideo}%` }} ></div>
              </div>
            </ProgressBar>
          </ControlBarUpper>
          <ControlBarDown>
            <ControlBarDownLeft>
              {
                !isMobile() &&
                  <button onClick={togglePlayPause} >
                    <span style={{ fontSize: '2rem' }} className="material-symbols-rounded">
                      { isPaused ? 'play_arrow' : 'pause' }
                    </span>
                  </button>
              }
              {
                isLive() ?
                  <button className="live-button" onClick={seekToLiveEdge} >Ao Vivo</button>
                :
                  <Timecode>
                    <span className="actual">{actualTimecode}</span>
                    <span className="separator">/</span>
                    <span className="duration">{durationTimecode}</span>
                  </Timecode>
              }
            </ControlBarDownLeft>
            <ControlBarDownRight>
              {
                !isMobile() &&
                  <Volume>
                    <button onClick={toggleVolume} >
                      <span className="material-symbols-rounded">
                        volume_up
                      </span>
                    </button>
                    <div className="volume-dropdown">

                      <ProgressBar>
                        <input style={{ width: '100%' }} step={1} max={100} type="range" ref={volumeSlider} onChange={setVolume} />
                        <div className="new-input">
                          <div className="track tracks"></div>
                          <div className="past tracks"></div>
                        </div>
                      </ProgressBar>

                    </div>
                  </Volume>
              }
              <button>
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

  .live-button{
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before{
      content: '';
      width: 8px;
      height: 8px;
      background: red;
      display: block;
      border-radius: 100px;
    }
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
  }

  .past{
    background: white;
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