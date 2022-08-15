import { Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import classNames from 'classnames/bind';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LabelContext } from '../../../contexts/LabelContext';
import { UserContext } from '../../../contexts/UserContext';
import labelApi from '../../../services/api/labelApi';
import noteApi from '../../../services/api/noteApi';
import { CategoryResponse } from '../../../shared/models/category';
import { LabelResponse } from '../../../shared/models/label';
import { AddNoteRequest, Note, UpdateNoteRequest } from '../../../shared/models/note';
import { UserResponse } from '../../../shared/models/user';
import styles from './NoteDetails.module.scss';

const cx = classNames.bind(styles);

interface NoteDetailsProps {
    isAddNotePage: boolean;
    activeNoteToShow?: Note;
    inputRef?: React.RefObject<HTMLInputElement>;
    categories?: CategoryResponse[];
    onAddNote?: (noteData: AddNoteRequest) => void;
    onUpdateNote: (noteData: UpdateNoteRequest) => void;
    titleRef?: React.RefObject<HTMLInputElement>;
}

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const NoteDetails = (props: NoteDetailsProps) => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string | undefined | number>('');
    const [noteLabel, setNoteLabel] = useState<LabelResponse[]>([]);
    const [labels, setLabels] = useState<LabelResponse[]>([]);
    const [attachement, setAttachement] = useState<File>();
    const attachementInput = useRef<HTMLInputElement>(null);
    const params = useParams();
    const hasAttachment = props.activeNoteToShow?.attachment != null;
    const labelContext = useContext(LabelContext);
    const navigate = useNavigate();

    const USER_ID: string | undefined = useContext(UserContext)?.userReponse.user.id;

    useEffect(() => {
        setTitle(props.activeNoteToShow ? props.activeNoteToShow.note_title : '');
        setContent(props.activeNoteToShow ? props.activeNoteToShow.note_content : '');

        const currentSelectedCategoryId = props.categories?.find(
            (category) => category.id === props.activeNoteToShow?.category_id,
        )?.id;
        const uncategorizedCategoryId = props.categories?.find(
            (category) => category.category_name === 'Uncategorized',
        )?.id;
        setCategoryId(currentSelectedCategoryId || uncategorizedCategoryId);
        if (attachementInput.current !== null) {
            attachementInput.current!.value = '';
        }

        if(props.activeNoteToShow) {
            noteApi.getLabelByNoteId(props.activeNoteToShow && props.activeNoteToShow.id).then((data: LabelResponse[]) => {
                setNoteLabel(data);
            });
        }
    }, [props.activeNoteToShow?.id, params.category_id, params.label_id]);

    useEffect(() => {
        setTitle('');
        setContent('');
    }, [params]);

    useEffect(() => {
        const getLabelByUserId = (userId: string | undefined): any => {
            labelApi.getLabelByUserId(userId).then((data) => {
                setLabels(data);
            });
        };
        getLabelByUserId(USER_ID);
    }, []);

    const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget?.value);
    };

    const contentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.currentTarget?.value);
    };
    const getUserFromLocalStorage = (): UserResponse => {
        return JSON.parse(localStorage.getItem('current_user') || '{}');
    };

    const submitFormHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (props.activeNoteToShow?.id) {
            const noteData: UpdateNoteRequest = {
                id: props.activeNoteToShow.id,
                note_title: title,
                note_content: content,
                attachment: attachement,
                category_id: categoryId,
            };
            // Add add value to noteData has key is label_ids[i] and value is label that user select
            for (let i = 0; i < noteLabel.length; i++) {
                noteData[`label_ids[${i}]`] = noteLabel[i].id;
            }
            if(getUserFromLocalStorage()?.token) {
                props.onUpdateNote(noteData);
            } else {
                document.location = '/signin';
            }
        } else if (props.onAddNote) {
            const noteData: AddNoteRequest = {
                note_title: title,
                note_content: content,
                attachment: attachement,
                category_id: categoryId ? categoryId : '',
            };
            for (let i = 0; i < noteLabel.length; i++) {
                noteData[`label_ids[${i}]`] = noteLabel[i].id;
            }
            if(getUserFromLocalStorage()?.token) {
                props.onAddNote(noteData);
            }
            else {
                document.location = '/signin';
            }
        }
    };

    const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.currentTarget.files;
        const fileObject: File = files!['0'];
        setAttachement(fileObject);
    };

    const changeCategoryHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(event.currentTarget?.value);
    };

    const categories = props.categories?.map((category) => {
        const isSelectedCategory =
            category.id === props.activeNoteToShow?.category_id || category.id === params.category_id;
        if (isSelectedCategory) {
            return (
                <option selected key={category.id} value={category.id}>
                    {category.category_name}
                </option>
            );
        }
        return (
            <option key={category.id} value={category.id} className={cx('content__select-option')}>
                {category.category_name}
            </option>
        );
    });
    const addLabelHandler = (value: string[]) => {
        const data: LabelResponse[] = value.map((label) => {
            const labelId = labels.find((l) => l.label_name === label)?.id;
            return { id: labelId, label_name: label };
        });
       
        setNoteLabel(data);
    };

    const labelsByUser: React.ReactNode[] =
        labelContext?.labelList.map((label) => (
            <Option key={label.id} value={label.label_name}>
                {label.label_name}
            </Option>
        )) || [];

    return (
        <form className={cx('container')} onSubmit={submitFormHandler}>
            <div className={cx('content')}>
                <div className={cx('content__select')}>
                    <select onChange={changeCategoryHandler}>{categories}</select>
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        value={noteLabel.map((label) => label.label_name)}
                        onChange={addLabelHandler}
                        className={cx('select-tag')}
                    >
                        {labelsByUser}
                    </Select>
                </div>
                <input
                    type="text"
                    id="title"
                    value={title}
                    placeholder="Title"
                    autoFocus
                    onChange={titleChangeHandler}
                    required
                    ref={props.titleRef}
                />
                <textarea
                    id="body"
                    placeholder="Write your note here..."
                    value={content}
                    onChange={contentChangeHandler}
                    required
                ></textarea>
                <div className={cx('footer')}>
                    <div className={cx('footer__attachement')}>
                        {hasAttachment && (
                            <div>
                                <span>Attachment</span>
                                <div className={cx('footer__attachment-value')}>
                                    <ul><a href={SERVER_BASE_URL +  props.activeNoteToShow?.attachment} 
                                    download={SERVER_BASE_URL +  props.activeNoteToShow?.attachment} rel="noreferrer" target="_blank">Your attachment</a></ul>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            onChange={fileSelectedHandler}
                            className={cx('attachfile')}
                            accept="image/*,.pdf,.txt"
                            ref={attachementInput}
                        />
                    </div>

                    <button className={cx('btn-save')} type="submit">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default NoteDetails;
