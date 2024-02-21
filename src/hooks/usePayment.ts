import { api } from "../services/api";

export interface Payment {
    id: number,
    name: string,
    description: string,
    category: string,
    value: number,
    status: string
}

export const searchPayments = async () => {
    let payments;
    await api.get(`/financial-organizational/payment`)
    .then(response => {
        payments = response.data;
    });
    return payments;
}

export const createPayment = async (payment:any) => {
    await api.post(`/financial-organizational/payment`, payment);

}