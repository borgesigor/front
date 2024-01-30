import dashjs from "dashjs";
import { useEffect, useRef, useState } from "react";

const url = "https://rdmedia.bbc.co.uk/testcard/simulcast/manifests/avc-full.mpd"

export function VideoPlayerComponent() {
  const videoRef = useRef(null);
  const playerRef: any = useRef(null)
  const progressBar: any = useRef(null);

  const div = useRef(null);

  const [estouEditando, setEstouEditando] = useState(Boolean);

  const editandoTrue = () => {
    setEstouEditando(true)
    console.log('era pra ser true: '+estouEditando)
  };

  const editandoFalse = () => {
    setEstouEditando(false)
    console.log('era pra ser false: '+estouEditando)
  }
  
  useEffect(() => {
    if (videoRef.current) {

      const video = videoRef.current;

      playerRef.current = dashjs.MediaPlayer().create();

      playerRef.current.initialize(video, url, true);
      playerRef.current.attachView(video);
      playerRef.current.attachTTMLRenderingDiv(div.current);

      // playerRef.current.getDVRWindowSize() // tamanho do vídeo em dvr em segundos
      // playerRef.current.seek() // ir pra onde colocar dentro da func em segundos
      // playerRef.current.isDynamic() // ve se ta ao vivo
      
      // progressBar.current.onClick
      
      setInterval(()=> {
        if(estouEditando){
          progressBar.current.max = 900 - playerRef.current.getCurrentLiveLatency()
          progressBar.current.value = playerRef.current.time()
          console.log('.')
        }
      }, 1000)

      // setInterval(()=>console.log(playerRef.current.seek(1)), 1000)


    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div ref={div}></div>
        <video ref={videoRef} autoPlay style={{ width: "100%" }} controls></video>
        <input 
          ref={progressBar}
          onMouseDown={() => editandoTrue()} 
          onMouseUp={() => editandoFalse()} 
          style={{ width: '100%' }} 
          type="range" />
      </div>
    </>
  );
}