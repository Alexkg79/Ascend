import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type MonthSelectorProps = {
  monthDate: Date;
  onPrevious: () => void;
  onNext: () => void;
};

export function MonthSelector({ monthDate, onPrevious, onNext }: MonthSelectorProps) {
  const label = monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <View style={styles.row}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPrevious} style={styles.arrowButton}>
        <ChevronLeft size={18} color={AuthColors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.label}>{capitalized}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onNext} style={styles.arrowButton}>
        <ChevronRight size={18} color={AuthColors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  label: {
    fontFamily: AuthFonts.display,
    fontSize: 16,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
});
