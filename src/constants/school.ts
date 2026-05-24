export const schoolInfo = {
  name: "Colégio e Curso Coração de Maria",
  slogan: "Educação eternamente abençoada",
  whatsapp: "5581986412560",
  phoneCabo: "(81) 3521-9444",
  phoneGaibu: "(81) 3521-0943",
  instagram: "#",
  address: "Cabo de Santo Agostinho e Gaibu",
  portalUrl: "#",
  units: [
    {
      name: "Unidade Cabo (Vila Social)",
      shortName: "Unidade Cabo (Vila Social)",
      whatsapp: "5581986412560",
      phone: "(81) 3521-9444",
      address:
        "R. Manoel Lélis Barbosa, 4 - Vila Dr. Manoel Clementino, Cabo de Santo Agostinho - PE, 54510-270",
      mapsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=-8.2801935,-35.0295701",
      instagramLabel: "@coracaodemariavila",
      instagramUrl: "https://www.instagram.com/coracaodemariavila/",
    },
    {
      name: "Unidade Gaibu",
      shortName: "Unidade Gaibu",
      whatsapp: "5581986412560",
      phone: "(81) 3521-0943",
      address:
        "Av. Laura Cavalcante - Gaibu, Cabo de Santo Agostinho - PE, 54515-160",
      mapsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=-8.3378264,-34.9532053",
      instagramLabel: "@coracaodemariagaibu",
      instagramUrl: "https://www.instagram.com/coracaodemariagaibu/",
    },
  ],
}

export function createWhatsAppLink(unitName: string, whatsapp: string) {
  const message = `Olá! Vim pelo site institucional do Colégio e Curso Coração de Maria e gostaria de receber informações sobre matrícula para meu filho(a) na ${unitName}. Poderiam me orientar sobre vagas, turmas, valores e próximos passos?`

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}