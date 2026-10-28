"use client";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Hidden from users; bots that fill this field fail server validation. */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
      <label htmlFor="company_website">Company website</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
