import { useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import Head from "next/head";
import Link from "next/link";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps ) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews </title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div 
            className={`${styles.postContent} ${styles.previewContent}`} 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading ?
            <Link href="/">
            <a href="">subscribe now 🤗</a> 
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

//ele retorna nos paths, quais previews de posts eu quero gerar durante a build. passando vazio ele será gerado de forma estatica conforme os usuarios acessam
//fallback true - Caso alguém acesse um post que ainda n foi gerado de forma estatica, ele carregara o conteúdo pelo lado do browser
//fallback false - se o post n for gerado de forma estatica ainda, gerará um erro 404 (quando ja gerou todos os conteudos estaticos nos paths, e o que n tiver nos paths da erro)
//falback blocking - parecido com o true, mas ele vai tentar carregar o conteúdo na camada do next, so quando todo o conteudo tiver carregado ele mostrará (quando podem surgir novos conteúdos ou quando n carregamos os caminhos no paths)
//so existe em paginas com parametros dinamicos
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient()

  //buscar qualquer documento pelo id dele
  const response = await prismic.getByUID('post', String(slug), {})
  
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  }
}