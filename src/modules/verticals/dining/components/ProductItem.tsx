import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CatalogProduct } from '@modules/catalog/catalog.api';
import { ThemeText } from '@shared/components/ui';
import { ITheme } from '@shared/types/theme.types';
import { COLORS } from '@shared/constants/colors.constants';

interface ProductItemProps {
    theme: ITheme;
    product: CatalogProduct;
    handleAddToCart: (product: CatalogProduct) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ theme, product, handleAddToCart }) => {
    return (
        <View style={styles.productCard}>
            <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
            <View style={styles.productDetails}>
                <Text style={[styles.badge, { color: COLORS[theme]['brand-primary'] }]}>{product.category}</Text>
                <ThemeText variant="h4" style={styles.productTitle}>{product.title}</ThemeText>
                <ThemeText variant="body5" style={{ color: COLORS[theme]['text-muted'] }}>
                    {product.brand} • {product.rating}★
                </ThemeText>
                <View style={styles.metaRow}>
                    <ThemeText variant="h4">${product.price}</ThemeText>
                    <Pressable
                        onPress={() => handleAddToCart(product)}
                        style={[styles.cta, { backgroundColor: COLORS[theme]['brand-primary'] }]}
                    >
                        <Text style={[styles.ctaText, { color: COLORS[theme].surface }]}>Add</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default ProductItem

const styles = StyleSheet.create({
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    thumbnail: {
        width: 120,
        height: 120,
        backgroundColor: '#F3F4F6',
    },
    productDetails: {
        flex: 1,
        padding: 12,
        gap: 8,
    },
    badge: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    productTitle: {
        marginTop: -2,
        fontSize: 18,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    cta: {
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    ctaText: {
        fontWeight: '700',
    }
})