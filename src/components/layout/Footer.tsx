import { schoolInfo } from "@/types/school"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#061646] py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white p-3">
            <Image
              src="/images/logo-coracao-de-maria.png"
              alt="Logo do Colégio e Curso Coração de Maria"
              width={120}
              height={70}
              className="h-14 w-auto object-contain"
            />
          </div>

          <div>
            <strong className="block text-lg">{schoolInfo.name}</strong>
            <span className="text-sm text-blue-100">{schoolInfo.slogan}</span>
          </div>
        </div>

        <div className="text-sm leading-7 text-blue-100 lg:text-right">
          <p>Cabo: {schoolInfo.phoneCabo}</p>
          <p>Gaibu: {schoolInfo.phoneGaibu}</p>
          <p>{schoolInfo.address}</p>
        </div>
      </div>
    </footer>
  )
}