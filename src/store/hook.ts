import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect, useState } from "react";

function useDebounce(value: string | number, delay: number) {
  const [valueDebounce, setValueDebounce] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValueDebounce(value);
    }, delay);
    return () => {
      return clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return valueDebounce;
}

export default useDebounce;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
