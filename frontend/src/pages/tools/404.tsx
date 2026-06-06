import { useLocation } from "react-router-dom";
import PanelWrapper from "../components/PanelWrapper";
import AnimatedBackground from "../components/AnimatedBackground";
import NotFoundImage from './404.png'

export default function PageNotFound()
{
  const location = useLocation();

  return (
    <div className="w-full h-dvh flex justify-center items-center font-bold">
      <div className="w-full h-dvh absolute top-0 left-0">
        <AnimatedBackground/>
      </div>
      <PanelWrapper>
        <div className="flex justify-center mb-7"><img src={NotFoundImage} className="w-30" /></div>
        <div className="text-xl w-full">
          The page
          <span className="font-bold mx-2 text-amber-300">{location.pathname}</span>
          <span>was not found!</span>
          <br/>
          <a href="/" className="w-full text-sm text-indigo-500 text-center mt-10">Go to home</a>
        </div>
      </PanelWrapper>
    </div>
  )
}