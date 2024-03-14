import { api } from "../services/api";

export interface User {
    id: number,
    email: string,
}

export const login = async (email: string, password:string) => {
    let result;
    await api.post(`/financial-organizational/login`, {
        email,
        password
    }).then(response =>{ result = response.data});
    return result;
}
