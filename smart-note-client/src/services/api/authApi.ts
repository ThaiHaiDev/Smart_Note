import axiosClient from '../../shared/axios-client/axiosClient';
import { SignUpInfoResponse, SignUpData } from '../../shared/models/auth';
import { UserRequest, UserResponse } from '../../shared/models/user';

const authApi = {
    signUp(data: SignUpData): Promise<SignUpInfoResponse> {
        const url = `/sign-up`;
        return axiosClient.post(url, data);
    },
    signIn(data: UserRequest): Promise<UserResponse> {
        const url = `/sign-in`;
        return axiosClient.post(url, data);
    },
};

export default authApi;
