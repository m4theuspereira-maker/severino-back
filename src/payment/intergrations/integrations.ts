import axios from 'axios';
import {
  AGILIZE_PAY_CLIENT_ID,
  AGILIZE_PAY_URL,
  ZOLDPAY_API_KEY,
} from 'src/@common/environment-contants';
import {
  AgilizePaymentResponseDTO,
  CreateAgilizePayTrasactionDTO,
  CreateTransaction,
  TransactionCreated,
} from '../dto/types';
import { v4 as uuidv4 } from 'uuid';
export async function createTransactionZoldPay({
  price,
  name,
  email,
  cpf,
  street = 'Rua dos Inválidos',
  streetNumber = '103',
  complement = 'Casa',
  zipCode = '20231-045',
  neighborhood = 'Centro',
  city = 'Rio de Janeiro',
  state = 'RJ',
}: CreateTransaction): Promise<TransactionCreated> {
  const userExternalRef = uuidv4();
  const itemExternalRef = uuidv4();
  const data = {
    amount: price,
    customer: {
      name: name,
      email: email,
      document: {
        type: 'CPF',
        number: cpf,
      },
      externaRef: userExternalRef,
    },
    traceable: false,
    shipping: {
      fee: 0,
      address: {
        street: street,
        streetNumber: streetNumber,
        complement: complement,
        zipCode: zipCode,
        neighborhood: neighborhood,
        city: city,
        state: state.toUpperCase(),
        country: 'br',
      },
    },
    items: [
      {
        title: 'Depoisto em Plataforma',
        unitPrice: price,
        quantity: 1,
        tangible: false,
        externalRef: itemExternalRef,
      },
    ],
    paymentMethod: 'PIX',
    pix: {
      expiresInDays: 1,
    },
  };

  const response = await axios.post(
    'https://api.zoldpay.com.br/api/user/transactions',
    data,
    {
      headers: {
        Authorization: `Basic ${ZOLDPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => {
        if (status > 299) {
          console.log(' erro disgraça');
        }
        return status < 299;
      },
    },
  );

  const { id: transactionId, status, qrcode, pix } = response.data.data;

  return {
    transactionId,
    status,
    qrcode: pix.qrcode.trim(),
    httpStatus: response.data.status,
  };
}

export async function getTransactionStatus(transactionId: string) {
  const response = await axios.get(
    `https://api.zoldpay.com.br/api/user/transactions/${transactionId}`,
    {
      headers: {
        authorization: `Basic ${ZOLDPAY_API_KEY}`,
      },
    },
  );

  return response.data.data;
}

const agilizePayHeaders = () => ({
  client_id: AGILIZE_PAY_CLIENT_ID,
  accept: 'application/json',
});

export async function createAgilizePaytransaction(
  createTransactionDTO: CreateAgilizePayTrasactionDTO,
): Promise<AgilizePaymentResponseDTO> {
  const { data } = await axios.post(
    `${AGILIZE_PAY_URL}/pix`,
    createTransactionDTO,
    {
      headers: agilizePayHeaders(),
    },
  );

  return data;
}

export async function getAgilizePayTransaction(txid: string) {
  const { data } = await axios.get(`${AGILIZE_PAY_URL}/pix/${txid}`, {
    headers: agilizePayHeaders(),
    params: {
      txid,
    },
  });

  return data;
}
