import { Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { CategoryContext } from '../../../contexts/CategoryContext';
import { LabelContext } from '../../../contexts/LabelContext';
import categoryApi from '../../../services/api/categoryApi';
import labelApi from '../../../services/api/labelApi';
import Categories from './Categories/Categories';
import Labels from './Labels/Labels';

interface INavigationProps {
    userId?: string;
}

const Navigation = (props: INavigationProps) => {
    const categoryContext = useContext(CategoryContext);
    const labelContext = useContext(LabelContext);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const USER_ID: string | undefined = props.userId;
    useEffect(() => {
        categoryApi.getCategoriesByUserId(USER_ID).then((data) => {
            setIsLoaded(true);
            categoryContext?.setCategoryList(data);
        });

        labelApi.getLabelByUserId(USER_ID).then((data) => {
            setIsLoaded(true);
            labelContext?.setLabelList(data);
        });
    }, []);

    return (
        <div>
            {!isLoaded && (
                <div id="loader">
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
            <Categories categories={categoryContext?.categoryList} />
            <Labels labels={labelContext?.labelList} />
        </div>
    );
};

export default Navigation;
