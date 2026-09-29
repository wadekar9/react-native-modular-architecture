import type { ApplicationDispatch, ApplicationStateType } from '@core/store/redux.store';
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

const useAppSelector: TypedUseSelectorHook<ApplicationStateType> = useSelector;
const useAppDispatch: () => ApplicationDispatch = useDispatch;

export { useAppSelector, useAppDispatch };