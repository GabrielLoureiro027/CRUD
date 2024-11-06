const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

let produtos = [];
let idCounter = 1;

// POST: Criar Produtos
app.post('/CriarProdutos', (req, res) => {
    const { nome, preco, quantidade } = req.body;
    if (nome===null || preco===null || quantidade===null) {
        return res.status(400).json({ message: 'Os campos nome, preco e quantidade são obrigatórios.' });
    }
    const novoProduto = { id: idCounter++, nome, preco, quantidade };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// GET: Mostrar Produtos
app.get('/MostrarProdutos', (req, res) => {
    res.json(produtos);
});

// GET: Buscar Produto pelo nome com parâmetros de URL (ex: /Busca/nomeProduto)
app.get('/Busca/:nome', (req, res) => {
    const { nome } = req.params;  // Obtém o nome diretamente dos parâmetros da URL
    const produto = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
});

// GET: Buscar Produtos pelo nome (usando query string)
app.get('/produtos/buscar', (req, res) => {
    const { nome } = req.query;  // Obtém o nome da query string
    if (!nome) {
        return res.status(400).json({ message: 'O parâmetro nome é obrigatório.' });
    }
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(nome.toLowerCase()) // Filtra os produtos pelo nome
    );
    if (produtosFiltrados.length === 0) {
        return res.status(404).json({ message: 'Nenhum produto encontrado com esse nome.' });
    }
    res.json(produtosFiltrados);
});

// PUT: Atualizar Produto
app.put('/AtualizarProdutos/:id', (req, res) => {
    const idProduto = parseInt(req.params.id);
    const { nome, preco, quantidade } = req.body;
    const produto = produtos.find(e => e.id === idProduto);
    if (produto) {
        produto.nome = nome || produto.nome;
        produto.preco = preco || produto.preco;
        produto.quantidade = quantidade || produto.quantidade;
        res.json(produto);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// DELETE: Deletar Produto
app.delete('/DeletarProdutos/:id', (req, res) => {
    const idProduto = parseInt(req.params.id);
    const index = produtos.findIndex(e => e.id === idProduto);
    if (index !== -1) {
        const produtoRemovido = produtos.splice(index, 1); // Remove o produto
        res.json({ message: 'Produto removido com sucesso', produto: produtoRemovido[0] });
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// GET: Relatório
app.get('/relatorio', (req, res) => {
    const totalProdutos = produtos.length;  // Número total de produtos no estoque

    // Valor total do estoque (soma de quantidade * preco de cada produto)
    const valorTotalEstoque = produtos.reduce((total, produto) => {
        return total + (produto.preco * produto.quantidade);
    }, 0);

    res.json({
        totalProdutos,
        valorTotalEstoque
    });
});

// Rodar o Servidor
app.listen(port, () => {
    console.log('O servidor está rodando na porta ' + port);
});
