import dashjs from "dashjs";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const url = 
  // "https://rdmedia.bbc.co.uk/testcard/simulcast/manifests/avc-full.mpd"
  "https://dash.akamaized.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd"

export function VideoPlayerComponent() {
  const videoRef: any = useRef(null);
  const player: any = useRef(null);
  const subtitle: any = useRef(null);
  const progressBar: any = useRef(null);
  const isSeeking: any = useRef(false);

  let progressInterval: any;

  // Update - atualizar tudo
  function update(){
    timecode()
    updateProgressBarDuration()
    updateProgressBar()
    changePercent()
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
    player.current.play();

    isSeeking.current = false;
    progressInterval = setInterval(() => {
      update()
    }, 100);
  }, [updateProgressBarDuration, updateProgressBar]);

  const seekToLiveEdge = () => {
    if(isLive()){
      player.current.seekToOriginalLive()
    }
  }

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
            <button>Play</button>
            {
              isLive() ?
                <button onClick={seekToLiveEdge} >Live</button>
              :
                <Timecode>
                  <span className="actual">{actualTimecode}</span>
                  <span className="separator">/</span>
                  <span className="duration">{durationTimecode}</span>
                </Timecode>
            }
          </ControlBarDown>
        </ControlBarContainer>
      </div>
    </>
  );
}

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
`

const ControlBarDown = styled.div`
  padding: 0.5rem 0rem;
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
      top: 0.5px;
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

  /* &:active{
    input::-webkit-slider-thumb{
      width: 1.2rem;
      height: 1.2rem;
    }
  } */
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