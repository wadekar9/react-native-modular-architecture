import { moderateScale } from "@shared/constants";
import { StyleSheet } from "react-native";

export const styling = () => StyleSheet.create({
    content: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(32),
  },
  section: {
    gap: moderateScale(14),
  },
  sectionTitle: {
    marginBottom: moderateScale(2),
  },
  fieldLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  themeOptions: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: moderateScale(8),
    padding: moderateScale(4),
  },
  themeOption: {
    flex: 1,
    minHeight: moderateScale(66),
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(5),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(4),
  },
  themeLabel: {
    fontSize: moderateScale(12),
  },
  languageSection: {
    marginTop: moderateScale(28),
    paddingTop: moderateScale(22),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  languageOption: {
    minHeight: moderateScale(64),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: moderateScale(10),
  },
  languageCopy: {
    gap: moderateScale(3),
  },
  languageName: {
    fontWeight: '600',
  },
  languageLabel: {
    fontSize: moderateScale(12),
  },
})