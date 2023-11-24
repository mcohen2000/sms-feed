import { RegisterForm } from "~/app/_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex flex-col items-center justify-center gap-4 bg-slate-400 p-4">
        <h1 className="text-3xl">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
