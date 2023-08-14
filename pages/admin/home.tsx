import type { NextPage } from 'next'
import { useAuth } from '../../context/auth'
import Admin from '../../modules/admin/home/Admin'
import User from '../../modules/admin/home/User'

const Home: NextPage = () => {
  const { usuario, rolUsuario } = useAuth()

  return <>{rolUsuario?.nombre === 'Usuario' ? <User /> : <Admin />}</>
}
export default Home
