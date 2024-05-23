export async function isValidPassword(password: string, hashedPassword: string) {
    return await hashPasswprd(password) === hashedPassword
}

async function hashPasswprd(password: string) {
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))

    return Buffer.from(arrayBuffer).toString("base64")
}