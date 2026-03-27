import {
  closestCorners,
  pointerWithin,
  type CollisionDetection,
} from "@dnd-kit/core";

export const kanbanCollisionDetection: CollisionDetection = (args) => {
  if (args.active.data.current?.type === "task") {
    const inside = pointerWithin(args);
    const dropZones = inside.filter((c) => String(c.id).startsWith("drop-"));
    if (dropZones.length > 0) return dropZones;
  }
  return closestCorners(args);
};
