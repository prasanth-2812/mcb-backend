import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';
import { validateField, getFieldRules, ERROR_MESSAGES } from '../utils/validation';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onValidationChange?: (isValid: boolean, error: string | null) => void;
  fieldName: string;
  formData?: any;
  rules?: any;
  mode?: 'outlined' | 'flat';
  style?: any;
  textColor?: string;
  outlineColor?: string;
  activeOutlineColor?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
  error?: boolean;
  showError?: boolean;
  realTimeValidation?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  value,
  onChangeText,
  onValidationChange,
  fieldName,
  formData,
  rules,
  mode = 'outlined',
  style,
  textColor,
  outlineColor,
  activeOutlineColor,
  placeholder,
  placeholderTextColor,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  right,
  left,
  error = false,
  showError = true,
  realTimeValidation = true,
}) => {
  const theme = useTheme();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Get validation rules
  const validationRules = rules || getFieldRules(fieldName);

  // Validate field
  const validate = (inputValue: string) => {
    if (!realTimeValidation) return null;
    
    const error = validateField(fieldName, inputValue, validationRules, formData);
    setValidationError(error);
    
    if (onValidationChange) {
      onValidationChange(!error, error);
    }
    
    return error;
  };

  // Handle text change
  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    if (realTimeValidation) {
      validate(text);
    }
  };

  // Validate on mount if there's a value
  useEffect(() => {
    if (value && realTimeValidation) {
      validate(value);
    }
  }, [fieldName, validationRules]);

  // Clear error when field becomes focused
  const handleFocus = () => {
    setIsFocused(true);
    if (validationError && realTimeValidation) {
      setValidationError(null);
    }
  };

  // Validate when field loses focus
  const handleBlur = () => {
    setIsFocused(false);
    if (realTimeValidation) {
      validate(value);
    }
  };

  const hasError = error || (validationError && !isFocused);
  const errorMessage = validationError && !isFocused ? validationError : null;

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        mode={mode}
        style={[styles.input, style]}
        textColor={textColor}
        outlineColor={hasError ? '#F44336' : outlineColor}
        activeOutlineColor={activeOutlineColor || '#1976D2'}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        disabled={disabled}
        right={right}
        left={left}
        error={hasError}
      />
      {showError && errorMessage && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#F44336',
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
  },
});

export default ValidatedInput;
