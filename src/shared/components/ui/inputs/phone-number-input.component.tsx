import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import { ChevronDown } from 'lucide-react-native';
import { ThemeText } from '../themed';
import { useAppTheme } from '@shared/hooks';
import { removeCountryCode } from '@shared/utils/utils.helper';
import { EFonts, EFontSize, moderateScale } from '@shared/constants/styles.constants';
import { COLORS } from '@shared/constants/colors.constants';
import { ITheme } from '@shared/types/theme.types';

interface PhoneNumberInputRef {
    clear: () => void;
    blur: () => void;
    focus: () => void;
}

interface PhoneNumberInputProps extends Omit<TextInputProps, 'style' | 'editable' | 'multiline'> {
    countryCode: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    onChangeFormattedText?: (text: string) => void;
}

const PhoneNumberInput = React.forwardRef<PhoneNumberInputRef, PhoneNumberInputProps>(({
    label,
    countryCode,
    error,
    disabled = false,
    autoComplete = 'tel',
    textContentType = 'telephoneNumber',
    importantForAutofill = 'yes',
    selectionColor,
    ...props
}, ref) => {

    const { colors, theme } = useAppTheme();
    const styles = React.useMemo(() => styling(theme), [theme]);

    const inputRef = React.useRef<any>(null);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    React.useImperativeHandle(ref, () => ({
        clear: () => inputRef.current?.clear(),
        blur: () => inputRef.current?.blur(),
        focus: () => inputRef.current?.focus(),
    }), [])

    const handleFocus = React.useCallback((e: any) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    }, [props]);

    const handleBlur = React.useCallback((e: any) => {
        setIsFocused(false);
        if (props.onBlur) props.onBlur(e);
    }, [props]);

    const handleSubmitEditing = React.useCallback((e: any) => {
        if (!props.onSubmitEditing) {
            inputRef.current?.blur();
            return
        }
        props.onSubmitEditing(e);
    }, [props]);

    return (
        <View style={styles.wrapper}>
            {label && <ThemeText style={styles.label}>{label}</ThemeText>}
            <PhoneInput
                ref={inputRef}
                defaultValue={props.value}
                defaultCode={countryCode as any || 'GB'}
                layout="first"
                onChangeText={props.onChangeText}
                onChangeFormattedText={props.onChangeFormattedText}
                withDarkTheme={theme === 'dark'}
                withShadow={false}
                autoFocus={false}
                placeholder={props.placeholder || "Enter Contact Number"}
                disabled={disabled}
                textInputProps={{
                    ...props,
                    value: removeCountryCode(props.value || ''),
                    placeholderTextColor: colors['text-muted'],
                    editable: !disabled,
                    cursorColor: colors['brand-primary'],
                    selectionColor: selectionColor || colors['brand-primary'],
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    onSubmitEditing: handleSubmitEditing,
                    keyboardType: props.keyboardType || 'phone-pad',
                    returnKeyType: props.returnKeyType || 'done',
                    blurOnSubmit: props.blurOnSubmit || false,
                    autoFocus: props.autoFocus || false,
                    autoComplete: autoComplete,
                    textContentType: textContentType,
                    importantForAutofill: importantForAutofill,
                    keyboardAppearance: theme,
                    multiline: false,
                    numberOfLines: 1
                }}
                containerStyle={[styles.containerWrapper, disabled && styles.disabledContainer, isFocused && { borderColor: colors['brand-primary'] }]}
                textContainerStyle={styles.textContainer}
                codeTextStyle={{
                    fontFamily: EFonts.REGULAR,
                    fontSize: EFontSize.XL,
                    color: COLORS[theme]['text-secondary']
                }}
                textInputStyle={styles.phoneTextInput}
                flagButtonStyle={{
                    borderRightWidth: moderateScale(1.5),
                    borderRightColor: COLORS[theme].border
                }}
                renderDropdownImage={() => (
                    <View style={styles.dropdownImageWrapper}>
                        <ChevronDown width={moderateScale(12)} height={moderateScale(7)} color={colors['text-secondary']} />
                    </View>
                )}
            />

            {error && (
                <View style={styles.errorContainer}>
                    <ThemeText numberOfLines={3} style={styles.errorText} accessibilityRole="alert">{error}</ThemeText>
                </View>
            )}
        </View>
    );
});

export default React.memo(PhoneNumberInput);

const styling = (theme: ITheme) => StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    label: {
        color: COLORS[theme]['text-primary'],
        fontFamily: EFonts.BOLD,
        fontSize: EFontSize.BASE,
        textAlign: 'left',
        letterSpacing: 0.25,
        marginBottom: moderateScale(8),
    },
    containerWrapper: {
        borderWidth: moderateScale(1.5),
        borderRadius: moderateScale(6),
        backgroundColor: COLORS[theme].background,
        borderColor: COLORS[theme].border,
        height: moderateScale(50),
        overflow: 'hidden',
        padding: 0,
        width: '100%'
    },
    disabledContainer: {
        opacity: 0.6,
    },
    textContainer: {
        height: moderateScale(50),
        backgroundColor: COLORS[theme].background,
    },
    phoneTextInput: {
        flex: 1,
        height: '100%',
        padding: 0,
        fontFamily: EFonts.REGULAR,
        fontSize: EFontSize.XL,
        color: COLORS[theme]['text-secondary'],
        backgroundColor: COLORS[theme].background,
    },
    dropdownImageWrapper: {
        height: '100%',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: moderateScale(50),
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontFamily: EFonts.REGULAR,
        fontSize: EFontSize.XL,
        color: COLORS[theme]['text-primary'],
    },
    errorContainer: {
        marginTop: moderateScale(8),
    },
    errorText: {
        fontFamily: EFonts.REGULAR,
        fontSize: EFontSize.SM,
        color: COLORS[theme]['state-danger'],
        flexWrap: 'wrap',
    },
    icon: {
        height: moderateScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
});
