import './Logo.scss';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/">
            <img
                src="https://raw.githubusercontent.com/ThaiHaiDev/StoreImage/main/logo_test.png"
                alt="Avatar"
                className="logo"
            />
        </Link>
    );
};

export default Logo;
