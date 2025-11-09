"use client";

import { useEffect } from "react";
import { version as reactVersion } from "react";

const FLAG = "__ferrousDevtoolsVersionPatched__";

function patchDevtoolsRegisterRenderer() {
  const hook = (typeof window !== "undefined"
    ? (window as unknown as {
        __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
          [FLAG]?: boolean;
          registerRenderer?: (...args: unknown[]) => unknown;
        };
      }).__REACT_DEVTOOLS_GLOBAL_HOOK__
    : undefined);

  if (!hook || hook[FLAG] || typeof hook.registerRenderer !== "function") {
    return;
  }

  const originalRegisterRenderer = hook.registerRenderer;

  hook.registerRenderer = function patchedRegisterRenderer(
    renderer: unknown,
    ...rest: unknown[]
  ) {
    if (
      renderer &&
      typeof renderer === "object" &&
      !Array.isArray(renderer) &&
      "version" in renderer &&
      typeof (renderer as { version?: unknown }).version !== "string"
    ) {
      (renderer as { version?: string }).version = reactVersion;
    } else if (
      renderer &&
      typeof renderer === "object" &&
      !Array.isArray(renderer) &&
      !("version" in renderer)
    ) {
      (renderer as { version?: string }).version = reactVersion;
    } else if (
      renderer &&
      typeof renderer === "object" &&
      !Array.isArray(renderer) &&
      (renderer as { version?: string }).version === ""
    ) {
      (renderer as { version?: string }).version = reactVersion;
    }

    return originalRegisterRenderer.call(this, renderer, ...rest);
  };

  hook[FLAG] = true;
}

if (typeof window !== "undefined") {
  patchDevtoolsRegisterRenderer();
}

export default function ReactDevtoolsVersionPatch() {
  useEffect(() => {
    patchDevtoolsRegisterRenderer();
  }, []);

  return null;
}


