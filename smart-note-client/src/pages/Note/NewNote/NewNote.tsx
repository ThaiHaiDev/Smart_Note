import { notification, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../../../contexts/CategoryContext';
import { UserContext } from '../../../contexts/UserContext';
import noteApi from '../../../services/api/noteApi';
import { AddNoteRequest, Note, NoteInfoResponse, UpdateNoteRequest } from '../../../shared/models/note';
import styles from '../Note.module.scss';
import NoteDetails from '../NoteDetails/NoteDetails';
import NoteItems from '../NoteItems/NoteItems';

const cx = classNames.bind(styles);

const NewNote = () => {
    const [notesToShow, setNotesToShow] = useState<Note[]>([]);
    const [noteToShow, setNoteToShow] = useState<Note>();
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const noteTitleInput = useRef<HTMLInputElement>(null);

    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const user_id: string = userContext!.userReponse.user.id;
    const categoryContext = useContext(CategoryContext);

    useEffect(() => {
        if (!userContext?.userReponse) {
            navigate('/signin');
        }
    }, []);

    useEffect(() => {
        setIsLoaded(false);
        noteApi.getByUserId(user_id).then((data: NoteInfoResponse[]) => {
            const lastestNoteDataSort = data.reverse();
            setIsLoaded(true);
            setNotesToShow(lastestNoteDataSort);
        });
    }, []);

    const addNoteHandler = (noteData: AddNoteRequest) => {
        setIsLoaded(false);
        noteApi
            .addNote(noteData)
            .then((noteInfoResponse) => {
                setIsLoaded(true);
                notification.success({ placement: 'topRight', message: 'Add note successfully' });
                setNotesToShow([noteInfoResponse, ...notesToShow]);
                setActiveNote(noteInfoResponse.id);
            })
            .catch(() => {
                setIsLoaded(true);
                notification.error({ placement: 'topRight', message: 'Failed to add note' });
                return;
            });
    };

    const onUpdateNote = (noteData: UpdateNoteRequest) => {
        setIsLoaded(false);
        noteApi
            .updateNote(noteData)
            .then((noteInfoResponse) => {
                setIsLoaded(true);
                setActiveNote(noteInfoResponse.id, noteInfoResponse);
                updateNoteList(noteInfoResponse);
                notification.success({ placement: 'topRight', message: 'Update note successfully' });
            })
            .catch(() => {
                setIsLoaded(true);
                notification.error({ placement: 'topRight', message: 'Failed to update note' });
            });
    };

    const updateNoteList = (noteData: Note): void => {
        setNotesToShow((prevNotes): Note[] => {
            const updatedList = prevNotes.map((note) => (note.id === noteData.id ? noteData : note));
            return updatedList;
        });
    };

    const setActiveNote = (id?: string | number, data?: Note): void => {
        const note = notesToShow.find((note: Note) => note.id === id);
        setNoteToShow(data || note);
    };

    const resetNote = () => {
        setNoteToShow(undefined);
        noteTitleInput.current?.focus();
    };

    const onDeleteNote = (noteId?: string, data?: any): void => {
        noteApi
            .deleteNote(noteId, data)
            .then(() => {
                setNotesToShow(notesToShow.filter((note: Note) => note.id !== noteId));
                setNoteToShow(undefined);
                notification.success({ placement: 'topRight', message: 'Deleted note successfully' });
            })
            .catch(() => {
                notification.error({ placement: 'topRight', message: 'Failed to delete note' });
            });
    };

    return (
        <div className={cx('wrapper-content')}>
            {!isLoaded && (
                <div id="loader">
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
            <NoteItems
                isAddNotePage={true}
                notes={notesToShow}
                onAddNote={addNoteHandler}
                activeNote={noteToShow}
                setActiveNote={setActiveNote}
                onReset={resetNote}
                onDeleteNote={onDeleteNote}
            />
            <NoteDetails
                onAddNote={addNoteHandler}
                onUpdateNote={onUpdateNote}
                isAddNotePage={true}
                activeNoteToShow={noteToShow}
                categories={categoryContext?.categoryList}
                titleRef={noteTitleInput}
            />
        </div>
    );
};

export default NewNote;
