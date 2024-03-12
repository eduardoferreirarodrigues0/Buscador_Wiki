import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Retrospectiva = () => {
  // Estados para controlar o input de nome, input de busca, resultados de eventos, e estados de carregamento e exibição
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [eventos, setEventos] = useState([]);
  const [exibindoResultados, setExibindoResultados] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função assíncrona para buscar eventos na Wikipedia
  const buscarEventos = async () => {
    try {
      setLoading(true);

      // Chamada à API da Wikipedia para buscar resultados relacionados à busca
      const response = await axios.get(
        `https://pt.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=15&gsrsearch=${data}`
      );

      // Extrai as páginas da resposta
      const pages = response.data.query.pages;

      // Verifica se há resultados
      if (Object.keys(pages).length > 0) {
        // Mapeia as páginas para buscar informações detalhadas de cada uma
        const resultados = await Promise.all(
          Object.values(pages).map(async (page) => {
            const { titulo, imagem, descricao } = await buscarInformacoesDetalhadas(page.pageid);

            return {
              titulo,
              imagem,
              descricao,
            };
          })
        );

        // Atualiza o estado dos eventos e exibe os resultados
        setEventos(resultados);
        setExibindoResultados(true);
        
        // Navega para a rota de resultados, passando os eventos e o nome como estado
        navigate('/resultado', { state: { eventos: resultados, nome } });
      } else {
        // Caso não haja resultados, exibe uma entrada padrão e navega para a rota de resultados
        setEventos([{ titulo: 'Nenhum evento encontrado', imagem: null, descricao: '' }]);
        setExibindoResultados(true);
        navigate('/resultado', { state: { eventos, nome } });
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função assíncrona para buscar informações detalhadas de uma página da Wikipedia
  const buscarInformacoesDetalhadas = async (pageid) => {
    try {
      // Chamada à API da Wikipedia para obter informações detalhadas de uma página
      const pageResponse = await axios.get(
        `https://pt.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages|extracts&piprop=original&explaintext=true&pageids=${pageid}`
      );

      // Extrai os dados da página
      const pageData = pageResponse.data.query.pages[pageid];
      const titulo = pageData.title;
      const imagem = pageData.original ? pageData.original.source : null;
      const descricao = pageData.extract || '';

      return { titulo, imagem, descricao };
    } catch (error) {
      console.error('Erro ao buscar informações detalhadas:', error);
      return { titulo: '', imagem: null, descricao: '' };
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    await buscarEventos();
  };

  return (
    <div className="retrospectivaContainer">
      <div className="retrospectivaConteudo">
        <h1 className="titulo">Buscador</h1>
        <form className="formulario" onSubmit={handleSubmit}>
          {/* Input para o nome */}
          <label>
            <span className="labelText">Nome:</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              className="inputCampo"
            />
          </label>
          <br />
          {/* Input para a busca */}
          <label>
            <span className="labelText">O que você gostaria de buscar?</span>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Digite sua busca"
              className="inputCampo"
            />
          </label>
          <br />
          {/* Botão de envio do formulário */}
          <button className="botaoFormulario" type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'OK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Retrospectiva;
