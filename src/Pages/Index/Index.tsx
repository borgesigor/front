import { BannerComponent } from "../../Components/Banner/Banner"
import { MainComponent } from "../../Components/Main/Main";
import SectionOne from "./Sections/One";

export function IndexPage() {
  return ( 
    <>
      <MainComponent>

        <BannerComponent/>
        <SectionOne/>
        
      </MainComponent>

    </>
  );
}