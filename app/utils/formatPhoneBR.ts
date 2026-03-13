export default (phone: string) => {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('55') && digits.length === 13) {
    const ddd = digits.slice(2, 4)
    const part1 = digits.slice(4, 9)
    const part2 = digits.slice(9)

    return `+55 (${ddd}) ${part1}-${part2}`
  }

  return phone
}
