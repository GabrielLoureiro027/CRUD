const { prototype } = require('events');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

let produtos = [];
let idCounter = 1;


// POST: Criar Produtos
app.post('/CriarProdutos', (req, res) => {
    const { nome, preco, quantidade } = req.body;
    const novoProduto = { id: idCounter++, nome, preco, quantidade };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// GET: Mostrar Produtos
app.get('/MostrarProdutos', (req, res) => {
    res.json(produtos);
});
app.get('/Busca/:nome', (req,res) => {
    const {nome} = req.params.query
})
app.get('/Relatorio', (req,res) => {
    const totalEstoque = produtos.length()
    const valorTotalEstoque = produtos.quantidade * produtos.preco
    res.status(200).json({message: ('Estoque total' + totalEstoque + '\nValor total do estoque ' + valorTotalEstoque)})
})

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

// Rodar o Servidor
app.listen(port, () => {
    console.log('O servidor está rodando na porta ' + port);
});