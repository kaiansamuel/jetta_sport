export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  comment: string;
}

// Conteúdo fixo para o MVP (PRD §7.8 permite cadastro manual); editável pelo
// admin fica fora de escopo até haver demanda real por isso.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rafael M.",
    city: "Goiânia - GO",
    rating: 5,
    comment: "Comprei pelo WhatsApp e o atendimento foi rápido. Tênis chegou certinho no prazo combinado.",
  },
  {
    name: "Bianca S.",
    city: "Anápolis - GO",
    rating: 5,
    comment: "Site muito bonito e fácil de navegar. Já sabia o tamanho antes de falar com o vendedor.",
  },
  {
    name: "Diego A.",
    city: "Brasília - DF",
    rating: 4,
    comment: "Catálogo organizado e preços justos. Recomendo para quem quer comprar sem enrolação.",
  },
];

export const SOCIAL_PROOF_STATS = {
  ordersDelivered: "1.200+",
  citiesServed: "80+",
  averageRating: "4.8",
};
