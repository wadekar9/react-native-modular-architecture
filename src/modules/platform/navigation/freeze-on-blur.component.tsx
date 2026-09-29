import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Freeze } from 'react-freeze';

const FreezeOnBlur: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isFocused = useIsFocused();

  return <Freeze freeze={!isFocused}>{children}</Freeze>;
};

export default FreezeOnBlur;