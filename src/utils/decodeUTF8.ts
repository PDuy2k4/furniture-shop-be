export const decodeStringUTF8 = (str: any) => {
  // Tạo một Uint8Array từ chuỗi và giải mã bằng TextDecoder
  const bytes = new Uint8Array(str.split('').map((char: any) => char.charCodeAt(0)))
  const decoded = new TextDecoder().decode(bytes)
  return decoded
}
