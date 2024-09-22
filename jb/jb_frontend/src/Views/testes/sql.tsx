// SELECT 
// 	p.idPedido,
// 	SUM(dp.qtdPedida * de.qtd) AS qtdTotal,
// 	pro2.nome AS materiaPrima,
// 	c.nome AS cor,
// 	pc.nome AS cliente
	
// FROM
// 	pedidos p
// INNER JOIN 
// 	detalhepedidos dp ON dp.idPedido = p.idPedido
// INNER JOIN
// 	produtos pro1 ON pro1.idProduto = dp.idProduto
// INNER JOIN
// 	estruturas e ON e.idProduto = dp.idProduto
// INNER JOIN
// 	detalheestruturas de ON de.idEstrutura = e.idEstrutura
// INNER JOIN
// 	produtos pro2 ON pro2.idProduto = de.idProduto
// INNER JOIN 
// 	cores c ON c.idCor = de.idCor
// INNER JOIN
// 	pessoas pc ON pc.idPessoa = p.idPessoa_cliente
// WHERE 
// 	pro2.tipoProduto = 2 AND
// 	dp.statusItem = 1
// GROUP BY
// 	materiaPrima, cor, cliente, p.idPedido
// 	;