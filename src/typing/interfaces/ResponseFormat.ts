import { Pagination } from "../types";

export interface IResponseFormat<T> {
    data?: T;
    message: string;
    title?: string;
    error?: {
        title: string;
        message: string;
    };
    pagination?: Pagination;
}
