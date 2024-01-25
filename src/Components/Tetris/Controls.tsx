import { BsArrowDown, BsArrowLeft, BsArrowRight, BsArrowUp } from "react-icons/bs";

export default function Controls() {
  return (
    <div className="flex flex-col items-center gap-2 rounded border-2 border-border p-2">
      <span className="text-2xl font-bold text-grey">Controls</span>

      <div className="grid grid-cols-[auto_1fr] items-center justify-items-center gap-x-2 gap-y-1">
        <kbd>
          <BsArrowDown className="text-xl" />
        </kbd>
        <span>Move Down</span>

        <kbd>
          <BsArrowLeft className="text-xl" />
        </kbd>
        <span>Move Left</span>

        <kbd>
          <BsArrowRight className="text-xl" />
        </kbd>
        <span>Move Right</span>

        <kbd>
          <BsArrowUp className="text-xl" />
        </kbd>
        <span>Rotate</span>

        <kbd>H</kbd>
        <span>Hold</span>

        <kbd>P</kbd>
        <span>Pause</span>

        <kbd>Space</kbd>
        <span>Drop</span>
      </div>
    </div>
  );
}
