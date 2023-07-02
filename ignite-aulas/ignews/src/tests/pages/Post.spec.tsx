import {render, screen} from '@testing-library/react'
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, {getServerSideProps} from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')
jest.mock("next-auth/client")

const post ={ slug: 'my-new-post', title: 'My New Post', content: '<p>Post excerpt</p>', updatedAt: '10 de Abril'}

describe('Post page', () => {
  it('renders correctly', () => {


    render(<Post post={post}/>)

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    //chamamos a função 
    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any)

    //e aqui passamos o que esperamos de resposta dele
    //esperamos que a resposta seja um objeto contendo:
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post content'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

     //chamamos a função 
     const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any)

    //e aqui passamos o que esperamos de resposta dele
    //esperamos que a resposta seja um objeto contendo:
    expect(response).toEqual(
      expect.objectContaining({
        props:{
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abri de 2021',
          },
        }
      })
    )
  })
})