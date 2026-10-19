/** Genuine guest messages — word-for-word from live chefbrie.llc / testimonials-thread */
export type GuestTestimonial = {
  message: string;
  label?: string;
  tone?: "incoming" | "outgoing";
};

export const guestTestimonials: GuestTestimonial[] = [
  {
    message: "Junie tore up the hot honey chicken so fast, didn't even get a pic.",
    label: "Meal Prep Customer",
  },
  {
    message: "I had them last time you made them a few months back and they were fire 🔥",
    label: "Returning Customer",
    tone: "outgoing",
  },
  {
    message: "Heyy!! So daughter loved the oxtails and so tf did I! We tore them DOWN!!",
    label: "Meal Prep Customer",
  },
  {
    message:
      "The food was delicious. I am mad at myself for not ordering two meals 😂. It just didn't occur to me at all!",
    label: "Meal Prep Customer",
  },
  {
    message: "Everyone loved the food 🙌🏾. They wished they ordered more.",
    label: "Event Client",
    tone: "outgoing",
  },
  {
    message: "Ima need the recipe for that mac to make for the fam at home... cuzzzz Briiiii! Delicioso!",
    label: "Supper Club Guest",
  },
  {
    message:
      "The girls are still talking about it today. Thank you so much for your kindness and allowing them the opportunity to be exposed to new wonders of the world. A true blessing.",
    label: "Event Guest",
  },
  {
    message:
      "Thank you for inviting us. We had an amazing time, and the meal was spectacular. Hope you are able to rest today. Take care, and hope to see you soon.",
    label: "Supper Club Guest",
    tone: "outgoing",
  },
  {
    message:
      "So my question is... do you have any more of those deviled eggs? 😂 The short ribs? The Jamaican bun and cheese with curry tomato soup?",
    label: "Supper Club Guest",
  },
];

export const testimonialsDisclaimer =
  "Testimonials have been reformatted from genuine client messages for readability. Personal contact information has been omitted.";
