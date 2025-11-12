let fontReadyPromise: Promise<void> | null = null;

export function waitForFonts(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  const fonts = (document as Document & {
    fonts?: FontFaceSet & { status?: string };
  }).fonts;

  if (!fonts) {
    return Promise.resolve();
  }

  if (fonts.status === "loaded") {
    return Promise.resolve();
  }

  if (!fontReadyPromise || fonts.status === "loading") {
    fontReadyPromise = fonts.ready
      .then(() => {
        fontReadyPromise = null;
      })
      .catch(() => {
        fontReadyPromise = null;
      })
      .then(() => undefined);
  }

  return fontReadyPromise ?? Promise.resolve();
}


