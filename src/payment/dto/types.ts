export type CreateTransaction = {
  id?: number;
  price: number;
  name: string | 'Usuário';
  email: string;
  cpf: string;
  street?: string;
  streetNumber?: string;
  complement?: string;
  zipCode?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export type TransactionCreated = {
  transactionId: string;
  status: string;
  qrcode: string;
  httpStatus?: number;
};

export type PaymentWebhookDto = {
  idTransaction: string,
	typeTransaction: string,
	statusTransaction: string,
	e2e: string,
	paid_by: string,
	paid_doc: string,
	ispb: string
  id: string;
  amount: number;
  paymentMethod: string;
  refundedAmount: number;
  installments: number | null;
  status: string;
  postbackUrl: string | null;
  metadata: any | null;
  traceable: boolean;
  secureId: string | null;
  secureUrl: string | null;
  paidAt: string;
  ip: string;
  externalRef: string;
  externalNsu: string | null;
  releaseDate: string;
  refusedReason: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  gatewayId: string;
  companyId: string;
  customerId: string;
  cardId: string | null;
  gatewayProviderId: string;
  anticipationId: string | null;
  boleto: any | null;
  card: any | null;
  pix: {
    qrcode: string;
    url: string | null;
    expirationDate: string;
  };
  customer: {
    id: string;
    externalRef: string | null;
    name: string;
    email: string;
    phone: string | null;
    birthdate: string | null;
    createdAt: string;
    addressId: string;
    document: { type: string; number: string };
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
      complement: string;
      neighborhood: string;
      streetNumber: string;
    };
  };
  shipping: {
    fee: number;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
      complement: string;
      neighborhood: string;
      streetNumber: string;
    };
  };
  items: Array<{
    title: string;
    quantity: number;
    tangible: boolean;
    unitPrice: number;
    externalRef: string;
  }>;
  delivery: any | null;
  fee: {
    netAmount: number;
    fixedAmount: number;
    estimatedFee: number;
    spreadPercentage: number;
  };
  refunds: Array<any>;
  splits: Array<any>;
  data: PaymentWebhookDto;
};

export type CreateAgilizePayTrasactionDTO = {
  code?: string;
  amount: number;
  email: string;
  document: string;
  url: string;
};

export type AgilizePaymentResponseDTO = {
  location: string | null;
  correlationId: string;
  txid: string;
  status: string;
  chave: string;
  pixCopiaECola: string;
  qrCode: string;
};