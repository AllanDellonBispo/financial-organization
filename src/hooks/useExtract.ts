import { api } from "../services/api"

export interface Extract {
    id: number,
    date: Date,
    category: string,
    title: string,
    value: number,
    proofTransaction: File,
}

export const searchInitial = async () =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/initial`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const paymentsOfMonth = async (month: number) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/payments/month/${month}`)
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

export const searchPreviousMonth = async (month:number, year:number) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/previous/${month}/${year}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const searchNextMonth = async (month:number, year:number) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/next/${month}/${year}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const searchPeriod = async (dateInitial: String | undefined, dateFinal: String | undefined) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/filter/${dateInitial}/${dateFinal}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const searchPeriodReceipt = async (dateInitial: String | undefined, dateFinal: String | undefined) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/filter/receipt/${dateInitial}/${dateFinal}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const searchPeriodExpenses = async (dateInitial: String | undefined, dateFinal: String | undefined) =>{
    let extracts;
    await api.get(`/financial-organizational/extract/filter/expenses/${dateInitial}/${dateFinal}`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}

export const createExtract = async (extract:any) => {
    await api.post(`/financial-organizational/extract`, extract
    
    ,{
        headers:
            {'Content-Type': 'multipart/form-data'},
    })
}

export const updateExtract = async (extract:any) => {
    await api.put(`/financial-organizational/extract`, extract
    
    ,{
        headers:
            {'Content-Type': 'multipart/form-data'},
    })
}

export const deleteRecord = async (id:number) =>{
    await api.delete(`/financial-organizational/extract/delete/${id}`).then(response => console.log(response.data));

}

export const downloadFiles = (id:number) =>{
    // return `http://${api.toString()}/financial-organizational/extract/fileDownload/${id}`;
    return  `http://localhost:4000/financial-organizational/extract/fileDownload/${id}`
}

//Tratar retorno de mensagens