import { api } from "../services/api"

export interface Extract {
    id: number,
    date: Date,
    category: string
    title: string,
    value: number
}

export const searchInitial = async () =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/initial`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const expenses = async (month:Number) =>{
    let total;
    await api.get(`/financial-organizational/extract/search/expenses/${month}`)
    .then(response => {
        total = response.data;
    });
    return total;
}

export const receipt = async (month:Number) =>{
    let total;
    await api.get(`/financial-organizational/extract/search/receipt/${month}`)
    .then(response => {
        total = response.data;
    });
    return total;
}

export const searchPreviousMonth = async (month:number) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/previous/${month}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const searchNextMonth = async (month:number) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/next/${month}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const createExtract = async (extract:any) => {
    await api.post(`/financial-organizational/extract`, extract)
    .then(response => console.log(response.data));
}