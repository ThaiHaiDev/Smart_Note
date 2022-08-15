import { Menu, notification, Popconfirm } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { TagsOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { useContext, VFC } from 'react';
import { LabelResponse } from '../../../../shared/models/label';

import './Labels.scss';
import 'antd/dist/antd.min.css';
import { UserContext } from '../../../../contexts/UserContext';
import { LabelContext } from '../../../../contexts/LabelContext';
import labelApi from '../../../../services/api/labelApi';

interface LabelProps {
    labels?: LabelResponse[];
}

const Labels: VFC<LabelProps> = ({ labels }) => {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const labelContext = useContext(LabelContext);
    const location = useLocation();
    const checkURL = () => {
        const URL = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
        if (URL === '/category') {
            return [];
        } else {
            const checkID = location.pathname.split('/')[2];
            return [checkID];
        }
    };

    const handleClick = (id: string | undefined) => {
        navigate(`/label/${id}`);
    };

    const confirm = (id: string | undefined) => {
        const data = {
            user_id: userContext?.userReponse.user.id,
        };
        labelApi
            .delete(id, data)
            .then(() => {
                labelContext?.setLabelList(
                    labelContext?.labelList.filter((label) => {
                        return label.id !== id;
                    }),
                );
                navigate('/label');
                notification.success({placement: 'topRight', message: "Deleted successfully"});
            })
            .catch(() => {
                notification.success({placement: 'topRight', message: "Deleted failed"});

            });
    };

    return (
        <div className="wrapper_label">
            <Menu
                mode="inline"
                selectedKeys={checkURL()}
                defaultOpenKeys={['sub1']}
                style={{ margin: '0 15px 0 15px', width: 'auto', background: '#328cff', border: 'black' }}
            >
                <Menu.SubMenu title="Label" className="menu" key="sub1">
                    {labels?.map((label, index: number) => {
                        return (
                            <Menu.Item key={label.id} className="menu-item" style={{ padding: '0 10px 0 30px' }}>
                                <div
                                    className="item-click"
                                    onClick={() => {
                                        handleClick(label.id);
                                    }}
                                >
                                    <TagsOutlined />
                                    <span>{label.label_name}</span>
                                </div>
                                <Popconfirm
                                    title="Are you sure to delete this label?"
                                    onConfirm={() => {
                                        confirm(label.id);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined className="icon-delete" />
                                </Popconfirm>
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
            </Menu>
        </div>
    );
};

export default Labels;
