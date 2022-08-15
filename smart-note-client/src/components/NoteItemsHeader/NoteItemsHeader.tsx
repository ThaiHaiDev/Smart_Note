import { FileAddOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryContext } from '../../contexts/CategoryContext';
import { LabelContext } from '../../contexts/LabelContext';
import { CategoryResponse } from '../../shared/models/category';
import { LabelResponse } from '../../shared/models/label';
import { Note } from '../../shared/models/note';
import './NoteItemsHeader.scss';

interface NoteItemsHeaderProps {
    notes: Note[];
    isAddNotePage?: boolean;
    onReset: () => void;
}

const NoteItemsHeader = (props: NoteItemsHeaderProps) => {
    const categoryContext = useContext(CategoryContext);
    const labelContext = useContext(LabelContext);
    const [category, setCategory] = useState<CategoryResponse>();
    const [label, setLabel] = useState<LabelResponse>();
    const params = useParams();

    useEffect(() => {
        const currentActiveCategory = categoryContext?.categoryList.find(
            (category) => category.id == params.category_id,
        );
        setCategory(currentActiveCategory);
        const currentActiveLabel = labelContext?.labelList.find((label) => label.id == params.label_id);
        setLabel(currentActiveLabel);
    }, [params.category_id, categoryContext?.categoryList, params.label_id, labelContext?.labelList]);

    return (
        <header className="header">
            <div className="header-content">
                {category && <h3>{category?.category_name && category!.category_name}</h3>}
                {label && <h3>{label?.label_name && label!.label_name}</h3>}
                {!category && !label && <h3>Notes</h3>}
                {props.isAddNotePage && <FileAddOutlined className="add-icon" onClick={props.onReset} />}
            </div>
            <div className="header-totalnote">{props.notes.length} notes</div>
        </header>
    );
};

export default NoteItemsHeader;
