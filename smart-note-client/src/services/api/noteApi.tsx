import axiosClient from '../../shared/axios-client/axiosClient';
import { UpdateNoteRequest } from '../../shared/models/note';
import { AddNoteRequest, NoteInfoResponse } from '../../shared/models/note';

const noteApi = {
    getByUserId(userId: string | undefined): Promise<NoteInfoResponse[]> {
        const url = `/notes/users/${userId}`;
        return axiosClient.get(url);
    },
    getByCategoryId(categoryId: string): Promise<NoteInfoResponse[]> {
        const url = `/notes/category/${categoryId}`;
        return axiosClient.get(url);
    },
    getByLabelId(labelId: string): Promise<NoteInfoResponse[]> {
        const url = `/labels/${labelId}/notes`;
        return axiosClient.get(url);
    },
    getLabelByNoteId(noteId: string | undefined): Promise<any> {
      const url = `/notes/${noteId}/labels`;
      return axiosClient.get(url);
  },
    addNote(note: AddNoteRequest): Promise<any> {
        const url = `/notes`;
        return axiosClient.post(url, note);
    },
    getAllNotes(): Promise<NoteInfoResponse[]> {
        const url = "/notes";
        return axiosClient.get(url);
    },
    updateNote(note: UpdateNoteRequest): Promise<NoteInfoResponse> {
        const url = `/notes/${note.id}`;
        return axiosClient.post(url, note);
    },
    deleteNote(noteId: string|undefined, data: any): Promise<any> {
      const url = `/notes/${noteId}`;
      return axiosClient.delete(url,data);
  }
};

export default noteApi;
