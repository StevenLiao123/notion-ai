import CreateNoteDialog from '@/components/CreateNoteDialog/CreateNoteDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/ui/separator';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { UserButton, auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const DashboardPage = async (props: Props) => {
  const { userId } = auth();
  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));

  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14"></div>
          <div className="flex justify-center items-center md:flex-row flow-col">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-green-600" size="sm">
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="w-4"></div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <div className="w-4"></div>
              <UserButton />
            </div>
          </div>
          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          {/** list all notes here */}
          {notes.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">You have no notes yet!</h2>
            </div>
          )}

          {/* display all notes */}
          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3 mt-3">
            <CreateNoteDialog />
            {notes.map((note) => {
              return (
                <a href={`/notebook/${note.id}`} key={note.id}>
                  <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                    <Image
                      className="border"
                      width={400}
                      height={200}
                      alt={note.name}
                      src={note.imageUrl || ''}
                    />
                    <div className="p-4">
                      <h2 className="font-semibold">{note.name}</h2>
                      <div className="h-1"></div>
                      <p className="opacity-55">
                        {new Date(note.createAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
