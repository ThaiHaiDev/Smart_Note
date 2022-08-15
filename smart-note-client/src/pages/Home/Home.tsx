import { Route, Routes, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';

import SideBar from '../../components/Sidebar/Sidebar';
import NewNote from '../Note/NewNote/NewNote';

import './Home.scss';
import CategorizedNote from '../Note/Note';
import LabeledNote from '../Note/NoteLabel';

const Home = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUserContext?.userReponse) {
            navigate('/signin');
        }
    }, [currentUserContext]);

    return (
        <div className="root-home">
            <SideBar />
            <Routes>
                {currentUserContext?.userReponse && <Route path="/note/create" element={<NewNote />} />}
                {currentUserContext?.userReponse && <Route path="/category/:category_id" element={<CategorizedNote />} />}
                {currentUserContext?.userReponse && <Route path="/label/:label_id" element={<LabeledNote />} />}
            </Routes>
        </div>
    );
};

export default Home;
