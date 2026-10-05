import { StyleSheet, Switch, View } from 'react-native'
import React from 'react'
import ThemeText from '@shared/components/ui/themed/theme-text.component';
import { useAppTheme } from '@shared/hooks/app-theme.hook';

interface SettingSwitchProps {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingSwitch : React.FC<SettingSwitchProps> = ({
    label,
    description,
    value,
    disabled,
    onValueChange
}) => {

  const { colors } = useAppTheme();
  
    return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemeText variant="body5">{label}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>{description}</ThemeText>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors['brand-primary'] }}
      />
    </View>
  );
};

export default SettingSwitch;

const styles = StyleSheet.create({
  container: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  row: { flex: 1, gap: 4 },
});
