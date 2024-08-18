export default function generatePassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?'

  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  const allChars = uppercase + lowercase + numbers + specialChars
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')

  return password
}
