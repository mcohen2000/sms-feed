import { LoginForm } from '~/app/_components/LoginForm'

export default function AdminLogin() {
  return (
  <div className='h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
    <div className='bg-white flex flex-col justify-center items-center gap-4 p-4 rounded-md'>
    <h1 className='text-3xl'>Login</h1>
    <LoginForm />
    </div>
  </div>
  )
}
