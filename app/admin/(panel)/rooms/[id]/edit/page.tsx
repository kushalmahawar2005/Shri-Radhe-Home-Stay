import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getRoomById } from "@/lib/db/queries";
import { RoomForm, type RoomFormData } from "@/components/admin/room-form";

export default async function EditRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const room = await getRoomById(id);
  if (!room) notFound();

  const initial: RoomFormData = {
    id: room.id,
    name: room.name,
    slug: room.slug,
    image: room.image,
    alt: room.alt,
    blurb: room.blurb,
    guests: room.guests,
    price: room.price,
    priceNight: room.priceNight,
    priceAmount: room.priceAmount,
    tagline: room.tagline,
    bed: room.bed,
    size: room.size,
    features: room.features ?? [],
    amenities: room.amenities ?? [],
    highlights: room.highlights ?? [],
    gallery: room.gallery ?? [],
    published: room.published,
  };

  return (
    <div>
      <Link
        href="/admin/rooms"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink/55 hover:text-emerald"
      >
        <ChevronLeft className="h-4 w-4" /> Back to rooms
      </Link>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
        Edit Room — {room.name}
      </h1>
      <RoomForm initial={initial} />
    </div>
  );
}
