import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { noteId } = await req.json();

        // exract the dalle url
        // upload to firebase url

        const notes = await db.select().from($notes).where(
            eq($notes.id, parseInt(noteId))
        );

        const note = notes[0];

        if(!note.imageUrl) {
            return new NextResponse('No image url', { status: 400 });
        }

        const firebase_url = await uploadFileToFirebase(note.imageUrl, note.name);

        // upload the note with firebase url
        await db.update($notes).set({
            imageUrl: firebase_url
        })
        .where(eq($notes.id, parseInt(noteId)));

        return new NextResponse('ok', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('error', { status: 500 });
    }
}