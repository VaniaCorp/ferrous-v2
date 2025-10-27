import { TextUpAnimation } from "@/animations/text-animation";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useEffect, useState } from "react";

interface HeroTextProps {
  isVisible?: boolean;
}

export default function HeroText({ isVisible }: HeroTextProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isMobile } = useDeviceSize();

  useEffect(() => {
    if (isVisible) {
      // Wait for font to load before starting animation to prevent layout shifts
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          setTimeout(() => {
            setShouldAnimate(true);
          }, 50);
        });
      } else {
        // Fallback for browsers without document.fonts
        setTimeout(() => {
          setShouldAnimate(true);
        }, 200);
      }
    }
  }, [isVisible]);

  return (
    <div className="w-full max-w-7xl h-screen max-h-[50em] px-4 lg:px-16 mx-auto mt-72 flex flex-col gap-4 min-h-[400px]" style={{ contain: 'layout style' }}>
      <div className="leading-none -space-y-4">
        <TextUpAnimation as="h1" className="!font-mono" shouldAnimate={shouldAnimate}>
          WELCOME TO THE
        </TextUpAnimation> <br />
        <TextUpAnimation as="h1" className={`!font-mono ${isMobile ? "mb-2 -mt-2" : ""}`} shouldAnimate={shouldAnimate}>
          OPEN <span className="yellow-underline">TOKENIZED</span> <br />
        </TextUpAnimation>
        <TextUpAnimation as="h1" className="!font-mono max-md:mt-2" shouldAnimate={shouldAnimate}>
          GLOBAL ECONOMY
        </TextUpAnimation>
      </div>

      <p className="w-full max-w-xl">
        Ferrous is the platform that bridges local currency to a diverse portfolio of tokenized real-world assets.  We offer access to a selection of assets like gold, treasuries, bonds, and stablecoin yields, empowering them to invest with zero required crypto expertise.
      </p>
    </div>
  )
}
