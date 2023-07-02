import {render, screen} from '@testing-library/react'
import { mocked } from 'ts-jest/utils';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock("next-auth/client")
jest.mock("next/router", () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {


    render(<Home product={{priceId: 'fake-price-id', amount:'R$10,00' }}/>)

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    //mock da função dentro do stripe
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    //toda vez que chamamrmos o "retrieveStripePricesMocked" queremos mocar o valor que ela retorna (ela retorna sempre uma promise)
    //por isso utilizamos o mockResolvedValueOnce
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    //chamamos a função 
    const response = await getStaticProps({})

    //e aqui passamos o que esperamos de resposta dele
    //esperamos que a resposta seja um objeto contendo:
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})