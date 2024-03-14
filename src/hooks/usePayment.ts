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

export const makePayment = async (id:number) => {
    await api.put(`/financial-organizational/payment/${id}`);

}

export const deletePayment = async (id:number) => {
    await api.delete(`/financial-organizational/payment/${id}`);

}