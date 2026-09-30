import React from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import { LegendList, LegendListProps } from '@legendapp/list';
import { ITheme } from '@shared/types/theme.types';
import { useAppTheme } from '@shared/hooks';
import { COLORS } from '@shared/constants/colors.constants';
import { EmptyStatePage } from '@shared/components/pages';
import { moderateScale } from '@shared/constants/styles.constants';

interface AppListProps<T> extends Omit<LegendListProps<T>, 'data'> {
    data: T[] | null | undefined;
    isLoading?: boolean;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    theme?: ITheme;
    loadingComponent?: React.ReactNode;
    renderEmptyComponent?: React.ReactNode;
}

function AppList<T>({
    data,
    isLoading,
    onRefresh,
    isRefreshing = false,
    emptyTitle,
    emptyDescription,
    theme,
    loadingComponent,
    renderEmptyComponent,
    contentContainerStyle,
    ...props
}: AppListProps<T>) {
    const { theme: appTheme } = useAppTheme();
    const activeTheme = theme || appTheme;
    const colors = COLORS[activeTheme];

    if (isLoading && !data?.length) {
        return (
            <View style={styles.center}>
                {loadingComponent || (
                    <ActivityIndicator size="large" color={colors['brand-primary']} />
                )}
            </View>
        );
    }

    const emptyComponent = renderEmptyComponent ? (
        <>{renderEmptyComponent}</>
    ) : (
        <EmptyStatePage
            title={emptyTitle}
            description={emptyDescription}
        />
    );

    return (
        <LegendList
            data={data as any || []}
            estimatedItemSize={moderateScale(100)} // Reasonable default
            keyExtractor={(_item, index) => index.toString()}
            contentContainerStyle={[
                data?.length === 0 && styles.emptyContainer,
                contentContainerStyle
            ]}
            ListEmptyComponent={emptyComponent}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors['brand-primary']}
                        colors={[colors['brand-primary']]}
                    />
                ) : undefined
            }
            {...(props as any)}
        />
    );
}

export default React.memo(AppList) as typeof AppList;

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
    },
});
