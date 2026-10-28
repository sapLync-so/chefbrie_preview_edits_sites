"use client";

import { MEAL_PREP_INTAKE_COPY, type MealPrepIntakeData } from "@/lib/meal-prep-intake";
import { SignatureField } from "@/components/SignatureField";

const fieldClass =
  "w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/35 focus-visible:ring-2 focus-visible:ring-gold-bright";

type MealPrepIntakeFormProps = {
  data: MealPrepIntakeData;
  onChange: (data: MealPrepIntakeData) => void;
};

export function MealPrepIntakeForm({ data, onChange }: MealPrepIntakeFormProps) {
  const patch = (partial: Partial<MealPrepIntakeData>) => onChange({ ...data, ...partial });

  return (
    <fieldset className="space-y-8">
      <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Meal prep intake</legend>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="intake-client-name" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Client name
          </label>
          <input
            id="intake-client-name"
            type="text"
            required
            value={data.clientName}
            onChange={(e) => patch({ clientName: e.target.value })}
            className={fieldClass}
            autoComplete="name"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="intake-email-phone" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Email / phone
          </label>
          <input
            id="intake-email-phone"
            type="text"
            required
            value={data.emailPhone}
            onChange={(e) => patch({ emailPhone: e.target.value })}
            className={fieldClass}
            autoComplete="email tel"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-center font-sans text-sm font-medium uppercase tracking-[0.15em] text-gold">
          Meal preferences
        </p>
        <p className="mb-1 font-sans text-sm font-medium text-ink/85">Food Allergies &amp; Dietary Restrictions</p>
        <p className="mb-3 font-sans text-sm leading-relaxed text-ink/65">
          Please list all known food allergies, sensitivities, intolerances, food dislikes or dietary restrictions. (If
          none write N/A)
        </p>
        <textarea
          id="intake-dietary"
          required
          rows={4}
          value={data.dietaryRestrictions}
          onChange={(e) => patch({ dietaryRestrictions: e.target.value })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-5 border-y border-border py-6 font-sans text-sm leading-relaxed text-ink/70">
        <p className="text-center">{MEAL_PREP_INTAKE_COPY.notificationResponsibility}</p>
        <div>
          <p className="mb-2 text-center font-medium uppercase tracking-[0.12em] text-ink/85">Pickup &amp; scheduling</p>
          <p className="text-center">{MEAL_PREP_INTAKE_COPY.pickupScheduling}</p>
        </div>
        <div>
          <p className="mb-2 text-center font-medium uppercase tracking-[0.12em] text-ink/85">Payment</p>
          <p className="text-center">{MEAL_PREP_INTAKE_COPY.payment}</p>
        </div>
        <div>
          <p className="mb-2 text-center font-medium uppercase tracking-[0.12em] text-ink/85">Cancellations</p>
          <p className="text-center">{MEAL_PREP_INTAKE_COPY.cancellations}</p>
        </div>
        <div>
          <p className="mb-2 text-center font-medium uppercase tracking-[0.12em] text-ink/85">Reheating &amp; storage</p>
          <p className="text-center">{MEAL_PREP_INTAKE_COPY.reheatingStorage}</p>
        </div>
      </div>

      <div>
        <p className="mb-4 text-center font-sans text-sm font-medium uppercase tracking-[0.15em] text-gold">
          Client acknowledgment
        </p>
        <p className="mb-6 text-center font-sans text-sm text-ink/70">{MEAL_PREP_INTAKE_COPY.acknowledgmentLead}</p>
        <div className="space-y-5">
          <div>
            <label htmlFor="intake-ack-name" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
              Client name
            </label>
            <input
              id="intake-ack-name"
              type="text"
              required
              value={data.acknowledgmentName}
              onChange={(e) => patch({ acknowledgmentName: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-ink/50">Client signature</p>
            <SignatureField value={data.signatureDataUrl} onChange={(signatureDataUrl) => patch({ signatureDataUrl })} />
          </div>
          <div>
            <label htmlFor="intake-date" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
              Date
            </label>
            <input
              id="intake-date"
              type="date"
              required
              value={data.signatureDate}
              onChange={(e) => patch({ signatureDate: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
