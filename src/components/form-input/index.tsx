"use client";
import { useState, forwardRef, useMemo, InputHTMLAttributes } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string; // iconify icon name, e.g. "tabler:user"
  mainClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon,
      type = "text",
      className = "",
      mainClassName = "",
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = useMemo(
      () => () => setIsPasswordVisible((prev) => !prev),
      []
    );

    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    return (
      <div className={cn("relative w-full", mainClassName)}>
        {label && (
          <label className="block mb-1 font-normal text-base text-white">{label}</label>
        )}
        <div
          className={cn(
            "relative border overflow-hidden flex items-center justify-center rounded-2xl",
            isFocused ? "border-blue-450" : "border-gray-300",
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "focus-within:ring-blue-450"
          )}
        >
          {icon && (
            <span className="mr-3 ml-3 text-gray-500 border-r-2 pr-3">
              <Icon icon={icon} width={22} height={22} />
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-2 bg-white focus-visible:outline-none focus-visible:ring text-lg text-black font-medium",
              isFocused ? "border-blue-450" : "",
              error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-450",
              "disabled:pointer-events-none",
              className
            )}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-6 cursor-pointer flex items-center"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              aria-label="Toggle Password Visibility"
            >
              <Icon
                icon={
                  isPasswordVisible ? "mdi:eye-outline" : "mdi:eye-off-outline"
                }
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
        {error && (
          <span className="text-red-600 text-sm mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
