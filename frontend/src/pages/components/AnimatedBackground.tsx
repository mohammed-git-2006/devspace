import PixelBlast from "../../bits/PixelBlast";

export default function AnimatedBackground()
{
  return <PixelBlast
      variant="square"
      pixelSize={4}
      color="#9D4EDD"
      patternScale={2}
      patternDensity={1}
      pixelSizeJitter={0}
      enableRipples
      rippleSpeed={0.4}
      rippleThickness={0.12}
      rippleIntensityScale={1.5}
      liquid={false}
      liquidStrength={0.12}
      liquidRadius={1.2}
      liquidWobbleSpeed={5}
      speed={0.5}
      edgeFade={0.25}
      transparent
    />
}