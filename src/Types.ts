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

type Vector2 = { x: number; y: number };

export { ScrollEventType, Vector2 };
