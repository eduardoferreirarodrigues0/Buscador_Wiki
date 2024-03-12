import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import casaIcone from './casa-icon.png';

const Resultado = () => {
  // Obter a localização da rota para acessar os dados passados como estado
  const location = useLocation();
  const eventos = location.state?.eventos || [];
  const nome = location.state?.nome || '';
  const navigate = useNavigate();

  // Estado para controlar se os resultados estão sendo exibidos
  const [exibindoResultados] = useState(true);

  // Extração de resultados adicionais para mostrar em uma rota separada
  const resultadosAdicionais = eventos.slice(6);
  console.log('Dados para MaisResultados:', resultadosAdicionais);

  // Atualizar o título da página com base no nome
  useEffect(() => {
    document.title = `Resultado para ${nome}`;
  }, [nome]);

  // Função para cortar a descrição do evento se for muito longa
  const cortarDescricao = (descricao, tamanho) => {
    return descricao.length > tamanho ? `${descricao.slice(0, tamanho)}...` : descricao;
  };

  // Função para navegar para a página de detalhes do evento
  const mostrarDetalhes = (evento) => {
    navigate('/detalhes-evento', { state: { evento } });
  };

  return (
    <div>
      {exibindoResultados && (
        <div className="paginaCentralizada">
          <h2 className="tituloCentralizado">Olá {nome}, este é o resultado da sua pesquisa:</h2>
          <div className="cartaoEventoContainer">
            {eventos.length > 0 ? (
              eventos.slice(0, 6).map((evento, index) => (
                <div key={index} className="cartaoEvento">
                  <h3>{evento.titulo}</h3>
                  {evento.imagem && <img src={evento.imagem} alt={evento.titulo} />}
                  <p>
                    {cortarDescricao(evento.descricao, 100)}
                  </p>
                  <button className="verDetalhesBotao" onClick={() => mostrarDetalhes(evento)}>Ver Detalhes</button>
                </div>
              ))
            ) : (
              <p>Nenhum resultado significativo encontrado para você.</p>
            )}
          </div>
        </div>
      )}
      {/* Botão para ver mais resultados, redirecionando para uma rota separada */}
      <button
        className="mostrarMaisBotao"
        onClick={() => navigate('/mais-resultados', { state: { eventos: resultadosAdicionais } })}>
        Ver mais resultados
      </button>
      {/* Ícone e link para retornar à página inicial */}
      <div className="voltarContainer">
        <Link to="/" className="voltarLink">
          <img src={casaIcone} alt="Home" className="iconeCasa" />
        </Link>
      </div>
    </div>
  );
};

export default Resultado;
