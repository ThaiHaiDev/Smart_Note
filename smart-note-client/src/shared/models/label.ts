export interface LabelResponse {
    id: string | undefined;
    label_name: string;
    created_at?: any;
    updated_at?: any;
    user_id?: number;
}

export interface AddLabelRequest {
    label_name: string;
    user_id: string | undefined;
}

export interface AddLabelErrorResponse {
    message: string;
    errors: {
        label_name?: string;
    };
}
