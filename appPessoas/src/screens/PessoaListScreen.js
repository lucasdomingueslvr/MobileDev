// src/screens/PessoaListScreen.js

import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import api from '../services/api'
import PessoaCard from '../components/PessoaCard'
import FeedbackModal from '../components/FeedbackModal'

export default function PessoaListScreen({ navigation }) {
  const [pessoas, setPessoas] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Estado do modal de feedback
  const [modal, setModal] = useState({ visivel: false, tipo: '', mensagem: '' })

  const abrirModal = (tipo, mensagem) => setModal({ visivel: true, tipo, mensagem })
  const fecharModal = () => setModal({ visivel: false, tipo: '', mensagem: '' })

  const carregarPessoas = async () => {
    try {
      setLoading(true)
      const resposta = await api.get('/api/pessoas')
      setPessoas(resposta.data)
    } catch (erro) {
      abrirModal('erro', 'Não foi possível carregar a lista de pessoas. Verifique a conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await carregarPessoas()
    setRefreshing(false)
  }

  // Recarrega a lista sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarPessoas()
    }, [])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho com título e botão de nova pessoa */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Pessoas</Text>
          <Text style={styles.subtitulo}>{pessoas.length} cadastrada(s)</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.navigate('PessoaForm')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Lista de pessoas */}
      <FlatList
        data={pessoas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PessoaCard
            pessoa={item}
            onPressDetalhes={() => navigation.navigate('PessoaDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={pessoas.length === 0 ? styles.listaVazia : styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="people-outline" size={64} color="#cbd5e1" />
            <Text style={styles.textoVazio}>Nenhuma pessoa cadastrada.</Text>
            <Text style={styles.textoVazioSub}>Toque no botão + para adicionar.</Text>
          </View>
        }
      />

      {/* Modal de feedback para erros de carregamento */}
      <FeedbackModal
        visivel={modal.visivel}
        tipo={modal.tipo}
        mensagem={modal.mensagem}
        onFechar={fecharModal}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  textoCarregando: {
    color: '#64748b',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  botaoNovo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lista: {
    paddingBottom: 24,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  vazioContainer: {
    alignItems: 'center',
    gap: 8,
  },
  textoVazio: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  textoVazioSub: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
  },
})