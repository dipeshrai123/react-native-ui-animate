import * as React from "react";
import { useConst } from "./useConst";
import { clamp } from "../Math";
import { ScrollEventType, Vector2 } from "../Types";

/**
 * useScroll()
 * handles the scrolling gesture for scrollable elements
 */
const useScroll = (callback: (e: ScrollEventType) => void) => {
  const callbackRef = useConst<(e: ScrollEventType) => void>(callback);

  const scrollXY = React.useRef<Vector2>({
    x: 0,
    y: 0,
  });

  const previousScrollXY = React.useRef<Vector2>({
    x: 0,
    y: 0,
  });

  const isScrolling = React.useRef<boolean>(false);
  const scrollDirection = React.useRef<Vector2>({ x: 0, y: 0 });
  const _isScrolling = React.useRef<any>(-1); // For checking scrolling and add throttle

  const lastTimeStamp = React.useRef<number>(0);
  const velocity = React.useRef<Vector2>({ x: 0, y: 0 });

  const handleCallback: () => void = () => {
    if (callbackRef) {
      callbackRef({
        isScrolling: isScrolling.current,
        scrollX: scrollXY.current.x,
        scrollY: scrollXY.current.y,
        velocityX: velocity.current.x,
        velocityY: velocity.current.y,
        directionX: scrollDirection.current.x,
        directionY: scrollDirection.current.y,
      });
    }
  };

  const scrollCallback = (x: number, y: number) => {
    const now: number = Date.now();
    const deltaTime = Math.min(now - lastTimeStamp.current, 64);
    lastTimeStamp.current = now;
    const t = deltaTime / 1000; // seconds

    scrollXY.current = { x, y };

    // Clear if scrolling
    if (_isScrolling.current !== -1) {
      isScrolling.current = true;
      clearTimeout(_isScrolling.current);
    }

    _isScrolling.current = setTimeout(() => {
      isScrolling.current = false;
      scrollDirection.current = { x: 0, y: 0 };

      // Reset Velocity
      velocity.current = { x: 0, y: 0 };

      handleCallback(); // Debounce 250milliseconds
    }, 250);

    const diffX = scrollXY.current.x - previousScrollXY.current.x;
    const diffY = scrollXY.current.y - previousScrollXY.current.y;

    scrollDirection.current = {
      x: Math.sign(diffX),
      y: Math.sign(diffY),
    };

    velocity.current = {
      x: clamp(diffX / t / 1000, -5, 5),
      y: clamp(diffY / t / 1000, -5, 5),
    };

    previousScrollXY.current = {
      x: scrollXY.current.x,
      y: scrollXY.current.y,
    };

    handleCallback();
  };

  return () => ({
    onScroll: ({
      nativeEvent: {
        contentOffset: { x, y },
      },
    }: {
      nativeEvent: { contentOffset: { x: number; y: number } };
    }) => {
      scrollCallback(x, y);
    },
  });
};

export { useScroll };
