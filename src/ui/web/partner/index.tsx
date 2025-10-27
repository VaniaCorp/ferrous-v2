import { useState, useCallback } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "motion/react";
import rocket from "@/lottie/rocket-hover-lottie.json";
import { cn } from "@/lib/utils";
import FormDisplay from "./form-display";

type AnimationState = 'initial' | 'form' | 'submitting' | 'completed';

export default function Partner() {
  const [animationState, setAnimationState] = useState<AnimationState>('initial');
  const ballClass = "inline-block w-3 h-3 bg-white rounded-full";

  const handleBoxClick = useCallback(() => {
    if (animationState === 'initial') {
      setAnimationState('form');
    }
  }, [animationState]);

  const handleFormSubmit = useCallback(() => {
    setAnimationState('submitting');
    // Show welcome message, then after 700ms fade out and revert
    setTimeout(() => {
      setAnimationState('initial');
    }, 1000);
  }, []);

  const handleBack = useCallback(() => {
    setAnimationState('initial');
  }, []);

  return (
    <div className="relative w-full h-full xl:h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {animationState === 'initial' && (
          <motion.div 
            key="initial"
            className="w-max flex flex-col lg:flex-row mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.section 
              className="relative glass backdrop-blur-lg w-full max-w-sm xl:max-w-xl h-52 lg:h-84 rounded-2xl p-4 flex flex-col overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={handleBoxClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-olive-transparent pointer-events-none"></div>
              <h1 className="md:!text-5xl lg:!text-7xl">Why Partner With Us?</h1>

              <div className="w-max mt-auto space-x-1">
                <motion.span 
                  className={cn(ballClass)}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                ></motion.span>
                <motion.span 
                  className={cn(ballClass)}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                ></motion.span>
                <motion.span 
                  className={cn(ballClass)}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                ></motion.span>
              </div>
            </motion.section>

            <div className="absolute -bottom-14 right-0 lg:relative lg:bottom-0 lg:right-0 w-[8em] h-[8em] lg:w-[30em] lg:h-[30em] flex items-center justify-center">
              <Lottie
                animationData={rocket}
                loop
                className="w-full h-full rotate-45"
              />
            </div>
          </motion.div>
        )}

        {(animationState === 'form' || animationState === 'submitting') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full max-md:max-w-sm"
          >
            <FormDisplay 
              onSubmit={handleFormSubmit}
              onBack={handleBack}
              animationState={animationState}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}