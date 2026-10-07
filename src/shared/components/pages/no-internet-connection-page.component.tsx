import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native'
import { RotateCcw } from 'lucide-react-native'
import { useAppTheme } from '@shared/hooks';
import { IMAGES } from '@shared/assets/images';
import { moderateScale } from '@shared/constants/styles.constants';
import { EFonts, EFontSize } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';
import { COLORS } from '@shared/constants/colors.constants';
import { ThemedView, ThemeText, BaseButton } from '@shared/components/ui';

const NoInternetConnectionPage: React.FC = () => {

  const { netInfo: { isConnected }, refresh } = useNetInfoInstance();
  const navigation = useNavigation();
  const { theme, colors } = useAppTheme();
  const { t } = useTranslation();
  const common_t = (key: string): string => t(`common:${key}`, { defaultValue: key }) as string;
  const styles = styling(theme);

  React.useEffect(() => {
    if (isConnected) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [isConnected, navigation]);

  return (
    <ThemedView>
      <View style={styles.container}>
        <Image
          source={IMAGES.NETWORK_CONNECTION}
          style={{ width: moderateScale(150), height: moderateScale(150) }}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={common_t('NO_INTERNET_ILLUSTRATION')}
        />

        <View style={styles.content}>
          <ThemeText style={styles.label}>{common_t('NO_INTERNET')}</ThemeText>
          <ThemeText style={styles.description}>{common_t('CHECK_NETWORK')}</ThemeText>
          <BaseButton
            label={common_t('TRY_AGAIN')}
            LeftAccessory={<RotateCcw width={moderateScale(20)} height={moderateScale(20)} color={colors['brand-primary']} />}
            containerStyle={[styles.buttonContainer, { borderColor: colors.border }]}
            labelStyle={{ color: colors['text-primary'] }}
            onPress={refresh}
          />
        </View>
      </View>
    </ThemedView>
  )
}

export default NoInternetConnectionPage

const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(50),
    padding: moderateScale(20),
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(15),
    width: '100%'
  },
  label: {
    fontFamily: EFonts.SEMI_BOLD,
    fontSize: EFontSize['2XL'],
    color: COLORS[theme]['text-primary']
  },
  description: {
    fontFamily: EFonts.MEDIUM,
    fontSize: EFontSize.LG,
    color: COLORS[theme]['text-secondary']
  },
  buttonContainer: {
    width: 'auto',
    alignSelf: 'center',
    paddingHorizontal: moderateScale(22),
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
  }
})