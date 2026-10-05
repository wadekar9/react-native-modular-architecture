import { COLORS } from '@shared/constants/colors.constants';
import { ITheme } from '@shared/types/theme.types';
import { StyleSheet } from 'react-native';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].background,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 12,
  },
  error: {
    color: '#DC2626',
    marginBottom: 10,
    fontSize: 12,
  },
});

