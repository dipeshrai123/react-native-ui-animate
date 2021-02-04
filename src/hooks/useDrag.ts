import * as React from "react";
import { PanResponder } from "react-native";
import { useConst } from "./useConst";
import { DragEventType, Vector2 } from "../Types";

/**
 * useDrag()
 * handles the drag gesture of animated node
 */
const useDrag = (callback: (e: DragEventType) => void) => {
  const callbackRef = useConst<(event: DragEventType) => void>(callback);

  const currentIndex = React.useRef<number>();
  const isGestureActive = React.useRef<boolean>(false);

  // Holds only movement - always starts from 0
  const movement = React.useRef<Vector2>({ x: 0, y: 0 });

  // Holds offsets
  const translation = React.useRef<Vector2>({ x: 0, y: 0 });
  const offset = React.useRef<Vector2>({ x: 0, y: 0 });
  const velocity = React.useRef<Vector2>({ x: 0, y: 0 });

  const handleCallback = () => {
    if (callbackRef) {
      callbackRef({
        args: [currentIndex.current],
        down: isGestureActive.current,
        movementX: movement.current.x,
        movementY: movement.current.y,
        offsetX: translation.current.x,
        offsetY: translation.current.y,
        velocityX: velocity.current.x,
        velocityY: velocity.current.y,
        distanceX: Math.abs(movement.current.x),
        distanceY: Math.abs(movement.current.y),
        directionX: Math.sign(movement.current.x),
        directionY: Math.sign(movement.current.y),
        cancel: () => {
          isGestureActive.current = false;
        },
      });
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isGestureActive.current = true;
        movement.current = { x: 0, y: 0 };
        offset.current = { x: translation.current.x, y: translation.current.y };
        velocity.current = { x: 0, y: 0 };

        handleCallback();
      },
      onPanResponderMove: (_, { dx, dy, vx, vy }) => {
        if (isGestureActive.current) {
          movement.current = {
            x: dx,
            y: dy,
          };

          translation.current = {
            x: offset.current.x + movement.current.x,
            y: offset.current.y + movement.current.y,
          };

          velocity.current = {
            x: vx,
            y: vy,
          };

          handleCallback();
        }
      },
      onPanResponderRelease: () => {
        if (isGestureActive.current) {
          isGestureActive.current = false;
          velocity.current = { x: 0, y: 0 };
          handleCallback();
        }
      },
    })
  );

  return () => {
    return panResponder.current.panHandlers;
  };
};

export { useDrag };
