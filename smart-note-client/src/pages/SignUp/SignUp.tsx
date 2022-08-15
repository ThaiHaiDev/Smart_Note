import { notification, Spin } from 'antd';
import { AxiosError } from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, ValidationRule } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { UserContext } from '../../contexts/UserContext';
import authApi from '../../services/api/authApi';
import { SignUpData, SignUpErrorResponse } from '../../shared/models/auth';

import './SignUp.scss';

interface IFormInput {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const regexPassword: ValidationRule<RegExp> = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.]).*$/;

export const SignUp = () => {
    const [signUpSuccessfully, setSignUpSuccessfully] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<SignUpErrorResponse>();
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const navigate = useNavigate();

    const currentUserContext = useContext(UserContext);

    useEffect(() => {
        if (currentUserContext?.userReponse) {
            navigate('/');
        }
    }, [currentUserContext]);

    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm<IFormInput>();

    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit: SubmitHandler<IFormInput> = async (data: SignUpData) => {
        setIsLoaded(false);
        await authApi
            .signUp(data)
            .then(() => {
                setIsLoaded(true);
                notification.success({
                    placement: 'topRight',
                    message: 'Signed up successfully',
                });
                setSignUpSuccessfully(true);
            })
            .catch((error: AxiosError<SignUpErrorResponse>) => {
                setIsLoaded(true);
                setErrorMessage(error.response?.data);
                setSignUpSuccessfully(false);
            });
    };

    useEffect(() => {
        if (signUpSuccessfully) {
            navigate('/signin');
        }
    }, [signUpSuccessfully]);

    return (
        <div className="signup">
            {!isLoaded && (
                <div id="loader">
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
            <div className="signup__container">
                <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="signup__heading">Sign Up</h2>
                    <label className="signup__form-label">Username</label>
                    <input
                        className="signup__form-input"
                        placeholder="Enter username"
                        {...register('username', {
                            required: 'Username is required',
                            maxLength: {
                                value: 20,
                                message: 'Username must be less than 20 characters',
                            },
                        })}
                    />
                    {errors.username && <p className="error-message">{errors.username.message}</p>}
                    {errorMessage?.errors.username && <p className="error-message">{errorMessage?.message}</p>}
                    <label className="signup__form-label">Email address</label>
                    <input
                        className="signup__form-input"
                        type="email"
                        placeholder="Enter email"
                        {...register('email', {
                            required: 'Email is required',
                            minLength: 6,
                            maxLength: 50,
                        })}
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                    {errorMessage?.errors.email && <p className="error-message">{errorMessage?.message}</p>}
                    <label className="signup__form-label">Password</label>
                    <input
                        className="signup__form-input"
                        type="password"
                        placeholder="Enter password"
                        {...register('password', {
                            required: 'Password is required',
                            pattern: {
                                value: regexPassword,
                                message:
                                    'Password must be contains at least one uppercase letter, one lowercase letter and one special character.',
                            },
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters',
                            },
                            maxLength: {
                                value: 16,
                                message: 'Password must be less than 16 characters',
                            },
                        })}
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                    {errorMessage?.errors.password && <p className="error-message">{errorMessage?.message}</p>}
                    <label className="signup__form-label">Confirm password</label>
                    <input
                        className="signup__form-input"
                        type="password"
                        placeholder="Confirm password"
                        {...register('password_confirmation', {
                            required: 'Confirm password is required',
                            validate: (value) => value === password.current || 'The password does not match',
                        })}
                    />
                    {errors.password_confirmation && (
                        <p className="error-message">{errors.password_confirmation.message}</p>
                    )}
                    <button className="signup__btn">Create account</button>
                    <div className="signup__link">
                        <span>
                            Already have an account?{' '}
                            <Link to="/signin" className="signin-link">
                                Sign in
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};
