import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/ccavenueEncryption';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const encryptedResponse = formData.get('encRequest');
        const decryptedResponse = decrypt(encryptedResponse);

        // return NextResponse.json({ status: 'success', data: decryptedResponse });
        return NextResponse.redirect(
            new URL(`/payment-success?${decryptedResponse}`, process.env.LOCAL_URL)
        );
    } catch (error) {
        console.error("error", error)
        return NextResponse.json({ error: 'Error decrypting response' }, { status: 500 });
    }
}
