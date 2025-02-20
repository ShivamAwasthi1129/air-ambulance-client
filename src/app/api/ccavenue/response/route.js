import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/ccavenueEncryption';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const encryptedResponse = formData.get('encRequest');
        const decryptedResponse = decrypt(encryptedResponse);

        console.log("Payment Response:", decryptedResponse);

        return NextResponse.json({ status: 'success', data: decryptedResponse });
    } catch (error) {
        return NextResponse.json({ error: 'Error decrypting response' }, { status: 500 });
    }
}
