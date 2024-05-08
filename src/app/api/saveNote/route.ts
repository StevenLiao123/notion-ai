import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { noteId, editorState } = body;
        if(!noteId || !editorState) {
            return new NextResponse('Missing noteId or editorState', { status: 400 });
        }

        noteId = parseInt(noteId);
        const notes = await db.select().from($notes).where(
            eq($notes.id, noteId)
        );
        if(notes.length != 1) {
            return new NextResponse('failed to update', { status: 500 })
        }

        const note = notes[0];

        if(note.editorState !== editorState) {
            await db
                .update($notes)
                .set({
                    editorState
                }).where(
                    eq($notes.id, noteId)
                );
        }

        return NextResponse.json({
            success: 200
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false
        }, { status: 500 });
    }
}