import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import { BrowserRouter as Router } from 'react-router-dom';
import { CategoryProvider } from './contexts/CategoryContext';
import { LabelProvider } from './contexts/LabelContext';
import { UserProvider } from './contexts/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <UserProvider>
            <CategoryProvider>
                <LabelProvider>
                    <GlobalStyles>
                        <Router>
                            <App />
                        </Router>
                    </GlobalStyles>
                </LabelProvider>
            </CategoryProvider>
        </UserProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
