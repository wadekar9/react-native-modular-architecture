import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, hi } from 'date-fns/locale';
import {
  Bell,
  ShoppingBag,
  Tag,
  ShieldAlert,
  MessageSquare,
  Trash2,
} from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, EFontSize, moderateScale } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';
import type { INotification, NotificationType } from '../types/notification.types';
import { useAppTranslation } from '@core/i18n';

export interface NotificationItemProps {
  notification: INotification;
  onPress?: (notification: INotification) => void;
  onDelete?: (notification: INotification) => void;
}

const getNotificationIcon = (type: NotificationType, color: string, size = 20) => {
  switch (type) {
    case 'order':
      return <ShoppingBag size={size} color={color} />;
    case 'promo':
      return <Tag size={size} color={color} />;
    case 'system':
      return <ShieldAlert size={size} color={color} />;
    case 'chat':
      return <MessageSquare size={size} color={color} />;
    default:
      return <Bell size={size} color={color} />;
  }
};

const getIconBgColor = (type: NotificationType, theme: ITheme) => {
  switch (type) {
    case 'order':
      return theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7';
    case 'promo':
      return theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7';
    case 'system':
      return theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2';
    case 'chat':
    default:
      return theme === 'dark' ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)';
  }
};

const getIconTintColor = (type: NotificationType, theme: ITheme) => {
  switch (type) {
    case 'order':
      return theme === 'dark' ? '#4ADE80' : '#16A34A';
    case 'promo':
      return theme === 'dark' ? '#FBBF24' : '#D97706';
    case 'system':
      return theme === 'dark' ? '#F87171' : '#DC2626';
    case 'chat':
    default:
      return COLORS[theme]['brand-primary'];
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const { theme } = useAppTheme();
  const { common_t, i18n } = useAppTranslation();
  const colors = COLORS[theme];
  const styles = styling(theme, notification.isRead);

  const formattedTime = React.useMemo(() => {
    try {
      const locale = i18n.resolvedLanguage === 'es' ? es : i18n.resolvedLanguage === 'hi' ? hi : enUS;
      return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale });
    } catch {
      return '';
    }
  }, [notification.createdAt, i18n.resolvedLanguage]);

  const iconTintColor = getIconTintColor(notification.type, theme);
  const iconBgColor = getIconBgColor(notification.type, theme);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(notification)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={common_t('NOTIFICATION_ACCESSIBILITY', {
        state: notification.isRead ? '' : `${common_t('UNREAD')} `,
        title: notification.title,
      })}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {getNotificationIcon(notification.type, iconTintColor, moderateScale(20))}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemeText style={styles.title} numberOfLines={1}>
            {notification.title}
          </ThemeText>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>

        <ThemeText style={styles.body} numberOfLines={2}>
          {notification.body}
        </ThemeText>

        <View style={styles.footerRow}>
          <ThemeText style={styles.timestamp}>{formattedTime}</ThemeText>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(notification)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel={common_t('DELETE_NOTIFICATION')}
            >
              <Trash2 size={moderateScale(15)} color={colors['icon-muted']} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(NotificationItem);

const styling = (theme: ITheme, isRead: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: moderateScale(14),
      paddingHorizontal: moderateScale(16),
      backgroundColor: isRead
        ? COLORS[theme].surface
        : theme === 'dark'
        ? '#1A233A'
        : '#F0F6FF',
      borderBottomWidth: 1,
      borderBottomColor: COLORS[theme].border,
    },
    iconContainer: {
      width: moderateScale(42),
      height: moderateScale(42),
      borderRadius: moderateScale(21),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(12),
      marginTop: moderateScale(2),
    },
    content: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(4),
    },
    title: {
      flex: 1,
      fontFamily: isRead ? EFonts.MEDIUM : EFonts.SEMI_BOLD,
      fontSize: EFontSize.BASE,
      color: COLORS[theme]['text-primary'],
      marginRight: moderateScale(8),
    },
    unreadDot: {
      width: moderateScale(8),
      height: moderateScale(8),
      borderRadius: moderateScale(4),
      backgroundColor: COLORS[theme]['brand-primary'],
    },
    body: {
      fontFamily: EFonts.REGULAR,
      fontSize: EFontSize.SM,
      color: COLORS[theme]['text-secondary'],
      lineHeight: moderateScale(18),
      marginBottom: moderateScale(6),
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timestamp: {
      fontFamily: EFonts.REGULAR,
      fontSize: EFontSize.XS,
      color: COLORS[theme]['text-muted'],
    },
    deleteButton: {
      padding: moderateScale(4),
    },
  });

