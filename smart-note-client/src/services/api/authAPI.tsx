import axiosClient from '../../shared/axios-client/axiosClient';
import { UserRequest, UserResponse } from '../../shared/models/user';

const authApi = {
    signIn(data: UserRequest): Promise<UserResponse> {
        const url = `/sign-in`;
        return axiosClient.post(url, data);
    },
}

export default authApi;