import React from 'react' //importação do react
import Link from 'next/link' // importação do modulo, que inclusive contem um prefetch
import useSWR from 'swr'
import PageTitle from './components/Layout/PageTitle'

const fetcher = (...args) => fetch(...args).then(res => res.json()) //carrega todos os argumentos do fetchar e passa para o fetch arrumadinho é uma promise e vai usar o fetch do broser

const Index = () => { //criando um componente que também é uma função
  const { data, error } = useSWR('/api/get-promo', fetcher) //preceisa de uma url para bbuscar os dados e como irá buscar os dados
  return ( // como eu tenho mais de um componente, colocar entre parenteses
    <div>
      <PageTitle title='Home' />
      <p className='mt-6 text-center'>
        O restaurante X sempre busca por atender melhor seus clientes.<br />
      Por isso não deixe de dar a sua opinião!
      </p>
      <div className='text-center my-12'>
        <Link href='/pesquisa'>
          <a className='bg-blue-400 px-12 py-4 font-bold rounded-lg shadow-lg hover:shadow'>Dar opinião ou sugestão</a>
        </Link>
      </div>
      {!data && <p>Carregando...</p>}
      {!error && data && data.showCoupon &&
        <p className='my-12 text-center'>
          {data.message}
        </p>
      }
    </div>
  )
}

export default Index

