import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import modalStyles from '../../styles/modalStyles';
import theme from '../../styles/theme';

export default function ModalNoneScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={modalStyles.container}>
      <Text style={[modalStyles.title, { color: theme.colors.warning }]}>
        Modal None
      </Text>

      <TouchableOpacity
        style={[modalStyles.button, { backgroundColor: theme.colors.warning }]}
        onPress={() => setVisible(true)}
      >
        <Text style={modalStyles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Animação None</Text>
            <Text style={modalStyles.modalText}>
              Este modal aparece sem animação
            </Text>
            <TouchableOpacity
              style={[modalStyles.closeButton, { backgroundColor: theme.colors.warning }]}
              onPress={() => setVisible(false)}
            >
              <Text style={modalStyles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
