// src/components/PessoaCard.js

import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Cartão exibido na lista de pessoas.
 *
 * Props:
 *   pessoa          {object}   - objeto com id, nome e idade
 *   onPressDetalhes {function} - navega para a tela de detalhes
 */
export default function PessoaCard({ pessoa, onPressDetalhes }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPressDetalhes} activeOpacity={0.85}>

      <View style={styles.linhaSuperior}>
        <Text style={styles.nome}>{pessoa.nome}</Text>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      <View style={styles.infoLinha}>
        <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
        <Text style={styles.info}>{pessoa.idade} anos</Text>
      </View>

      <Text style={styles.id}>ID: {pessoa.id}</Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#64748b',
  },
  id: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
  },
})