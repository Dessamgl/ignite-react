import { createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --red: #e52e4d;
    --blue: #5429cc;
    --blue-light: #6933ff;
    --green: #33cc95;

    --text-title: #363f5f;
    --text-body: #969cb3;

    --background: #f0f2f5;
    --shape: #ffffff;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    @media (max-width: 1000px) {
      font-size: 93.75% //15px 
    }

    @media (max-width: 720px) {
      font-size: 87.5% //14px (16 X 0,875 = 14px)
    }
  }

  //REM = 1rem = font-size (se o font-seze da pagina for igual a 16 px, 1 rem é 16px) = 16px
  //conforme o tamanho da tela do usuário, se utilizado o REM, para definir tamanho de botões
  // imagens, logo e icones, toda a aplicação vai se adaptar melhor conforme a tela

  //pq usar porcentagem ao invés do px direto ? (93.75% ao invés de  15px), se o usuário 
  //for mudar o tamanho da fonte no celular, com porcentagem irá modificar, com unidade de medida ficará
  //estático, independente do tamanho que o usuário setar no celular

  body {
    background: var(--background);
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 600;
  }

  button {
    cursor: pointer;
  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

.react-modal-overlay {
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.react-modal-content {
  width: 100%;
  max-width: 576px;
  background: var(--background);
  padding: 3rem;
  position: relative;
  border-radius: 0.24rem;
}

.react-modal-close {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  border: 0;
  background: transparent;

  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.8);
  }
}
`;
