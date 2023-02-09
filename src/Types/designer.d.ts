type DesignerData<T> = {
  posSize: PosSize;
  value: T;
};

type PosSize = Position & Size;

type Position = {
  x: number;
  y: number;
};

type Size = {
  w: number;
  h: number;
};
