import { Text as DefaultText, View as DefaultView } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors, isDark } = useTheme();

  const color = isDark
    ? (darkColor ?? colors.text)
    : (lightColor ?? colors.text);

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors, isDark } = useTheme();

  const backgroundColor = isDark
    ? (darkColor ?? colors.background)
    : (lightColor ?? colors.background);

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
