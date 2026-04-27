import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

function VenderVeiculoPage() {
  const { id } = useParams(); // ID do carro vindo da rota
  const [usuarios, setUsuarios] = useState([]);
  const [veiculo, setVeiculo] = useState(null);
  const [open, setOpen] = useState(false);
  const [compradorSelecionado, setCompradorSelecionado] = useState(null);

  // Carregar usuários e veículo
  useEffect(() => {
    axios.get("http://localhost:8080/usuarios")
      .then(response => setUsuarios(response.data))
      .catch(error => console.error("Erro ao buscar usuários:", error));

    axios.get(`http://localhost:8080/veiculos/${id}`)
      .then(response => setVeiculo(response.data))
      .catch(error => console.error("Erro ao buscar veículo:", error));
  }, [id]);

  const escolherComprador = (usuario) => {
    setCompradorSelecionado(usuario);
    setOpen(true);
  };

  const finalizarVenda = () => {
    axios.post("http://localhost:8080/vendas", {
      veiculo: { id: veiculo.id },
      comprador: { id: compradorSelecionado.id }
    })
    .then(() => {
      alert(`Venda concluída: Carro ${veiculo.modelo} vendido para ${compradorSelecionado.nome}`);
      setOpen(false);
    })
    .catch(error => console.error("Erro ao registrar venda:", error));
  };

  return (
    <div style={{ margin: "40px" }}>
      <Typography variant="h5" gutterBottom color="primary">
        Vender Veículo #{id}
      </Typography>

      <TableContainer component={Paper} elevation={3} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CPF</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.nome}</TableCell>
                <TableCell>{u.cpf}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => escolherComprador(u)}
                  >
                    Escolher Comprador
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de confirmação da venda */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar Venda</DialogTitle>
        <DialogContent>
          {veiculo && compradorSelecionado && (
            <div>
              <Typography>Veículo: {veiculo.modelo} - Ano {veiculo.ano}</Typography>
              <Typography>Preço: R$ {veiculo.preco.toLocaleString("pt-BR")}</Typography>
              <Typography>Comprador: {compradorSelecionado.nome} (CPF: {compradorSelecionado.cpf})</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">Cancelar</Button>
          <Button onClick={finalizarVenda} color="primary" variant="contained">Finalizar Venda</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default VenderVeiculoPage;
