package com.projetocarro.service;

import com.projetocarro.model.Veiculo;
import com.projetocarro.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VeiculoService {

    private final VeiculoRepository repository;

    public VeiculoService(VeiculoRepository repository) {
        this.repository = repository;
    }

    public List<Veiculo> listar() {
        return repository.findAll();
    }

    public Optional<Veiculo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Veiculo salvar(Veiculo veiculo) {
        return repository.save(veiculo);
    }

    public Veiculo atualizar(Long id, Veiculo veiculo) {
        return repository.findById(id)
            .map(v -> {
                v.setModelo(veiculo.getModelo());
                v.setAno(veiculo.getAno());
                v.setMarca(veiculo.getMarca());
                v.setPreco(veiculo.getPreco());
                return repository.save(v);
            })
            .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
