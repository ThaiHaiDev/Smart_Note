import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';

import NoteItemsHeader from '../../../components/NoteItemsHeader/NoteItemsHeader';
import { UserContext } from '../../../contexts/UserContext';
import { AddNoteRequest, Note } from '../../../shared/models/note';

import styles from './NoteItems.module.scss';

const cx = classNames.bind(styles);

interface NoteItemsProps {
    notes: Note[];
    isAddNotePage?: boolean;
    onDeleteNote?: (noteId: string, data: any) => void;
    onAddNote?: (noteData: AddNoteRequest) => void;
    activeNote?: Note;
    setActiveNote?: (id: string | number) => void;
    onReset?: () => void;
}

const NoteItems = (props: NoteItemsProps) => {
    const [activeNoteId, setActiveNoteId] = useState<string | undefined>(props.activeNote?.id);

    const userContext = useContext(UserContext);

    const onHandleClickNote = (id?: string | number) => {
        if (props.setActiveNote && id) {
            props.setActiveNote(id);
        }
    };

    const handleConfirmDeleteNote = (noteId?: string) => {
        const data = {
            user_id: userContext?.userReponse.user.id,
        };
        if (data.user_id && noteId) {
            props.onDeleteNote && props.onDeleteNote(noteId, data);
        }
    };

    useEffect(() => {
        setActiveNoteId(props.activeNote?.id);
    }, [props.activeNote]);

    return (
        <div className={cx('container')}>
            <NoteItemsHeader isAddNotePage={props.isAddNotePage} notes={props.notes} onReset={props.onReset!} />
            {props.notes.map((note: Note) => {
                return (
                    <div
                        className={cx('note', `${note?.id === activeNoteId && 'active'}`)}
                        key={note.id}
                        onClick={() => {
                            onHandleClickNote(note.id);
                        }}
                        id={note.id}
                    >
                        <div className={cx('noteTitle')}>
                            <strong>
                                {note?.note_title &&
                                    note?.note_title.slice(0, 10) + (note?.note_title.length > 10 ? '...' : '')}
                            </strong>
                            <Popconfirm
                                title="Are you sure to delete this note?"
                                placement="right"
                                onConfirm={() => handleConfirmDeleteNote(note.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined className={cx('icon-delete')} />
                            </Popconfirm>
                        </div>
                        <p>
                            {note?.note_content &&
                                note?.note_content.slice(0, 20) + (note?.note_content.length > 20 ? '...' : '')}
                        </p>
                        <small>{note?.created_at?.slice(0, 10)}</small>
                    </div>
                );
            })}
        </div>
    );
};

export default NoteItems;
