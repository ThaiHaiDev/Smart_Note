import { AxiosError } from 'axios';

export interface Note {
    id?: string;
    category_id?: number | string;
    note_title: string;
    note_content: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    attachment?: any,
    [key: string]: any
}

export interface AddNoteRequest extends Note {
    attachment: File | undefined;
}

export interface UpdateNoteRequest extends Note {
    attachment?: File | undefined;
}

export interface NoteInfoResponse extends Note {
    user_id: number;
    attachment?: string;
}

export interface NoteResponseMessage {
    note: NoteInfoResponse;
    message: string;
}

export interface NoteDetailProps {
    activeNote: boolean;
    onAddNote: () => void;
    isAddNotePage: boolean;
    message: NoteResponseMessage | AxiosError;
}
