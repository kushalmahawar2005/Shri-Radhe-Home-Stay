import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoomForm } from "@/components/admin/room-form";

export default function NewRoomPage() {
  return (
    <div>
      <Link
        href="/admin/rooms"
        className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm text-ink/55 hover:text-emerald"
      >
        <ChevronLeft className="h-4 w-4" /> Back to rooms
      </Link>
      <h1 className="mb-1 font-serif text-2xl font-bold text-ink">Add a room</h1>
      <p className="mb-5 text-sm text-ink/55">Add the details and photos guests will see.</p>
      <RoomForm />
    </div>
  );
}
