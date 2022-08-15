import './Profile.scss';
import { UserResponse } from '../../../shared/models/user';

interface IProfileProps {
    userReponse: UserResponse,
}

const Profile = (props: IProfileProps) => {
    return (
        <div className="profile">
            <img
                src={props.userReponse.user.avatar || 'https://www.w3schools.com/howto/img_avatar2.png'}
                alt="Avatar"
                className="avatar"
            />
            <div className="info">
                <p className="username">{props.userReponse.user.username}</p>
                <p className="email">{props.userReponse.user.email}</p>
            </div>
        </div>
    );
};

export default Profile;
