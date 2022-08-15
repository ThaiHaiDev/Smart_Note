import './index.scss';
import './App.css';
import {  Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';
import { SignUp } from './pages/SignUp/SignUp';


function App() {
    return (
        <div className="wrapper-content">
            <Routes>
                <Route path="/*" element={<Home/>} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </div>
    );
}

export default App;
