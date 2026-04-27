import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";

function ComprasUsuarioPage() {
  const { id } = useParams(); // ID do usuário
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/vendas/usuario/${id}`)
      .then(response => setCompras(response.data))
      .catch(error => console.error("Erro ao buscar compras:", error));
  }, [id]);

  return (
    <div style={{ margin: "40px" }}>
      <Typography variant="h5" gutterBottom color="primary">
        Veículos comprados pelo Usuário #{id}
      </Typography>

      <TableContainer component={Paper} elevation={3} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID Venda</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Modelo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ano</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Preço</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.veiculo.modelo}</TableCell>
                <TableCell>{c.veiculo.ano}</TableCell>
                <TableCell>R$ {c.veiculo.preco.toLocaleString("pt-BR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/usuarios")}
      >
        Voltar para Usuários
      </Button>
    </div>
  );
}

export default ComprasUsuarioPage;
