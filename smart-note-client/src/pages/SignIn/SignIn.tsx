import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { UserContext } from '../../contexts/UserContext';
import authApi from '../../services/api/authApi';
import { SignInErrorResponse, SignUpErrorResponse } from '../../shared/models/auth';
import './SignIn.scss';

interface User {
    email: string;
    password: string;
}

const UNPROCESSTABLE_CONTENT: number = 422;

const SignIn = () => {
    const navigate = useNavigate();
    const initialValues = { email: '', password: '' };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<SignInErrorResponse>();
    const userContext = useContext(UserContext);
    const currentUserContext = useContext(UserContext);

    useEffect(() => {
        if (currentUserContext?.userReponse) {
            navigate('/');
        }
    }, [currentUserContext]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        authApi
            .signIn(formValues)
            .then((userData) => {
                userContext?.setUserResponse(userData);
                localStorage.setItem('current_user', JSON.stringify(userData));
                document.location = '/';
            })
            .catch((error: AxiosError<SignUpErrorResponse>) => {
                if (error.response?.status !== UNPROCESSTABLE_CONTENT) {
                    setErrorMessage(error.response?.data);
                }
            });

        if (errors.email !== '' || errors.password !== '') {
            setErrorMessage({ message: '', errors: { email: '', password: '' } });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validate = (values: any) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const errors = { email: '', password: '' };

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!regexEmail.test(values.email)) {
            errors.email = 'Invalid email';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        }
        return errors;
    };

    return (
        <div className="signin">
            <div className="signin__container" id="container">
                <form id="registerForm" onSubmit={handleSubmit} className="signin__form">
                    <h2 className="signin__heading">Welcome to Smart Note</h2>
                    <label className="signin__form-label">Email</label>
                    <input
                        className="signin__form-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        id="signinEmail"
                        value={formValues.email}
                        onChange={handleChange}
                    />
                    {formErrors?.email && <p className="error-message">{formErrors?.email}</p>}
                    {errorMessage?.errors.email && <p className="error-message">{errorMessage?.errors.email}</p>}

                    <label className="signin__form-label">Password</label>
                    <input
                        className="signin__form-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        id="signinPassword"
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    {formErrors?.password && <p className="error-message">{formErrors?.password}</p>}
                    {errorMessage?.errors.password && <p className="error-message">{errorMessage?.errors.password}</p>}

                    <button className="signin__btn">Sign in</button>
                    <div className="signin__link">
                        <span>
                            Don't have an account?{' '}
                            <Link to="/signup" className="signup-link">
                                Sign up
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
