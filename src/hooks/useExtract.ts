import { api } from "../services/api"

export interface Extract {
    id: number,
    date: Date,
    category: string
    title: string,
    value: number
}

// Adicionar Axios ao projeto
export const searchInitial = async () =>{
    let extracts;
    await api.get(`/financial-organizational/extract/search/initial`)
    .then(response => {
        extracts = response.data;
    });
    return extracts;
}