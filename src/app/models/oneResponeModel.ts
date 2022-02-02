import { ResponseModel } from "./responseModel";

export interface OneResponseModel<T> extends ResponseModel{
    data:T;
}