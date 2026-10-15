"use client";
import { useCallback, useState, type ReactNode } from "react";

type FieldProps = {
  id?: string;
  label?: ReactNode;
  req?: boolean;
  err?: ReactNode;
  hint?: ReactNode;
  invalid?: boolean;
  full?: boolean;
  children: ReactNode;
};

export function Field({ id, label, req, err, hint, invalid, full, children }: FieldProps) {
  return (
    <div className={`field${full ? " full" : ""}${invalid ? " invalid" : ""}`}>
      {label && <label htmlFor={id}>{label}{req && <> <span className="req">*</span></>}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
      {err && <div className="err">{err}</div>}
    </div>
  );
}

/** Per-field validity flags; `validate` marks failures and focuses the first invalid control. */
export function useValidation<K extends string>() {
  const [invalid, setInvalid] = useState<Partial<Record<K, boolean>>>({});

  const validate = useCallback((checks: Record<K, boolean>, form?: HTMLFormElement | null) => {
    const bad = {} as Record<K, boolean>;
    let ok = true;
    for (const k in checks) { bad[k] = !checks[k]; if (!checks[k]) ok = false; }
    setInvalid(bad);
    if (!ok) requestAnimationFrame(() => form?.querySelector<HTMLElement>(".invalid input, .invalid textarea")?.focus());
    return ok;
  }, []);

  const clear = useCallback((k: K) => setInvalid((s) => (s[k] ? { ...s, [k]: false } : s)), []);
  const reset = useCallback(() => setInvalid({}), []);

  return { invalid, validate, clear, reset };
}
