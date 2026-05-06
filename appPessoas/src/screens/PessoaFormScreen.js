// src/screens/PessoaFormScreen.js

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import FeedbackModal from '../components/FeedbackModal'

export default function PessoaFormScreen({ navigation, route }) {
  // Se chegou um id pela navegação, estamos no modo edição
  const pessoaId = route.params?.id ?? null
  const editando = pessoaId !== null

  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(editando)

  // Estado do modal de feedback
  const [modal, setModal] = useState({ visivel: false, tipo: '', mensagem: '' })

  const abrirModal = (tipo, mensagem) => setModal({ visivel: true, tipo, mensagem })

  const fecharModal = () => {
    setModal({ visivel: false, tipo: '', mensagem: '' })
    // Volta para a tela anterior somente após fechar o modal de sucesso
    if (modal.tipo === 'sucesso') {
      navigation.goBack()
    }
  }

  // Se estiver editando, carrega os dados atuais da pessoa
  useEffect(() => {
    if (!editando) return

    const carregarPessoa = async () => {
      try {
        const resposta = await api.get(`/api/pessoas/${pessoaId}`)
        setNome(resposta.data.nome)
        setIdade(String(resposta.data.idade))
      } catch (erro) {
        abrirModal('erro', 'Não foi possível carregar os dados da pessoa para edição.')
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarPessoa()
  }, [editando, pessoaId])

  const validarCampos = () => {
    if (!nome.trim()) {
      abrirModal('erro', 'O campo Nome é obrigatório.')
      return false
    }
    if (!idade.trim()) {
      abrirModal('erro', 'O campo Idade é obrigatório.')
      return false
    }
    const idadeNum = Number(idade)
    if (isNaN(idadeNum) || idadeNum <= 0 || idadeNum > 150) {
      abrirModal('erro', 'Digite uma idade válida entre 1 e 150 anos.')
      return false
    }
    return true
  }

  const salvarPessoa = async () => {
    if (!validarCampos()) return

    const payload = {
      nome: nome.trim(),
      idade: Number(idade),
    }

    try {
      setSalvando(true)

      if (editando) {
        await api.put(`/api/pessoas/${pessoaId}`, payload)
        abrirModal('sucesso', 'Pessoa atualizada com sucesso!')
      } else {
        await api.post('/api/pessoas', payload)
        abrirModal('sucesso', 'Pessoa cadastrada com sucesso!')
      }
    } catch (erro) {
      const mensagem = editando
        ? 'Não foi possível atualizar a pessoa. Tente novamente.'
        : 'Não foi possível cadastrar a pessoa. Tente novamente.'
      abrirModal('erro', mensagem)
    } finally {
      setSalvando(false)
    }
  }

  if (carregandoDados) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando dados...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">

        <Text style={styles.titulo}>
          {editando ? 'Editar pessoa' : 'Nova pessoa'}
        </Text>
        <Text style={styles.subtitulo}>
          {editando ? 'Altere os campos e salve.' : 'Preencha os campos abaixo.'}
        </Text>

        {/* Campo Nome */}
        <View style={styles.campo}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome completo"
            placeholderTextColor="#94a3b8"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        {/* Campo Idade */}
        <View style={styles.campo}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a idade"
            placeholderTextColor="#94a3b8"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={3}
          />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
          onPress={salvarPessoa}
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.textoBotao}>
              {editando ? 'Atualizar' : 'Cadastrar'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de feedback (sucesso ou erro) */}
      <FeedbackModal
        visivel={modal.visivel}
        tipo={modal.tipo}
        mensagem={modal.mensagem}
        onFechar={fecharModal}
      />

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  conteudo: {
    padding: 20,
    gap: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: -12,
  },
  campo: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  botaoSalvar: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
})