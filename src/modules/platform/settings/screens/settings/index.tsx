import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Check, Moon, Monitor, Sun } from 'lucide-react-native';
import { changeAppLanguage, SUPPORTED_LANGUAGES, useAppTranslation } from '@core/i18n';
import { ThemedScreen, ThemeText } from '@shared/components/ui';
import { moderateScale } from '@shared/constants/styles.constants';
import { useAppTheme } from '@shared/hooks';
import type { IBaseTheme } from '@shared/types/theme.types';
import { styling } from './styles';
import { ESettingsScreens } from '../../constants/screens.constants';
import type { SettingsScreenProps } from '../../types/navigation.types';

const THEME_OPTIONS: { value: IBaseTheme; key: string; Icon: typeof Monitor }[] = [
    { value: 'default', key: 'SYSTEM', Icon: Monitor },
    { value: 'light', key: 'LIGHT_MODE', Icon: Sun },
    { value: 'dark', key: 'DARK_MODE', Icon: Moon },
];


const Settings: React.FC<SettingsScreenProps<ESettingsScreens.SETTINGS>> = () => {

    const { colors, selectedTheme, changeTheme } = useAppTheme();
    const { common_t, i18n } = useAppTranslation();
    const styles = styling();
    const activeLanguage = i18n.resolvedLanguage;

    return (
        <ThemedScreen headerProps={{ title: common_t('SETTINGS'), showBackButton: true }}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <ThemeText variant="h4" style={styles.sectionTitle}>{common_t('APPEARANCE')}</ThemeText>
                    <ThemeText style={[styles.fieldLabel, { color: colors['text-secondary'] }]}>
                        {common_t('THEME')}
                    </ThemeText>
                    <View
                        accessibilityRole="radiogroup"
                        style={[styles.themeOptions, { borderColor: colors.border, backgroundColor: colors.surface }]}
                    >
                        {THEME_OPTIONS.map(({ value, key, Icon }) => {
                            const selected = selectedTheme === value;
                            return (
                                <Pressable
                                    key={value}
                                    accessibilityRole="radio"
                                    accessibilityLabel={common_t(key)}
                                    accessibilityState={{ checked: selected }}
                                    onPress={() => changeTheme(value)}
                                    style={[
                                        styles.themeOption,
                                        selected && { backgroundColor: colors['brand-primary-soft'] },
                                    ]}
                                >
                                    <Icon
                                        size={moderateScale(18)}
                                        color={selected ? colors['brand-primary'] : colors['text-secondary']}
                                    />
                                    <ThemeText
                                        numberOfLines={1}
                                        style={[
                                            styles.themeLabel,
                                            { color: selected ? colors['brand-primary'] : colors['text-secondary'] },
                                        ]}
                                    >
                                        {common_t(key)}
                                    </ThemeText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.section, styles.languageSection, { borderTopColor: colors.border }]}>
                    <ThemeText variant="h4" style={styles.sectionTitle}>{common_t('LANGUAGE')}</ThemeText>
                    <View accessibilityRole="radiogroup">
                        {SUPPORTED_LANGUAGES.map(language => {
                            const selected = activeLanguage === language.code;
                            return (
                                <Pressable
                                    key={language.code}
                                    accessibilityRole="radio"
                                    accessibilityLabel={language.nativeName}
                                    accessibilityState={{ checked: selected }}
                                    onPress={() => changeAppLanguage(language.code)}
                                    style={[styles.languageOption, { borderBottomColor: colors.border }]}
                                >
                                    <View style={styles.languageCopy}>
                                        <ThemeText style={styles.languageName}>{language.nativeName}</ThemeText>
                                        <ThemeText style={[styles.languageLabel, { color: colors['text-secondary'] }]}>
                                            {language.label}
                                        </ThemeText>
                                    </View>
                                    {selected ? <Check size={moderateScale(20)} color={colors['brand-primary']} /> : null}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </ThemedScreen>
    );
}

export default Settings