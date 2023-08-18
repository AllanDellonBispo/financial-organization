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

//utilizar o react hook form para criar a função de cadastro

// export const createExtract = async (extract:any) => {
//     await api.post(`/extract`, extract)
//     .then(response => response.data);
// }

export const createExtract = async (extract:any) => {
    await api.post(`/financial-organizational/extract`, extract)
    .then(response => console.log(response.data));
}