const b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"   // base64 dictionary
const b64u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"   // base64url dictionary
const b64pad = '='

/* base64EncodeData
* Internal helper to encode data to base64 using specified dictionary.
*/
export function base64EncodeData(data: string, len: number, b64x: string) {
  let dst = ""

  let i: number
  for (i = 0; i <= len - 3; i += 3) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2)
    dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
    dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6))
    dst += b64x.charAt(data.charCodeAt(i + 2) & 63)
  }

  if (len % 3 == 2) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2)
    dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4))
    dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2))
    dst += b64pad
  } else if (len % 3 == 1) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2)
    dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4))
    dst += b64pad
    dst += b64pad
  }

  return dst
}

/* base64Encode
* Encode a JavaScript string to base64.
* Specified string is first converted from JavaScript UCS-2 to UTF-8.
*/
export function base64Encode(str: string) {
  const utf8str = btoa(encodeURIComponent(str))
  return base64EncodeData(utf8str, utf8str.length, b64c)
}

/* base64URLEncode
* Encode a JavaScript string to base64url.
* Specified string is first converted from JavaScript UCS-2 to UTF-8.
*/
export function base64URLEncode(str: string) {
  const utf8str = btoa(encodeURIComponent(str))
  return base64EncodeData(utf8str, utf8str.length, b64u)
}

/* base64CharIndex
* Internal helper to translate a base64 character to its integer index.
*/
export function base64CharIndex(c: string) {
  if (c == "+") return 62
  if (c == "/") return 63
  return b64u.indexOf(c)
}

/* base64Decode
* Decode a base64 or base64url string to a JavaScript string.
* Input is assumed to be a base64/base64url encoded UTF-8 string.
* Returned result is a JavaScript (UCS-2) string.
*/
export function base64Decode(data: any) {
  let dst = ""
  let i = 0
  let a = 0, b = 0, c = 0, d = 0

  for (i = 0; i < data.length - 3; i += 4) {
    a = base64CharIndex(data.charAt(i + 0))
    b = base64CharIndex(data.charAt(i + 1))
    c = base64CharIndex(data.charAt(i + 2))
    d = base64CharIndex(data.charAt(i + 3))

    dst += String.fromCharCode((a << 2) | (b >>> 4))
    if (data.charAt(i + 2) != b64pad)
      dst += String.fromCharCode(((b << 4) & 0xF0) | ((c >>> 2) & 0x0F))
    if (data.charAt(i + 3) != b64pad)
      dst += String.fromCharCode(((c << 6) & 0xC0) | d)
  }

  dst = decodeURIComponent(atob(dst))
  return dst
}

/* base64url_sniff
* Check whether specified base64 string contains base64url specific characters.
* Return true if specified string is base64url encoded, false otherwise.
*/
export function base64UrlSniff(base64: string) {
  if (base64.indexOf("-") >= 0) return true
  if (base64.indexOf("_") >= 0) return true
  return false
}