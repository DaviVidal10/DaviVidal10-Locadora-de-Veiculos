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

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        cpf: ""
    });
    const [editando, setEditando] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    // Estado para tema
    const [modoEscuro, setModoEscuro] = useState(false);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const navigate = useNavigate();

    const carregarUsuarios = () => {
        axios.get("http://localhost:8080/usuarios")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Erro ao buscar usuários:", error));
    };

    const handleChange = (e) => {
        setNovoUsuario({ ...novoUsuario, [e.target.name]: e.target.value });
    };

    const salvarUsuario = () => {
        axios.post("http://localhost:8080/usuarios", novoUsuario)
            .then(() => {
                carregarUsuarios();
                setOpen(false);
                setNovoUsuario({ nome: "", cpf: "" });
            })
            .catch(error => console.error("Erro ao salvar usuário:", error));
    };

    const abrirEdicao = (usuario) => {
        setUsuarioEditando(usuario);
        setNovoUsuario({
            nome: usuario.nome,
            cpf: usuario.cpf
        });
        setEditando(true);
        setOpen(true);
    };

    const salvarEdicao = () => {
        axios.put(`http://localhost:8080/usuarios/${usuarioEditando.id}`, novoUsuario)
            .then(() => {
                carregarUsuarios();
                setOpen(false);
                setEditando(false);
                setUsuarioEditando(null);
                setNovoUsuario({ nome: "", cpf: "" });
            })
            .catch(error => console.error("Erro ao editar usuário:", error));
    };

    const excluirUsuario = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            axios.delete(`http://localhost:8080/usuarios/${id}`)
                .then(() => carregarUsuarios())
                .catch(error => console.error("Erro ao excluir usuário:", error));
        }
    };

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
                    👤 Lista de Usuários
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setOpen(true); setEditando(false); }}
                    style={{ marginRight: "10px" }}
                >
                    + Novo Usuário
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/veiculos")}
                >
                    Ir para Veículos
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
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nome</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>CPF</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ações</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Compras</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((u) => (
                                <TableRow key={u.id} hover>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.nome}</TableCell>
                                    <TableCell>{u.cpf}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => abrirEdicao(u)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => excluirUsuario(u.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate(`/compras/${u.id}`)}
                                        >
                                            Ver Veículos Comprados
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal de cadastro/edição */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{editando ? "Editar Usuário" : "Cadastrar Novo Usuário"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Nome"
                            name="nome"
                            fullWidth
                            value={novoUsuario.nome}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="CPF"
                            name="cpf"
                            fullWidth
                            value={novoUsuario.cpf}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="error">Cancelar</Button>
                        {editando ? (
                            <Button onClick={salvarEdicao} color="primary" variant="contained">Salvar Alterações</Button>
                        ) : (
                            <Button onClick={salvarUsuario} color="primary" variant="contained">Salvar</Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
}

export default UsuariosPage;
