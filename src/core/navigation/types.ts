export type PlatformParamList = {
  Profile: undefined;
  Payment: undefined;
};

export const openVertical = (
  navigate: (verticalId: string) => void,
  verticalId: string,
): void => {
  navigate(verticalId);
};