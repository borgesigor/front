import { BannerComponent } from "../../Components/Banner/Banner"
import { MainComponent } from "../../Components/Main/Main";
import { VideoPlayerComponent } from "../../Components/VideoPlayer/VideoPlayer";
import { SectionOneComponent, SectionTwoComponent } from "./Sections";

export function IndexPage() {
  return ( 
    <>
      <MainComponent>

        <BannerComponent/>
        <SectionOneComponent/>
        <SectionTwoComponent/>
        {/* <VideoPlayerComponent/> */}
        
      </MainComponent>

    </>
  );
}