import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Redux/store";
import Toast from "../Components/Toast";
import { setToasts } from "../Redux/dataSlice";

export default function ToastLayout() {
  const { toasts } = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();

  return (
    <div className="absolute bottom-5 right-8 z-50 flex flex-col-reverse items-end gap-2">
      {toasts.map((toast, toastIndex) => (
        <Toast
          key={toastIndex}
          toast={toast}
          onDismiss={() => dispatch(setToasts(toasts.filter((_, i) => i !== toastIndex)))}
        />
      ))}
    </div>
  );
}
