import React from 'react'
import Link from 'next/link'
import PageTitle from './components/Layout/PageTitle'

const Sobre = () => {
  return ( //como eu tenho mais de um componente colocar entre parenteses
    <div>
      <PageTitle title='Sobre' />
      <h1>Sobre</h1>
      <div>
        <Link href='/'>
          <a>Home</a></Link>
      </div>
    </div>
  )
}

export default Sobre