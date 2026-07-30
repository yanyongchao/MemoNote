import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT } from "jose";

const scrypt = promisify(scryptCallback);
const passwordKeyLength = 64;

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const derivedKey = (await scrypt(password, salt, passwordKeyLength)) as Buffer;

	return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	const [algorithm, salt, hash] = passwordHash.split(":");

	if (algorithm !== "scrypt" || !salt || !hash) {
		return false;
	}

	const expected = Buffer.from(hash, "hex");
	const actual = (await scrypt(password, salt, expected.length)) as Buffer;

	return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function createAuthToken(
	userId: number,
	email: string,
	secret: string,
	expiresInSeconds: number,
): Promise<string> {
	const secretKey = new TextEncoder().encode(secret);

	return new SignJWT({ email })
		.setProtectedHeader({ alg: "HS256", typ: "JWT" })
		.setSubject(String(userId))
		.setIssuedAt()
		.setExpirationTime(`${expiresInSeconds}s`)
		.sign(secretKey);
}
