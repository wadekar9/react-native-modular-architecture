export interface IMediaFile {
  name: string;
  type: string;
  uri: string;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}