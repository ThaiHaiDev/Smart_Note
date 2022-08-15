import { DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Menu, notification, Popconfirm } from 'antd';
import { useContext, VFC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CategoryResponse } from '../../../../shared/models/category';

import 'antd/dist/antd.min.css';
import { CategoryContext } from '../../../../contexts/CategoryContext';
import { UserContext } from '../../../../contexts/UserContext';
import categoryApi from '../../../../services/api/categoryApi';
import './Categories.scss';

interface CategoryProps {
    categories?: CategoryResponse[];
}

const Categories: VFC<CategoryProps> = ({ categories }) => {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const location = useLocation();
    const URL = location.pathname.slice(0, location.pathname.lastIndexOf('/'));

    const categoryContext = useContext(CategoryContext);

    const checkURL = () => {
        if (URL === '/label') {
            return [];
        } else {
            const checkID = location.pathname.split('/')[2];
            return [checkID];
        }
    };
    const handleClick = (id: string | undefined) => {
        navigate(`/category/${id}`);
    };

    const confirm = (id: string | undefined) => {
        const data = {
            user_id: userContext?.userReponse.user.id,
        };
        categoryApi
            .delete(id, data)
            .then(() => {
                categoryContext?.setCategoryList(
                    categoryContext?.categoryList.filter((cate) => {
                        return cate.id !== id;
                    }),
                );
                navigate('/category')
                notification.success({placement: 'topRight', message: "Deleted successfully"});
            })
            .catch(() => {
                notification.success({placement: 'topRight', message: "Deleted failed"});
            });
    };

    return (
        <div className="wrapper_category">
            <Menu
                mode="inline"
                selectedKeys={checkURL()}
                style={{ margin: '0 15px 0 15px', width: 'auto', background: '#328cff', border: 'black' }}
                defaultOpenKeys={['sub1']}
            >
                <Menu.SubMenu title="Category" className="menu" key="sub1">
                    {categories?.map((cate, index: number) => {
                        return (
                            <Menu.Item key={cate.id} className="menu-item" style={{ padding: '0 10px 0 30px' }}>
                                <div
                                    className="item-click"
                                    onClick={() => {
                                        handleClick(cate.id);
                                    }}
                                >
                                    <FolderOpenOutlined />
                                    <span>{cate.category_name}</span>
                                </div>
                                <Popconfirm
                                    title="Are you sure to delete this category?"
                                    onConfirm={() => {
                                        confirm(cate.id);
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

export default Categories;
