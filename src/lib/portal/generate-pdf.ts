export async function htmlToPdf(htmlContent: string, filename: string): Promise<void> {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ])

  // Strip any <script> blocks to avoid re-execution
  const clean = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, "")

  const container = document.createElement("div")
  container.style.cssText =
    "position:absolute;left:-9999px;top:0;width:794px;background:#fff"
  container.innerHTML = clean
  document.body.appendChild(container)

  // Give the browser a tick to lay out the content before measuring
  await new Promise((r) => setTimeout(r, 80))

  try {
    const fullHeight = container.scrollHeight

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: 794,
      height: fullHeight,
      windowWidth: 794,
      windowHeight: fullHeight,
    })

    const imgData = canvas.toDataURL("image/jpeg", 1.0)
    const pdf    = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageW  = pdf.internal.pageSize.getWidth()
    const pageH  = pdf.internal.pageSize.getHeight()
    const imgH   = (canvas.height * pageW) / canvas.width

    let remaining = imgH
    let yPos      = 0

    pdf.addImage(imgData, "JPEG", 0, yPos, pageW, imgH)
    remaining -= pageH

    while (remaining > 0) {
      yPos -= pageH
      pdf.addPage()
      pdf.addImage(imgData, "JPEG", 0, yPos, pageW, imgH)
      remaining -= pageH
    }

    pdf.save(filename)
  } finally {
    document.body.removeChild(container)
  }
}
