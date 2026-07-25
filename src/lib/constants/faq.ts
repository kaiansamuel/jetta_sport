export interface FaqItem {
  question: string;
  answer: string;
}

// Conteúdo fixo para o MVP, mesmo tratamento dado aos depoimentos
// (ver src/lib/constants/testimonials.ts).
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como faço para comprar?",
    answer:
      "Escolha o produto, selecione cor e numeração, adicione ao carrinho e finalize pelo WhatsApp. Nosso time confirma estoque, frete e forma de pagamento diretamente na conversa.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "O pagamento é combinado diretamente com o vendedor pelo WhatsApp após a confirmação do pedido.",
  },
  {
    question: "Como funciona o frete?",
    answer:
      "O valor exato do frete é calculado e confirmado pelo vendedor durante o atendimento, com base no seu CEP.",
  },
  {
    question: "Posso trocar o produto?",
    answer:
      "Sim. Consulte nossa página de política de troca para prazos e condições.",
  },
  {
    question: "Preciso criar uma conta para comprar?",
    answer: "Não. Você pode montar seu carrinho e finalizar o pedido sem cadastro.",
  },
];
