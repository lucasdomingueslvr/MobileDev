import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.regular,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: theme.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  modalText: {
    fontSize: theme.fontSize.regular,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.gray,
  },
  closeButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
  },
  closeButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});
