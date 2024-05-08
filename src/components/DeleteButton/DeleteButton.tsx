'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {
  noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/deleteNote', {
        noteId,
      });
      return response.data;
    },
  });
  const deleteButton = () => {
    const confirm = window.confirm('Are you sure to delete this note?');
    if (!confirm) return;
    deleteNote.mutate(undefined, {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };
  return (
    <Button
      variant={'destructive'}
      size={'sm'}
      onClick={deleteButton}
      disabled={deleteNote.isPending}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
