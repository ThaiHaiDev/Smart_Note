import axiosClient from '../../shared/axios-client/axiosClient';
import { CategoryResponse, AddCategoryRequest } from '../../shared/models/category';

const categoryApi = {
    getCategoriesByUserId(id: string|undefined): Promise<CategoryResponse[]> {
        const url = `/categories/${id}`;
        return axiosClient.get(url);
    },
    add(data: AddCategoryRequest): Promise<CategoryResponse> {
        const url = `/categories`;
        return axiosClient.post(url, data);
    },
    delete(category_id: string|undefined, data: any): Promise<any> {
        const url = `/categories/${category_id}`;
        return axiosClient.delete(url, data);
    }
};

export default categoryApi;
