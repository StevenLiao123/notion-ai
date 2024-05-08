'use client';
import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text';
import TipTapMenuBar from '../TipTapMenuBar/TipTapMenuBar';
import { Button } from '../ui/button';
import { useDebounce } from '@/lib/useDebounce';
import { NoteType } from '@/lib/db/schema';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCompletion } from 'ai/react';

type Props = {
  note: NoteType;
};

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = useState(
    note.editorState || `<h1>New Note</h1>`
  );
  const { complete, completion } = useCompletion({
    api: '/api/completion',
  });
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/saveNote', {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        'Shift-a': () => {
          const prompt = this.editor.getText().split(' ').slice(-30).join(' ');
          console.log('prompt', prompt);
          complete(prompt);
          return true;
        },
      };
    },
  });
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });
  const lastCompletion = useRef('');

  useEffect(() => {
    if (!completion || !editor) return;

    const diff = completion.slice(lastCompletion.current.length);
    console.log('diff', diff);

    lastCompletion.current = completion;

    editor.commands.insertContent(diff);

    console.log('lastCompletion', lastCompletion.current);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  useEffect(() => {
    // save to DB
    if (debouncedEditorState === '') return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log('success updated!', data);
      },
      onError: (error) => {
        console.log('fail updated!', error);
      },
    });
    console.log(debouncedEditorState);
  }, [debouncedEditorState]);
  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant="outline">
          {saveNote.isPending ? 'Saving...' : 'Saved'}
        </Button>
      </div>
      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>

      <div className="h-4"></div>
      <span>
        Tip: press{' '}
        <kbd className="px-2 py-1.5 font-xs font-semibold text-gray-900 bg-gray-100 border border-gray-200 rounded-lg shadow-lg">
          Shift + A
        </kbd>{' '}
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
