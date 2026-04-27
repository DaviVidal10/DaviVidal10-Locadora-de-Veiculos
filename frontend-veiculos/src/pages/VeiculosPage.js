import React, { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Brightness7Icon from "@mui/icons-material/Brightness7"; // sol
import Brightness4Icon from "@mui/icons-material/Brightness4"; // lua
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography,
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton,
    CssBaseline
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function VeiculosPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [open, setOpen] = useState(false);
    const [novoVeiculo, setNovoVeiculo] = useState({
        modelo: "",
        ano: "",
        preco: ""
    });
    const [editando, setEditando] = useState(false);
    const [veiculoEditando, setVeiculoEditando] = useState(null);

    // Estado para tema
    const [modoEscuro, setModoEscuro] = useState(false);

    useEffect(() => {
        carregarVeiculos();
    }, []);

    const carregarVeiculos = async () => {
        try {
            const response = await axios.get("http://localhost:8080/veiculos");
            const veiculosData = response.data;

            // Para cada veículo, verificar se já foi vendido
            const veiculosComStatus = await Promise.all(
                veiculosData.map(async (v) => {
                    const vendidoResp = await axios.get(`http://localhost:8080/vendas/carro/${v.id}/vendido`);
                    return { ...v, vendido: vendidoResp.data };
                })
            );

            setVeiculos(veiculosComStatus);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
        }
    };
    const handleChange = (e) => {
        setNovoVeiculo({ ...novoVeiculo, [e.target.name]: e.target.value });
    };

    const salvarVeiculo = () => {
        axios.post("http://localhost:8080/veiculos", novoVeiculo)
            .then(() => {
                carregarVeiculos();
                setOpen(false);
                setNovoVeiculo({ modelo: "", ano: "", preco: "" });
            })
            .catch(error => console.error("Erro ao salvar veículo:", error));
    };

    const abrirEdicao = (veiculo) => {
        setVeiculoEditando(veiculo);
        setNovoVeiculo({
            modelo: veiculo.modelo,
            ano: veiculo.ano,
            preco: veiculo.preco
        });
        setEditando(true);
        setOpen(true);
    };

    const salvarEdicao = () => {
        axios.put(`http://localhost:8080/veiculos/${veiculoEditando.id}`, novoVeiculo)
            .then(() => {
                carregarVeiculos();
                setOpen(false);
                setEditando(false);
                setVeiculoEditando(null);
                setNovoVeiculo({ modelo: "", ano: "", preco: "" });
            })
            .catch(error => console.error("Erro ao editar veículo:", error));
    };

    const excluirVeiculo = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
            axios.delete(`http://localhost:8080/veiculos/${id}`)
                .then(() => carregarVeiculos())
                .catch(error => console.error("Erro ao excluir veículo:", error));
        }
    };

    const navigate = useNavigate();

    // Tema dinâmico
    const tema = createTheme({
        palette: {
            mode: modoEscuro ? "dark" : "light",
            primary: {
                main: "#1976d2"
            },
            success: {
                main: "#2e7d32"
            },
            error: {
                main: "#d32f2f"
            }
        }
    });

    return (
        <ThemeProvider theme={tema}>
            <CssBaseline />
            <div style={{ margin: "40px" }}>
                <Typography variant="h4" gutterBottom color="primary">
                    🚗 Lista de Veículos
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setOpen(true); setEditando(false); }}
                    style={{ marginRight: "10px" }}
                >
                    + Novo Veículo
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/usuarios")}
                >
                    Ir para Usuários
                </Button>

                {/* Botão para alternar tema apenas com ícone */}
                <IconButton onClick={() => setModoEscuro(!modoEscuro)} color="primary">
                    {modoEscuro ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                <TableContainer component={Paper} elevation={3} style={{ marginTop: "20px" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Modelo</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ano</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Preço</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ações</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Venda</TableCell>
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {veiculos.map((v) => (
                                <TableRow key={v.id} hover>
                                    <TableCell>{v.id}</TableCell>
                                    <TableCell>{v.modelo}</TableCell>
                                    <TableCell>{v.ano}</TableCell>
                                    <TableCell>R$ {v.preco.toLocaleString("pt-BR")}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => abrirEdicao(v)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => excluirVeiculo(v.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        {v.vendido ? (
                                            <Typography color="error" fontWeight="bold">Veículo Vendido</Typography>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate(`/vender/${v.id}`)}
                                            >
                                                Vender
                                            </Button>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal de cadastro/edição */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{editando ? "Editar Veículo" : "Cadastrar Novo Veículo"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Modelo"
                            name="modelo"
                            fullWidth
                            value={novoVeiculo.modelo}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Ano"
                            name="ano"
                            type="number"
                            fullWidth
                            value={novoVeiculo.ano}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Preço"
                            name="preco"
                            type="number"
                            fullWidth
                            value={novoVeiculo.preco}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="error">Cancelar</Button>
                        {editando ? (
                            <Button onClick={salvarEdicao} color="primary" variant="contained">Salvar Alterações</Button>
                        ) : (
                            <Button onClick={salvarVeiculo} color="primary" variant="contained">Salvar</Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
}

export default VeiculosPage;
