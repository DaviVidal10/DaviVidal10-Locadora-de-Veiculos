package com.projetocarro.controller;

import com.projetocarro.model.Venda;
import com.projetocarro.service.VendaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    // Lista todas as vendas
    @GetMapping
    public List<Venda> listar() {
        return service.listar();
    }

    // Busca uma venda pelo ID
    @GetMapping("/{id}")
    public Venda buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    // Salva uma nova venda
    @PostMapping
    public Venda salvar(@RequestBody Venda venda) {
        return service.salvar(venda);
    }

    // Deleta uma venda pelo ID
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    // Verifica se um carro já foi vendido
    @GetMapping("/carro/{veiculoId}/vendido")
    public boolean carroJaVendido(@PathVariable Long veiculoId) {
        return service.carroJaVendido(veiculoId);
    }

    // Lista todas as vendas feitas por um usuário (veículos comprados)
    @GetMapping("/usuario/{usuarioId}")
    public List<Venda> listarPorComprador(@PathVariable Long usuarioId) {
        return service.listarPorComprador(usuarioId);
    }
}
