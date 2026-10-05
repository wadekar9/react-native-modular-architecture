import { COLORS } from "@shared/constants/colors.constants";
import { ITheme } from "@shared/types/theme.types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 16,
  },
  cartBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS[theme].surface,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  categoriesRow: {
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS[theme].surface,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 18,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});