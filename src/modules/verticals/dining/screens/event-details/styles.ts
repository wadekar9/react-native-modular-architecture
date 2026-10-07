import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: moderateScale(112),
    },
    hero: {
        height: moderateScale(310),
        justifyContent: 'space-between',
        padding: SPACING.MD,
    },
    heroShade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(7, 17, 13, 0.4)',
    },
    backButton: {
        width: moderateScale(42),
        height: moderateScale(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.FULL,
        backgroundColor: 'rgba(12, 19, 15, 0.45)',
    },
    heroCaption: {
        gap: SPACING.XS,
    },
    category: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        backgroundColor: 'rgba(27, 54, 42, 0.78)',
        borderRadius: RADIUS.XS,
        paddingHorizontal: SPACING.SM,
        paddingVertical: moderateScale(4),
    },
    heroTitle: {
        color: '#FFFFFF',
        maxWidth: '92%',
    },
    host: {
        color: 'rgba(255,255,255,0.88)',
    },
    content: {
        padding: SPACING.MD,
        gap: SPACING.LG,
    },
    summary: {
        color: COLORS[theme]['text-primary'],
    },
    facts: {
        gap: SPACING.MD,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS[theme].border,
        paddingVertical: SPACING.MD,
    },
    fact: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.MD,
    },
    factCopy: {
        flex: 1,
        gap: moderateScale(2),
    },
    factLabel: {
        color: COLORS[theme]['text-secondary'],
        fontFamily: EFonts.SEMI_BOLD,
    },
    secondary: {
        color: COLORS[theme]['text-secondary'],
    },
    section: {
        gap: SPACING.SM,
    },
    description: {
        color: COLORS[theme]['text-secondary'],
        lineHeight: 22,
    },
    includesList: {
        gap: SPACING.SM,
    },
    includeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.SM,
    },
    includeText: {
        flex: 1,
        color: COLORS[theme]['text-secondary'],
    },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.MD,
        paddingTop: SPACING.SM,
        paddingBottom: SPACING.MD,
        backgroundColor: COLORS[theme].surface,
        borderTopWidth: 1,
        borderTopColor: COLORS[theme].border,
    },
    bookButton: {
        minHeight: moderateScale(48),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.SM,
        paddingHorizontal: SPACING.LG,
        borderRadius: RADIUS.SM,
        backgroundColor: COLORS[theme]['brand-primary'],
    },
    bookLabel: {
        color: '#FFFFFF',
    },
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.LG,
        gap: SPACING.MD,
    },
    backLink: {
        padding: SPACING.SM,
    },
    linkText: {
        color: COLORS[theme]['brand-primary'],
    },
});
