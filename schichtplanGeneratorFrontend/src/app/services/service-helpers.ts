import { HttpResponse } from "@capacitor-community/http";
import { Observable } from "rxjs";


export const getData = async (request: Promise<HttpResponse>): Promise<HttpResponse> => {
    const response = await request;
    console.log(response)
    if (response.status !== 200 && response.status !== 201) {
        throw response;
    }
    return response;
}

