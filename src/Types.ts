type GenericEventType = {
  velocityX: number;
  velocityY: number;
  directionX: number;
  directionY: number;
};

type ScrollEventType = {
  isScrolling: boolean;
  scrollX: number;
  scrollY: number;
} & GenericEventType;

type DragEventType = {
  args: Array<number | undefined>;
  down: boolean;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  distanceX: number;
  distanceY: number;
  cancel: () => void;
} & GenericEventType;

type Vector2 = { x: number; y: number };

export { ScrollEventType, Vector2, DragEventType };
