package com.projetocarro.repository;

import com.projetocarro.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    // Verifica se já existe uma venda para um veículo específico
    boolean existsByVeiculo_Id(Long veiculoId);

    // Busca uma venda pelo ID do veículo
    Venda findByVeiculo_Id(Long veiculoId);

    // Lista todas as vendas feitas por um usuário específico
    List<Venda> findByComprador_Id(Long usuarioId);
}
