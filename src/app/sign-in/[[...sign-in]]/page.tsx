import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="h-lvh flex justify-center items-center">
      <SignIn />
    </div>
  );
}
