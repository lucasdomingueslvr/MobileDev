import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  item: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  itemText: {
    fontSize: theme.fontSize.regular,
    fontWeight: 'bold',
  },
  description: {
    fontSize: theme.fontSize.small,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
});
