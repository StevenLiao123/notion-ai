'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { Input } from '../ui/ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [note, setNote] = useState('');
  const uploadToFirebase = useMutation({
    mutationFn: async (noteId) => {
      const response = await axios.post('/api/uploadToFirebase', {
        noteId,
      });
      return response.data;
    },
  });
  const createNoteBook = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/createNoteBook', {
        name: note,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (note === '') {
      window.alert('please enter a name for your notebook');
      return;
    }
    createNoteBook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log(`created new note book with ${note_id}`);

        // hit another endpoint to upload the temp dalle url to firebase url
        uploadToFirebase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert('Failed to create a new notebook');
      },
    });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger className="h-full w-full">
          <div className="border-dashed border-2 flex border-green-600 h-full w-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
            <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
            <h2 className="font-semibold text-green-600 sm:mt-2">
              New Note Book
            </h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Note Book</DialogTitle>
            <DialogDescription>
              You can create a new note by clicking the button below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Name..."
            />
            <div className="h-4"></div>
            <div className="flex items-center gap-2">
              <Button type="reset" variant="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600"
                disabled={createNoteBook.isPending}
              >
                {createNoteBook.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNoteDialog;
