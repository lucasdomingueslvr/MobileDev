import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import modalStyles from '../../styles/modalStyles';
import theme from '../../styles/theme';

export default function ModalFadeScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={modalStyles.container}>
      <Text style={[modalStyles.title, { color: theme.colors.secondary }]}>
        Modal Fade
      </Text>

      <TouchableOpacity
        style={[modalStyles.button, { backgroundColor: theme.colors.secondary }]}
        onPress={() => setVisible(true)}
      >
        <Text style={modalStyles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Animação Fade</Text>
            <Text style={modalStyles.modalText}>
              Este modal aparece com efeito fade
            </Text>
            <TouchableOpacity
              style={[modalStyles.closeButton, { backgroundColor: theme.colors.secondary }]}
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
