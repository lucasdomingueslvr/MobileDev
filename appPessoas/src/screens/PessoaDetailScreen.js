// src/screens/PessoaDetailScreen.js

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import api from '../services/api'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmacaoModal from '../components/ConfirmacaoModal'

export default function PessoaDetailScreen({ navigation, route }) {
  const { id } = route.params

  const [pessoa, setPessoa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [excluindo, setExcluindo] = useState(false)

  // Estado do modal de feedback (sucesso/erro)
  const [feedback, setFeedback] = useState({ visivel: false, tipo: '', mensagem: '' })

  // Estado do modal de confirmação de exclusão
  const [confirmacao, setConfirmacao] = useState(false)

  const abrirFeedback = (tipo, mensagem) => setFeedback({ visivel: true, tipo, mensagem })

  const fecharFeedback = () => {
    const tipo = feedback.tipo
    setFeedback({ visivel: false, tipo: '', mensagem: '' })
    // Se a exclusão foi bem-sucedida, volta para a lista ao fechar o modal
    if (tipo === 'sucesso') {
      navigation.goBack()
    }
  }

  const carregarPessoa = async () => {
    try {
      setLoading(true)
      const resposta = await api.get(`/api/pessoas/${id}`)
      setPessoa(resposta.data)
    } catch (erro) {
      abrirFeedback('erro', 'Não foi possível carregar os detalhes desta pessoa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPessoa()
  }, [id])

  const confirmarExclusao = () => setConfirmacao(true)
  const cancelarExclusao = () => setConfirmacao(false)

  const excluirPessoa = async () => {
    setConfirmacao(false)
    try {
      setExcluindo(true)
      await api.delete(`/api/pessoas/${id}`)
      abrirFeedback('sucesso', 'Pessoa excluída com sucesso!')
    } catch (erro) {
      abrirFeedback('erro', 'Não foi possível excluir esta pessoa. Tente novamente.')
    } finally {
      setExcluindo(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando detalhes...</Text>
      </View>
    )
  }

  if (!pessoa) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-remove-outline" size={64} color="#cbd5e1" />
        <Text style={styles.textoErro}>Pessoa não encontrada.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      {/* Avatar com inicial do nome */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {pessoa.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Card com os dados da pessoa */}
      <View style={styles.card}>
        <Text style={styles.nomeDestaque}>{pessoa.nome}</Text>

        <View style={styles.separador} />

        <View style={styles.linha}>
          <View style={styles.linhaEsquerda}>
            <Ionicons name="finger-print-outline" size={18} color="#94a3b8" />
            <Text style={styles.rotulo}>Código</Text>
          </View>
          <Text style={styles.valor}>{pessoa.id}</Text>
        </View>

        <View style={styles.linha}>
          <View style={styles.linhaEsquerda}>
            <Ionicons name="calendar-outline" size={18} color="#94a3b8" />
            <Text style={styles.rotulo}>Idade</Text>
          </View>
          <Text style={styles.valor}>{pessoa.idade} anos</Text>
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoEditar]}
          onPress={() => navigation.navigate('PessoaForm', { id: pessoa.id })}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={20} color="#ffffff" />
          <Text style={styles.textoAcao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
          onPress={confirmarExclusao}
          disabled={excluindo}
          activeOpacity={0.85}
        >
          {excluindo ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#ffffff" />
              <Text style={styles.textoAcao}>Excluir</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de confirmação de exclusão */}
      <ConfirmacaoModal
        visivel={confirmacao}
        mensagem={`Deseja realmente excluir "${pessoa.nome}"? Esta ação não pode ser desfeita.`}
        onConfirmar={excluirPessoa}
        onCancelar={cancelarExclusao}
      />

      {/* Modal de feedback (sucesso ou erro da exclusão) */}
      <FeedbackModal
        visivel={feedback.visivel}
        tipo={feedback.tipo}
        mensagem={feedback.mensagem}
        onFechar={fecharFeedback}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  conteudo: {
    padding: 20,
    gap: 20,
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
  textoErro: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  avatarLetra: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  nomeDestaque: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  separador: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  linhaEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rotulo: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  valor: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoAcao: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoEditar: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoAcao: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
})