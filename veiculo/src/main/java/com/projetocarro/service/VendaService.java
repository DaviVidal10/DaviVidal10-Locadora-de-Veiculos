package com.projetocarro.service;

import com.projetocarro.model.Venda;
import com.projetocarro.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

    private final VendaRepository repository;

    public VendaService(VendaRepository repository) {
        this.repository = repository;
    }

    // Lista todas as vendas
    public List<Venda> listar() {
        return repository.findAll();
    }

    // Busca uma venda pelo ID
    public Optional<Venda> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Salva uma nova venda
    public Venda salvar(Venda venda) {
        return repository.save(venda);
    }

    // Deleta uma venda pelo ID
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Verifica se um carro já foi vendido
    public boolean carroJaVendido(Long veiculoId) {
        return repository.existsByVeiculo_Id(veiculoId);
    }

    // Busca a venda associada a um veículo específico
    public Venda buscarPorVeiculo(Long veiculoId) {
        return repository.findByVeiculo_Id(veiculoId);
    }

    // Lista todas as vendas feitas por um usuário (todos os carros comprados)
    public List<Venda> listarPorComprador(Long usuarioId) {
        return repository.findByComprador_Id(usuarioId);
    }
}
