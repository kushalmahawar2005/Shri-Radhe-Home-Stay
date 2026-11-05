"use client";

type RoomOption = { id: number; name: string };

export function RoomPicker({ rooms, selectedId }: { rooms: RoomOption[]; selectedId: number }) {
  return (
    <form action="/admin/availability" className="sm:hidden">
      <label htmlFor="room-picker" className="sr-only">Choose a room</label>
      <select
        id="room-picker"
        name="room"
        defaultValue={selectedId}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="min-h-12 w-full rounded-xl border border-gold/35 bg-cream-light px-3 text-base font-medium text-ink"
      >
        {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
      </select>
    </form>
  );
}
