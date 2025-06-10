import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface PaymentRequest {
  packageId: string;
  amount: number;
  currency?: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  paymentId: string;
  status: string;
}

export const paymentService = {
  async createPayment(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await axios.post(`${API_URL}/payments/create`, data);
    return response.data;
  },

  async verifyPayment(paymentId: string): Promise<PaymentResponse> {
    const response = await axios.get(`${API_URL}/payments/verify/${paymentId}`);
    return response.data;
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    const response = await axios.get(`${API_URL}/payments/status/${paymentId}`);
    return response.data;
  }
}; 