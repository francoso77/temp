using System.Collections.Generic;
using System.Net.Http.Headers;
using tabuleiro;

namespace xadrez
{
    class PartidaDeXadrez
    {
        public Tabuleiro Tab { get; private set; }
        public int Turno { get; private set; }
        public Cor JogadorAtual { get; private set; }
        public bool Terminada { get; private set; }

        private HashSet<Peca> Pecas;
        private HashSet<Peca> Capturadas;
        public Peca VulneravelEnPassant { get; private set; }
        public bool Xeque { get; private set; }
        public PartidaDeXadrez()
        {
            Tab = new Tabuleiro(8,8);
            Turno = 1;
            JogadorAtual = Cor.Branca;
            Terminada = false;
            //coloque os conjuntos antes de colocar as peças
            Pecas = new HashSet<Peca>();
            Capturadas = new HashSet<Peca>();
            VulneravelEnPassant = null;
            Xeque = false;
            colocarPecas();
        }  
        
        private Cor Adversaria(Cor cor)
        {
            if (cor == Cor.Branca)
            {
                return Cor.Preta;
            }
            else
            {
                return Cor.Branca;
            }
        }

        private Peca Rei(Cor cor)
        {
            foreach (Peca peca in pecasEmJogo(cor))
            {
                if (peca is Rei)
                {
                    return peca;
                }
            }
            return null;
        }

        public bool estaEmXeque(Cor cor)
        {
            Peca R = Rei(cor);
            if (R == null)
            {
                throw new TabuleiroException("Não tem Rei da cor" + cor + "no tabuleiro!");
            }
            foreach (Peca peca in pecasEmJogo(Adversaria(cor)))
            {
                bool[,] mat = peca.movimentosPossiveis();
                if (mat[R.Posicao.Linha, R.Posicao.Coluna])
                {
                    return true;
                }
            }
            return false;
        }

        public bool testeXequemate(Cor cor)
        {
            if (!estaEmXeque(cor))
            {
                return false;
            }

            foreach (Peca peca in pecasEmJogo(cor))
            {
                bool[,] mat = peca.movimentosPossiveis();
                for (int i = 0; i < Tab.Linhas; i++)
                {
                    for (int j = 0; j < Tab.Colunas; j++)
                    {
                        if (mat[i, j])
                        {
                            Posicao origem = peca.Posicao;
                            Posicao destino = new Posicao(i, j);
                            Peca pecaCapturada = executaMovimento(origem, destino);
                            bool testeXeque = estaEmXeque(cor);
                            desfazMovimento(origem, destino, pecaCapturada);
                            if (!testeXeque)
                            {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
        public void realizaJogada(Posicao origem, Posicao destino)
        {
            Peca pecaCapturada = executaMovimento(origem, destino);
            
            if(estaEmXeque(JogadorAtual))
            {
                desfazMovimento(origem, destino, pecaCapturada);
                throw new TabuleiroException("Você não pode se colocar em xeque!");
            }

            Peca p = Tab.peca(destino);

            // #jogaespecial promocao

            if(p is Peao)
            {
                if((p.Cor == Cor.Branca && destino.Linha == 0) || (p.Cor == Cor.Preta && destino.Linha == 7))
                {
                    p = Tab.retirarPeca(destino);
                    Pecas.Remove(p);
                    Peca dama = new Dama(Tab, p.Cor);
                    Tab.colocarPeca(dama, destino);
                    Pecas.Add(dama);
                }
            }

            if (estaEmXeque(Adversaria(JogadorAtual)))
            {
                Xeque = true;
            }
            else
            {
                Xeque = false;
            }
            if (testeXequemate(Adversaria(JogadorAtual)))
            {
                Terminada = true;
            }
            else
            {
                Turno++;
                mudaJogador();
            }

            // jogadaespecial en passant

            if (p is Peao && (destino.Linha == origem.Linha - 2 || destino.Linha == destino.Linha + 2))
            {
                VulneravelEnPassant = p;
            }
            else
            {
                VulneravelEnPassant = null;
            }
        }

        private void mudaJogador()
        {
            if(JogadorAtual == Cor.Branca)
            {
                JogadorAtual = Cor.Preta;
            }
            else
            {
                JogadorAtual = Cor.Branca;
            }

        }
        public Peca executaMovimento(Posicao origem, Posicao destino)
        {
            Peca p = Tab.retirarPeca(origem);
            p.incrementarQteMovimentos();
            Peca pecaCapturada = Tab.retirarPeca(destino);
            Tab.colocarPeca(p, destino);
            if (pecaCapturada != null)
            {
                Capturadas.Add(pecaCapturada);  
            }
            // #jogadaespecial roque pequeno - executa movimento

            if (p is Rei && destino.Coluna == origem.Coluna + 2)
            {
                Posicao origemT = new Posicao(origem.Linha, origem.Coluna + 3);
                Posicao destinoT = new Posicao(origem.Linha, origem.Coluna + 1);
                Peca T = Tab.retirarPeca(origemT);
                T.incrementarQteMovimentos();
                Tab.colocarPeca(T, destinoT);
            }
           
            // #jogadaespecial roque grande - executa movimento

            if (p is Rei && destino.Coluna == origem.Coluna - 2)
            {
                Posicao origemT = new Posicao(origem.Linha, origem.Coluna - 4);
                Posicao destinoT = new Posicao(origem.Linha, origem.Coluna - 1);
                Peca T = Tab.retirarPeca(origemT);
                T.incrementarQteMovimentos();
                Tab.colocarPeca(T, destinoT);
            }

            // #jogadaespecial en passant - executa movimento
            if (p is Peao)
            {
                if(origem.Coluna != destino.Coluna && pecaCapturada == null)
                {
                    Posicao posP;
                    if(p.Cor == Cor.Branca)
                    {
                        posP = new Posicao(destino.Linha + 1, destino.Coluna);
                    }
                    else
                    {
                        posP = new Posicao(destino.Linha - 1, destino.Coluna);
                    }
                    pecaCapturada = Tab.retirarPeca(posP);
                    Capturadas.Add(pecaCapturada);
                }
            }

            return pecaCapturada;
        }

        public void desfazMovimento(Posicao origem, Posicao destino, Peca pecaCapturada)
        {
            Peca p = Tab.retirarPeca(destino);
            p.decrementarQteMovimentos();
            if (pecaCapturada != null)
            {
                Tab.colocarPeca(pecaCapturada, destino);
                Capturadas.Remove(pecaCapturada);
            }
            Tab.colocarPeca(p, origem);

            // #jogadaespecial roque pequeno - desfaz movimento

            if (p is Rei && destino.Coluna == origem.Coluna + 2)
            {
                Posicao origemT = new Posicao(origem.Linha, origem.Coluna + 3);
                Posicao destinoT = new Posicao(origem.Linha, origem.Coluna + 1);
                Peca T = Tab.retirarPeca(destinoT);
                T.decrementarQteMovimentos();
                Tab.colocarPeca(T, origemT);
            }

            // #jogadaespecial roque grande - desfaz movimento

            if (p is Rei && destino.Coluna == origem.Coluna - 2)
            {
                Posicao origemT = new Posicao(origem.Linha, origem.Coluna - 4);
                Posicao destinoT = new Posicao(origem.Linha, origem.Coluna - 1);
                Peca T = Tab.retirarPeca(destinoT);
                T.incrementarQteMovimentos();
                Tab.colocarPeca(T, origemT);
            }

            // #jogadaespecial en passant
            if(p is Peao)
            {
                if(origem.Coluna != destino.Coluna && pecaCapturada == VulneravelEnPassant)
                {
                    Peca peao = Tab.retirarPeca(destino);
                    Posicao posP;
                    if(p.Cor == Cor.Branca)
                    {
                        posP = new Posicao(3, destino.Coluna);
                    }
                    else
                    {
                        posP = new Posicao(4, destino.Coluna);
                    }
                    Tab.colocarPeca(peao, posP);
                }
            }
        }

        public HashSet<Peca> pecasCapturadas(Cor cor)
        {
            HashSet<Peca> aux = new HashSet<Peca>();
            foreach (Peca peca in Capturadas)
            {
                if (peca.Cor == cor)
                {
                    aux.Add(peca);
                }
            }
            return aux;
        }

        public HashSet<Peca> pecasEmJogo(Cor cor)
        {
            HashSet<Peca> aux = new HashSet<Peca>();
            foreach (Peca peca in Pecas)
            {
                if (peca.Cor == cor)
                {
                    aux.Add(peca);
                }
            }
            aux.ExceptWith(pecasCapturadas(cor));
            return aux;
        }
        public void validarPosicaoOrigem(Posicao origem) 
        {
            if (Tab.peca(origem) == null)
            {
                throw new TabuleiroException("Não existe peça na posição de origem escolhida!");
            }
            if(JogadorAtual != Tab.peca(origem).Cor)
            {
                throw new TabuleiroException("A peça de origem escolhida não é sua!");
            }
            if (!Tab.peca(origem).existeMovimentosPossiveis())
            {
                throw new TabuleiroException("Não há movimentos possíveis para a peça de origem escolhida!");
            }
        }
        public void colocarNovaPeca(char coluna, int linha, Peca peca)
        {
            Tab.colocarPeca(peca, new PosicaoXadrez(coluna, linha).ToPosicao());
            Pecas.Add(peca);
        }
        public void validarPosicaoDestino(Posicao origem, Posicao destino)
        {
            if (!Tab.peca(origem).podeMoverPeca(destino))
            {
                throw new TabuleiroException("Posição de destino inválida!");
            }
        }


        public void colocarPecas()
        {

            colocarNovaPeca('a', 1, new Torre(Tab, JogadorAtual));
            colocarNovaPeca('b', 1, new Cavalo(Tab, JogadorAtual));
            colocarNovaPeca('c', 1, new Bispo(Tab, JogadorAtual));
            colocarNovaPeca('d', 1, new Dama(Tab, JogadorAtual));
            //quando vc quer passar a própria class como referência usa o THIS
            colocarNovaPeca('e', 1, new Rei(Tab, JogadorAtual,this));
            colocarNovaPeca('f', 1, new Bispo(Tab, JogadorAtual));
            colocarNovaPeca('g', 1, new Cavalo(Tab, JogadorAtual));
            colocarNovaPeca('h', 1, new Torre(Tab, JogadorAtual));
            colocarNovaPeca('a', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('b', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('c', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('d', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('e', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('f', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('g', 2, new Peao(Tab, JogadorAtual, this));
            colocarNovaPeca('h', 2, new Peao(Tab, JogadorAtual, this));

            colocarNovaPeca('a', 8, new Torre(Tab, Cor.Preta));
            colocarNovaPeca('b', 8, new Cavalo(Tab, Cor.Preta));
            colocarNovaPeca('c', 8, new Bispo(Tab, Cor.Preta));
            colocarNovaPeca('d', 8, new Dama(Tab, Cor.Preta));
            //quando vc quer passar a própria class como referência usa o THIS
            colocarNovaPeca('e', 8, new Rei(Tab, Cor.Preta, this));
            colocarNovaPeca('f', 8, new Bispo(Tab, Cor.Preta));
            colocarNovaPeca('g', 8, new Cavalo(Tab, Cor.Preta));
            colocarNovaPeca('h', 8, new Torre(Tab, Cor.Preta));
            colocarNovaPeca('a', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('b', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('c', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('d', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('e', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('f', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('g', 7, new Peao(Tab, Cor.Preta, this));
            colocarNovaPeca('h', 7, new Peao(Tab, Cor.Preta, this));
        }
    }
}
