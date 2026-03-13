export default (phoneNumber: string, whatsappMessage: string) => {
  return `https://wa.me/${phoneNumber}?text=${whatsappMessage}`
}
