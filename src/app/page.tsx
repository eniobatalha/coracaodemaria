import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { DifferentialsSection } from "@/components/sections/DifferentialsSection"
import { SegmentsSection } from "@/components/sections/SegmentsSection"
import { PedagogySection } from "@/components/sections/PedagogySection"
import { GallerySection } from "@/components/sections/GallerySection"
import { MissionSection } from "@/components/sections/MissionSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { DevelopmentModals } from "@/components/ui/DevelopmentModals"
import { WhatsAppUnitDialog } from "@/components/ui/WhatsAppUnitDialog"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <DifferentialsSection />
        <SegmentsSection />
        <PedagogySection />
        <GallerySection />
        <MissionSection />
        <ContactSection />
      </main>
      <Footer />
      <DevelopmentModals />
      <WhatsAppUnitDialog />
    </>
  )
}