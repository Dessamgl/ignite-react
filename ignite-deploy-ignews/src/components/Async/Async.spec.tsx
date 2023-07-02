import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async/>)

  expect(screen.getByText('Hello World')).toBeInTheDocument()

  //o button leva 1seg para aparecer em tela
  //uma das alternativas serve apenas para componentes (apareceu ou nao em tela), método: findByText 
  //..ele tem todos os métodos que começam com get, ele tem sua versão com o find tbm, ele espera algo aparecer em tela (retorna uma promise, precisa do async await)
  
  //expect(await screen.findByText('Button')).toBeInTheDocument()


  //await waitForElementToBeRemoved(screen.queryByText('Button'))

  // outra forma de fazer é com o waitFor
  await waitFor(() => {
    return expect(screen.queryByText('Button')).not.toBeInTheDocument()
  })
}) 