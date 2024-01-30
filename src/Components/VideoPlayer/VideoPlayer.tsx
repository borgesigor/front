import dashjs from "dashjs";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const url = 
  "https://rdmedia.bbc.co.uk/testcard/simulcast/manifests/avc-full.mpd"
  // "https://dash.akamaized.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd"

export function VideoPlayerComponent() {
  const [durationText, setDurationText] = useState('');
  const [actualTimeText, setActualTimeText] = useState('');

  const videoRef = useRef(null);
  const player: any = useRef(null);
  const subtitle = useRef(null);
  const progressBar: any = useRef(null);

  let isSeeking = false;

  function streamingDuration(){
    return player.current.getDVRWindowSize() - player.current.getTargetLiveDelay()
  }

  function convertToTimeCode(time: number){
    return player.current.convertToTimeCode(time)
  }

  function updateProgressBar(){
    if(isSeeking === false){
      progressBar.current.value = player.current.time()
    }

    setActualTimeText(convertToTimeCode(streamingDuration() - player.current.time()))
  }

  function updateDuration(){
    if(player.current.isDynamic()){
      progressBar.current.max = streamingDuration()
    }else{
      progressBar.current.max = player.current.duration()
    }

    setDurationText(convertToTimeCode(streamingDuration()))
  }

  function seeking(){
    isSeeking = true;
    player.current.pause()
  }

  function seekingEnd(){

    if(!(player.current && progressBar.current)){
      throw new Error('controles não criados.')
    }

    player.current.seek(parseFloat(progressBar.current.value))
    player.current.play()

    isSeeking = false;

  }

  useEffect(() => {

    if (videoRef.current) {
      const video = videoRef.current;

      player.current = dashjs.MediaPlayer().create();

      player.current.initialize(video, url, true);
      player.current.attachView(video);
      player.current.attachTTMLRenderingDiv(subtitle.current);

      
      setInterval(()=>{
        updateDuration()
        updateProgressBar()
      }, 100)

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
      <div style={{ position: 'relative' }}>
        <div ref={subtitle}></div>
        <video ref={videoRef} autoPlay style={{ width: "100%" }} controls></video>
        <ControlBarContainer>
          <ControlBarUpper>
            <input 
              ref={progressBar}  
              type="range"
              onMouseDown={seeking}
              onMouseUp={seekingEnd}
              style={{ width: '100%' }}
              step={0.1}
            />
          </ControlBarUpper>
          <ControlBarDown>
            <Infos>
              <span>{actualTimeText}</span>
              <span>/</span>
              <span>{durationText}</span>
            </Infos>
          </ControlBarDown>
        </ControlBarContainer>
      </div>
    </>
  );
}

const Infos = styled.div`

`

const ControlBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ControlBarUpper = styled.div`

`

const ControlBarDown = styled.div`

`