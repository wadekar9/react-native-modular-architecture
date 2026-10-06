import { getExampleNumber } from 'libphonenumber-js/mobile';
import metadata from 'libphonenumber-js/examples.mobile.json';
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
  type CountryCode,
} from 'libphonenumber-js';

export const getMaxLengthForCountry = (countryCode: string): number => {
  try {
    const example = getExampleNumber(countryCode as CountryCode, metadata);
    return (example?.nationalNumber.length || 15) + 10;
  } catch {
    return 25;
  }
};

export const getNationalNumberLength = (countryCode: string): number => {
  try {
    const example = getExampleNumber(countryCode as CountryCode, metadata);
    return example?.nationalNumber.length || 15;
  } catch {
    return 15;
  }
};

export const validatePhone = (phone: string, country: string): boolean => {
  try {
    return isValidPhoneNumber(phone, country as CountryCode);
  } catch {
    return false;
  }
};

export const getNationalNumber = (phone: string, country: string): string => {
  try {
    const parsed = parsePhoneNumberWithError(phone, country as CountryCode);
    return parsed.nationalNumber || phone;
  } catch {
    return phone;
  }
};

export const removeCountryCode = (phone: string, countryCode: string = 'GB'): string => {
  const phoneNumber = parsePhoneNumberFromString(phone);
  const maxLength = getMaxLengthForCountry(phoneNumber?.country || countryCode);
  return phoneNumber ? phoneNumber.nationalNumber.slice(0, maxLength) : phone;
};

export const getCountry = (phone: string): string => {
  const phoneNumber = parsePhoneNumberFromString(phone);
  return phoneNumber?.country || 'IN';
};

