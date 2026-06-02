import { WalletCards, X } from "lucide-react"

export function DevelopmentModals() {
  return (
    <>
      <section
        id="modulo-financeiro-em-desenvolvimento"
        className="fixed inset-0 z-[2000] hidden items-center justify-center bg-[#071D5B]/65 px-4 backdrop-blur-sm target:flex"
      >
        <a
          href="#fechar"
          className="absolute inset-0 h-full w-full"
          aria-label="Fechar aviso"
        />

        <div className="relative z-[2001] w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-2xl">
          <a
            href="#fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#071D5B] text-white"
            aria-label="Fechar aviso"
          >
            <X size={22} />
          </a>

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071D5B] text-white">
            <WalletCards size={30} />
          </div>

          <h2 className="text-2xl font-black text-[#071D5B]">
            Módulo de pagamentos em desenvolvimento
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            Este módulo será pensado para segunda via de boletos, consulta de
            mensalidades, conferência de pagamentos, importação de retorno
            bancário e acompanhamento financeiro da escola.
          </p>

          <a
            href="#fechar"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#E4252A] px-6 py-4 font-black text-white"
          >
            Entendi
          </a>
        </div>
      </section>
    </>
  )
}