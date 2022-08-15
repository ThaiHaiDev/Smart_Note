import axiosClient from '../../shared/axios-client/axiosClient';
import { AddLabelRequest, LabelResponse } from '../../shared/models/label';

const labelApi = {
    getLabelByUserId(id: string|undefined): Promise<LabelResponse[]> {
        const url = `/labels/${id}`;
        return axiosClient.get(url);
    },
    add(data: AddLabelRequest): Promise<LabelResponse> {
        const url = `/labels`;
        return axiosClient.post(url, data);
    },
    delete(label_id: string|undefined, data: any): Promise<any> {
        const url = `/labels/${label_id}`;
        return axiosClient.delete(url, data);
    }
};

export default labelApi;
