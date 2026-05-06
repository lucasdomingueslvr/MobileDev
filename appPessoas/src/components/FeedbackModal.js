// src/components/FeedbackModal.js

import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Modal de feedback para operações CRUD.
 *
 * Props:
 *   visivel  {boolean}  - controla se o modal está aberto
 *   tipo     {string}   - 'sucesso' ou 'erro'
 *   mensagem {string}   - texto exibido para o usuário
 *   onFechar {function} - chamado quando o usuário pressiona OK
 */
export default function FeedbackModal({ visivel, tipo, mensagem, onFechar }) {
  const ehSucesso = tipo === 'sucesso'

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visivel}
      onRequestClose={onFechar}
    >
      <View style={styles.overlay}>
        <View style={styles.caixa}>

          <Ionicons
            name={ehSucesso ? 'checkmark-circle' : 'close-circle'}
            size={64}
            color={ehSucesso ? '#16a34a' : '#dc2626'}
          />

          <Text style={styles.mensagem}>{mensagem}</Text>

          <TouchableOpacity
            style={[styles.botao, ehSucesso ? styles.botaoSucesso : styles.botaoErro]}
            onPress={onFechar}
          >
            <Text style={styles.textoBotao}>OK</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  caixa: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  mensagem: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  botaoSucesso: {
    backgroundColor: '#16a34a',
  },
  botaoErro: {
    backgroundColor: '#dc2626',
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
})