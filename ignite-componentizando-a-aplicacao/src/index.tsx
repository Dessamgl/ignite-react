import { render } from 'react-dom'
import { MovieCatalogProvider } from './contexts/MovieCatalogContext';

import { App } from './App'

render(
  <MovieCatalogProvider>
    <App />
  </MovieCatalogProvider>, 
  document.getElementById('root')
)
