import { MediaPlayerClass } from "dashjs";
import React from "react";

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

class ControlBar{
  player: MediaPlayerClass

  constructor(player: MediaPlayerClass){
    this.player = player
  }


}
 
function ControlBarComponent() {
  return ( 
    <>
      
    </>
  );
}

export default ControlBarComponent;