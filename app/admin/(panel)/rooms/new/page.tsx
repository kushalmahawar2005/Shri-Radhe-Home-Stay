import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoomForm } from "@/components/admin/room-form";

export default function NewRoomPage() {
  return (
    <div>
      <Link
        href="/admin/rooms"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink/55 hover:text-emerald"
      >
        <ChevronLeft className="h-4 w-4" /> Back to rooms
      </Link>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">Add Room</h1>
      <RoomForm />
    </div>
  );
}
