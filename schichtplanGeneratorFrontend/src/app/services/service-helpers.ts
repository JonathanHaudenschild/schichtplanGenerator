import { HttpResponse } from "@capacitor-community/http";
import { Observable } from "rxjs";


export const getData = async (request: Promise<HttpResponse>): Promise<HttpResponse> => {
    const response = await request;
    if (response.status !== 200) {
        throw response;
    }
    return response;
}

