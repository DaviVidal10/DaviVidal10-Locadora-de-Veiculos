package com.projetocarro.model;

import jakarta.persistence.*;

@Entity
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cada carro só pode ter uma venda
    @OneToOne
    @JoinColumn(name = "carro_id", unique = true)
    private Veiculo veiculo;

    // Um usuário pode comprar vários carros
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario comprador;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }

    public Usuario getComprador() {
        return comprador;
    }

    public void setComprador(Usuario comprador) {
        this.comprador = comprador;
    }
}
