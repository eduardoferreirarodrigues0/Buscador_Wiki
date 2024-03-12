import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import casaIcone from './casa-icon.png';

const DetalhesEvento = () => {
  // Obter a localização da rota para acessar os dados passados como estado
  const location = useLocation();
  const evento = location.state?.evento || {};

  // Função para renderizar a descrição do evento
  const renderDescricao = () => {
    if (!evento.descricao) {
      return null;
    }
    // Dividir a descrição em parágrafos com base em títulos
    const paragrafos = evento.descricao.split(/(==[^=]+==)/).filter(Boolean);

    return paragrafos.map((trecho, index) => {
      const isTitulo = trecho.startsWith('==') && trecho.endsWith('==');

      return (
        <p key={index}>
          {isTitulo ? (
            // Se o trecho for um título, destacá-lo de alguma forma (usando uma classe, por exemplo)
            <span className="destaque-titulo">{trecho}</span>
          ) : (
            // Se não for um título, exibir o trecho sem formatação adicional
            trecho.trim()
          )}
        </p>
      );
    });
  };

  return (
    <div className="detalhesEventoPage">
      <div className="detalhesEventoContainer">
        <h1>Detalhes da sua Busca</h1>
        {/* Ícone e link para retornar à página inicial */}
        <div className="voltarContainer">
          <Link to="/" className="voltarLink">
            <img src={casaIcone} alt="Home" className="iconeCasa" />
          </Link>
        </div>
        {/* Conteúdo dos detalhes do evento */}
        <div className="detalhesEventoContent">
          <h3>{evento.titulo}</h3>
          {/* Exibir imagem do evento, se disponível */}
          {evento.imagem && <img src={evento.imagem} alt={evento.titulo} className="eventoImagem" />}
          {/* Chamar a função para renderizar a descrição do evento */}
          {renderDescricao()}
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;
