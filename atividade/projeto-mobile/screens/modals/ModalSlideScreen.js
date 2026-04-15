import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import modalStyles from '../../styles/modalStyles';
import theme from '../../styles/theme';

export default function ModalSlideScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={modalStyles.container}>
      <Text style={[modalStyles.title, { color: theme.colors.primary }]}>
        Modal Slide
      </Text>

      <TouchableOpacity
        style={[modalStyles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => setVisible(true)}
      >
        <Text style={modalStyles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Animação Slide</Text>
            <Text style={modalStyles.modalText}>
              Este modal desliza de baixo para cima
            </Text>
            <TouchableOpacity
              style={[modalStyles.closeButton, { backgroundColor: theme.colors.primary }]}
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
