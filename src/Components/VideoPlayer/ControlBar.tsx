// import { useEffect, useRef } from "react";
// import styled from "styled-components";
// import { MediaPlayerClass } from "dashjs";

// interface Props{
//   player: MediaPlayerClass
// }

// interface ComponentsProps {
//   ProgressBar: React.RefObject<HTMLInputElement>;
// }

// export class ControlBarFunctions{
//   player: MediaPlayerClass
//   components: ComponentsProps

//   constructor(player: MediaPlayerClass, components: ComponentsProps){
//     this.player = player
//     this.components = components
//   }

//   seeking(){
//     this.player.pause()
//     console.log('teste')
//   }
// }

// function ControlBarComponent({ player }: Props) {
//   const ProgressBar = useRef(null);
//   const controls: any = ""

//   useEffect(()=>{

//     if(player.current){
//       const controls = new ControlBarFunctions(player, { ProgressBar })

//     }


//   }, [])

//   return ( 
//     <ControlBarContainer>
//       <ControlBarUpper>
//         <input 
//           ref={ProgressBar} 
//           onMouseDown={controls.seeking} 
//           type="range" 
//           style={{ width: '100%' }}
//         />
//       </ControlBarUpper>
//       <ControlBarDown>

//       </ControlBarDown>
//     </ControlBarContainer>
//   );
// }

// const ControlBarContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// `

// const ControlBarUpper = styled.div`

// `

// const ControlBarDown = styled.div`

// `

// export default ControlBarComponent;