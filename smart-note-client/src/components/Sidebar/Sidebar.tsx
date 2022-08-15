import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { LogoutOutlined } from '@ant-design/icons';

import Profile from './Profile/Profile';
import Search from './Search/Search';
import AddNew from './AddNew/AddNew';
import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import './Sidebar.scss';

const SideBar = () => {
    const currentUserContext = useContext(UserContext);

    const handleLogout = () => {
        localStorage.removeItem('current_user');
        currentUserContext?.setUserResponse(JSON.parse(localStorage.getItem('current_user') || 'false'));
    };

    return (
        <div className="wrapper">
            <div>
                <Logo />
                {currentUserContext?.userReponse && <Profile userReponse={currentUserContext?.userReponse} />}
                <Search />
                {currentUserContext?.userReponse && <AddNew userId={currentUserContext?.userReponse.user.id} />}
                {currentUserContext?.userReponse && <Navigation userId={currentUserContext?.userReponse.user.id} />}
            </div>
            <div className="signout" onClick={handleLogout}>
                <LogoutOutlined className="icon-logout" />
                <p>Logout</p>
            </div>
        </div>
    );
};

export default SideBar;
