package com.example.projeto.controller;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.projeto.model.Produto;
import com.example.projeto.service.ProdutoService;

import org.springframework.http.HttpStatus;

@Controller
@RequestMapping("/produtos")
public class ProdutoWebController {

    private final ProdutoService produtoService;

    public ProdutoWebController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Mapeia GET /produtos → redireciona para /produtos/listar
    @GetMapping
    public String index() {
        return "redirect:/produtos/listar";
    }

    // 1. Página de cadastro
    @GetMapping("/cadastrar")
    public String exibirFormCadastro(Model model) {
        model.addAttribute("produto", new Produto());
        return "produtos/form";
    }

    @PostMapping("/cadastrar")
    public String cadastrarProduto(
            @Valid @ModelAttribute("produto") Produto produto,
            BindingResult result,
            RedirectAttributes ra) {

        if (result.hasErrors()) {
            // repopula o objeto no formulário em caso de erro
            return "produtos/form";
        }
        produtoService.salvarProduto(produto);
        ra.addFlashAttribute("success", "Produto cadastrada com sucesso!");
        return "redirect:/produtos/listar";
    }

    // 2. Página de listagem
    @GetMapping("/listar")
    public String listarProdutos(Model model) {
        model.addAttribute("lista", produtoService.listarProdutos());
        return "produtos/lista";
    }

    // 3. Detalhes e exclusão
    @GetMapping("/{id}")
    public String detalhesProduto(@PathVariable Long id, Model model) {
        Produto p = produtoService.buscarPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Produto não encontrado, id: " + id
            ));
        model.addAttribute("produto", p);
        return "produtos/detalhe";
    }

    @PostMapping("/{id}/excluir")
    public String excluirProduto(@PathVariable Long id, RedirectAttributes ra) {
        produtoService.deletarProduto(id);
        ra.addFlashAttribute("success", "Produto excluído com sucesso!");
        return "redirect:/produtos/listar";
    }
}