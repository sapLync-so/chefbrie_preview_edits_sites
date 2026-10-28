"use client";

import { useRef } from "react";

export function useFormStartedAt(): number {
  const started = useRef(Date.now());
  return started.current;
}

export type ClientSubmitMeta = {
  formStartedAt: number;
  turnstileToken?: string;
};
