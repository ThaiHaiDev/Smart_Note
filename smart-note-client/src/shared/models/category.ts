export interface CategoryResponse {
    id: string | undefined;
    category_name: string;
    created_at?: any;
    updated_at?: any;
    user_id: number;
}

export interface AddCategoryRequest {
    category_name: string;
    user_id: string | undefined;
}

export interface AddCategoryErrorResponse {
    message: string;
    errors: {
        category_name?: string;
    };
}
