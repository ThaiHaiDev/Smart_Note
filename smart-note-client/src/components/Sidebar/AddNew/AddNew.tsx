import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { notification, Spin } from 'antd';
import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import clsx from 'clsx';

import { CategoryContext } from '../../../contexts/CategoryContext';
import { LabelContext } from '../../../contexts/LabelContext';
import { AddCategoryErrorResponse, AddCategoryRequest } from '../../../shared/models/category';
import { AddLabelErrorResponse, AddLabelRequest } from '../../../shared/models/label';
import categoryApi from '../../../services/api/categoryApi';
import labelApi from '../../../services/api/labelApi';
import Button from '../../Button/Button';
import Popup from '../../Popup/Popup';
import PopupConfirm from '../../Popup/PopupConfirm/PopupConfirm';

import './AddNew.scss';
import { UserResponse } from '../../../shared/models/user';

interface AddNewProps {
    userId?: string;
}

const AddNew = (props: AddNewProps) => {
    const [isPopUpShow, setIsPopUpShow] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [isShowAddCategory, setIsShowAddCategory] = useState<boolean>(false);
    const [isShowAddLabel, setIsShowAddLabel] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const navigate = useNavigate();

    const categoryContext = useContext(CategoryContext);
    const labelContext = useContext(LabelContext);

    const USER_ID: string | undefined = props.userId;

    const togglePopUp = () => {
        setIsPopUpShow(!isPopUpShow);
        isPopUpShow && setIsShowAddCategory(false);
        isPopUpShow && setIsShowAddLabel(false);
    };

    const toggleAddCategory = () => {
        setIsShowAddCategory(!isShowAddCategory);
        setInputValue('');
    };

    const toggleAddLabel = () => {
        setIsShowAddLabel(!isShowAddLabel);
        setInputValue('');
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const getUserFromLocalStorage = (): UserResponse => {
        return JSON.parse(localStorage.getItem('current_user') || '{}');
    };

    const handleAddCategory = () => {
        const newCategory: AddCategoryRequest = {
            category_name: inputValue,
            user_id: USER_ID,
        };

        setIsLoaded(false);
        if (getUserFromLocalStorage()?.token) {
            categoryApi
                .add(newCategory)
                .then((categoryResponse) => {
                    setIsLoaded(true);
                    setIsSubmitted(true);
                    categoryContext?.setCategoryList([...categoryContext.categoryList, categoryResponse]);
                    setInputValue('');
                    setIsShowAddCategory(false);
                    setIsPopUpShow(false);
                    notification.success({ placement: 'topRight', message: 'Category added successfully' });
                })
                .catch((error: AxiosError<AddCategoryErrorResponse>) => {
                    setIsLoaded(true);
                    notification.error({ placement: 'topRight', message: error.response?.data?.message });
                });
        } else {
            document.location = '/signin';
        }
    };

    const handleAddLabel = async () => {
        const newLabel: AddLabelRequest = {
            label_name: inputValue,
            user_id: USER_ID,
        };

        setIsLoaded(false);

        if (getUserFromLocalStorage()?.token) {
            labelApi
                .add(newLabel)
                .then((labelResponse) => {
                    setIsLoaded(true);
                    setIsSubmitted(true);
                    labelContext?.setLabelList([...labelContext.labelList, labelResponse]);
                    setInputValue('');
                    setIsShowAddLabel(false);
                    setIsPopUpShow(false);
                    notification.success({ placement: 'topRight', message: 'Label added successfully' });
                })
                .catch((error: AxiosError<AddLabelErrorResponse>) => {
                    setIsLoaded(true);
                    notification.error({ placement: 'topRight', message: error.response?.data?.message });
                });
        } else {
            document.location = '/signin';
        }
    };

    const handleAddNote = () => {
        navigate('/note/create');
    };
    const popupClasses = clsx('addnew__popup', {
        hidden: isShowAddCategory || isShowAddLabel,
    });

    return (
        <div className="addnew">
            {!isLoaded && (
                <div id="loader">
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
            <Button
                primary
                rounded
                large
                leftIcon={<PlusOutlined className="addnew__icon" />}
                rightIcon={
                    isPopUpShow ? (
                        <UpOutlined className="addnew__icon-small" />
                    ) : (
                        <DownOutlined className="addnew__icon-small" />
                    )
                }
                className="addnew__btn-add"
                onClick={togglePopUp}
            >
                Add New
            </Button>

            <Popup show={isPopUpShow} className={popupClasses}>
                <Button
                    primary
                    rounded
                    large
                    leftIcon={<PlusOutlined className="addnew__icon" />}
                    className="addnew__btn-add"
                    onClick={toggleAddCategory}
                >
                    Add Category
                </Button>
                <Button
                    primary
                    rounded
                    large
                    leftIcon={<PlusOutlined className="addnew__icon" />}
                    className="addnew__btn-add"
                    onClick={toggleAddLabel}
                >
                    Add Label
                </Button>
                <Button
                    primary
                    rounded
                    large
                    leftIcon={<PlusOutlined className="addnew__icon" />}
                    className="addnew__btn-add"
                    onClick={handleAddNote}
                >
                    Add Note
                </Button>
            </Popup>

            <PopupConfirm
                show={isShowAddCategory}
                title="Create new category"
                input
                placeholder="Category name"
                inputValue={inputValue}
                onChange={(e) => handleInputChange(e)}
                onClose={toggleAddCategory}
                onConfirm={handleAddCategory}
                submitted={isSubmitted}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <PopupConfirm
                show={isShowAddLabel}
                title="Create new label"
                input
                placeholder="Label name"
                inputValue={inputValue}
                onChange={(e) => handleInputChange(e)}
                onClose={toggleAddLabel}
                onConfirm={handleAddLabel}
                submitted={isSubmitted}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
            />
        </div>
    );
};
export default AddNew;
