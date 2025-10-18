import useBoop from "web/src/hooks/use-boop";

export default function useAngledBoop({
  index,
  distance,
  sides,
}: {
  index: number;
  distance: number;
  sides: number;
}) {
  const angle = index * (360 / sides) - 90;

  const angleInRads = (angle * Math.PI) / 180;

  // Convert polar coordinages (angle, distance)
  // to cartesian ones (x, y), since JS uses
  // a cartesian coordinate system:
  const x = distance * Math.cos(angleInRads);
  const y = distance * Math.sin(angleInRads);

  // `normalize` is commonly called "lerp",
  // as well as Linear Interpolation. It
  // maps a value from one scale to another.
  // In this case, I want the time to vary
  // between 450ms and 600ms, with the first
  // point being the slowest, and the last
  // one being the fastest.
  //
  // It's defined below
  let timing = normalize(index, 0, 4, 450, 600);

  // `normalize` produces linear interpolation,
  // but I want there to be a *bit* of an ease;
  // I want it to appear to be slowing down,
  // as we get further into the circles.
  timing *= 1 + index * 0.22;

  const friction = normalize(index, 0, 4, 15, 40);

  const boop = useBoop({
    x,
    y,
    timing,
    scale: 1.4,
    springConfig: { tension: 180, friction },
  });

  return boop;
}

// This helper function is used in the component
function normalize(
  number: number,
  currentScaleMin: number,
  currentScaleMax: number,
  newScaleMin = 0,
  newScaleMax = 1,
) {
  // FIrst, normalize the value between 0 and 1.
  const standardNormalization =
    (number - currentScaleMin) / (currentScaleMax - currentScaleMin);

  // Next, transpose that value to our desired scale.
  return (newScaleMax - newScaleMin) * standardNormalization + newScaleMin;
}
