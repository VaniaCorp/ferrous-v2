// form-display.tsx
import { useState, useCallback, useEffect, useActionState } from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import rocketFlight from "@/lottie/rocket-flight-lottie.json";
import rocketFlightInitial from "@/lottie/rocket-hover-lottie.json";
import { partnerQA } from "./_data";
import FormInput from "@/components/form-input";
import { Icon } from "@iconify/react";
import { partnerSignupAction, PartnerSignupActionState } from "@/lib/actions/partner-signup";
import { toast } from "sonner";

type AnimationState = 'initial' | 'form' | 'submitting' | 'completed';

interface FormDisplayProps {
  onSubmit: () => void;
  onBack: () => void;
  animationState: AnimationState;
}

export default function FormDisplay({
  onSubmit,
  onBack,
  animationState
}: FormDisplayProps) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    company: '',
    notes: ''
  });

  // server action state
  const [state, formAction] = useActionState<PartnerSignupActionState, FormData>(
    partnerSignupAction,
    { success: true, message: undefined }
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitted(true);
    formAction(fd);
  }, [formAction]);

  useEffect(() => {
    if (!submitted) return;
    if (state.success === false) {
      toast.error(state.message || "Could not submit. Please try again.");
      return;
    }
    if (state.success === true) {
      toast.success(state.message || "Thanks! We'll be in touch.");
      onSubmit();
    }
  }, [submitted, state.success, state.message, onSubmit]);

  return (
    <div className="w-full max-w-7xl h-full mx-auto flex flex-col xl:flex-row items-center justify-center gap-8">
      {/* Form Content Area - FAQ and Form OR Welcome Message */}
      <div className="w-full flex flex-col items-center lg:flex-row gap-8 relative">
        {/* Form View */}
        {animationState === 'form' && (
          <>
            {/* FAQ Section */}
            <motion.aside
              className="relative glass backdrop-blur-lg w-full max-w-xl h-[30em] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="color-container p-4 flex flex-col overflow-x-hidden">
                <button 
                  className="w-max p-4 border rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={onBack}
                >
                  <Icon icon="mdi:arrow-left" width={24} height={24} />
                </button>
                {partnerQA.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 space-y-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + (idx * 0.1) }}
                  >
                    <header className="flex items-center gap-3">
                      <span className="inline-block w-12 h-12 bg-gray-200 rounded-xl"></span>
                      <h3>{item?.question}</h3>
                    </header>
                    <p>{item?.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.aside>

            {/* Form Section */}
            <motion.section
              className="relative glass backdrop-blur-lg w-full max-w-lg h-[40em] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form action={(fd) => { setSubmitted(true); formAction(fd as unknown as FormData); }} onSubmit={handleSubmit} className="color-container p-6 space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <FormInput
                    type="text"
                    label="Name"
                    name="fullname"
                    required
                    value={formData.fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <FormInput
                    type="text"
                    label="Company Name"
                    name="company_name"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <FormInput
                    type="email"
                    label="Email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <FormInput
                    type="text"
                    label="Message"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full p-4 text-base font-sans glass rounded-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit
                </motion.button>
              </form>
            </motion.section>
          </>
        )}

        {/* Welcome Message - Appears immediately on submit */}
        {animationState === 'submitting' && (
          <motion.div
            className="flex-1 flex items-center justify-center min-h-[40em]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="text-center space-y-8">
              <motion.h2
                className="!font-dm-mono !font-light text-5xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                We&apos;ll be in touch
              </motion.h2>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rocket Animation - Fixed position, maintains space */}
      <div className="w-[30em] h-full">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {animationState === 'submitting' ? (
            <Lottie
              animationData={rocketFlight}
              loop={true}
              className="w-full h-full"
            />) : (
            <Lottie
              animationData={rocketFlightInitial}
              loop={true}
              className="w-full h-full"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}