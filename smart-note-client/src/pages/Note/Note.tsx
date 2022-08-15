import { notification, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryContext } from '../../contexts/CategoryContext';
import { UserContext } from '../../contexts/UserContext';
import noteApi from '../../services/api/noteApi';
import { AddNoteRequest, Note, NoteInfoResponse, UpdateNoteRequest } from '../../shared/models/note';
import styles from './Note.module.scss';
import NoteDetails from './NoteDetails/NoteDetails';
import NoteItems from './NoteItems/NoteItems';

const cx = classNames.bind(styles);

const CategorizedNote = () => {
    const [notesToShow, setNotesToShow] = useState<Note[]>([]);
    const [noteToShow, setNoteToShow] = useState<Note>();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const params = useParams();
    const categoryContext = useContext(CategoryContext);
    const userContext = useContext(UserContext);
    
    useEffect(() => {
        if (!userContext?.userReponse) {
            navigate('/signin');
        }
    }, []);

    useEffect(() => {
        noteApi
            .getByCategoryId(params.category_id!)
            .then((data: NoteInfoResponse[]) => {
                const lastestNoteDataSort = data.reverse();
                setIsLoaded(true);
                setNotesToShow(lastestNoteDataSort);
            })
            .catch(() => {
                setIsLoaded(true);
                notification.error({ placement: 'topRight', message: 'Failed to get resource' });
            });
    }, [params.category_id]);

    const addNoteHandler = async (noteData: AddNoteRequest) => {
        setIsLoaded(false);
        await noteApi
            .addNote(noteData)
            .then(() => {
                setIsLoaded(true);
                notification.success({ placement: 'topRight', message: 'Add note successfully' });
                setNotesToShow([noteData, ...notesToShow]);
            })
            .catch(() => {
                setIsLoaded(true);
                notification.error({ placement: 'topRight', message: 'Failed to add note' });
                return;
            });
    };

    const onUpdateNote = async (noteData: UpdateNoteRequest) => {
        setIsLoaded(false);
        await noteApi
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
            const updatedList = prevNotes.map((noteObj) => (noteObj.id === noteData.id ? noteData : noteObj));
            return updatedList;
        });
    };

    const setActiveNote = (id?: string | number, data?: Note): void => {
        const note = notesToShow.find((note: Note) => note.id === id);
        setNoteToShow(data || note);
    };

    const resetNote = () => {
        setNoteToShow(undefined);
        titleInputRef.current?.focus();
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
                isAddNotePage={false}
                activeNoteToShow={noteToShow}
                categories={categoryContext?.categoryList}
                titleRef={titleInputRef}
            />
        </div>
    );
};
export default CategorizedNote;
