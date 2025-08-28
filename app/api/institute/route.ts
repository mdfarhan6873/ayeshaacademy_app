import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Institute details - in a real app, this would come from database
    const instituteDetails = {
      name: "SAHEEN EDUCATIONAL AND WELFAR",
      upiId: "saheenedu123@sbi",
      qrCode: "upi://pay?pa=saheenedu123@sbi&pn=SAHEEN%20EDUCATIONAL%20AND%20WELFARE%20TRUST&mc=3526&tr=&tn=&am=&cu=INR&url=&mode=02&purpose=00&orgid=180102&sign=MEYCIQDRc6IzG/qTM5l/0QBjij0D++maYrV7cch/eQ7m2zXcpwIhAPAIzdvv8pFLWWtB/6LYWKRc6s+833KPLbv3ZBPHbidW",
      address: "Affan Colony, Ramghat, Purnea (Bihar) - 854301",
      phone: "+91 7368883140",
      email: "ayeshaacademy24@gmail.com"
    };

    return NextResponse.json({ institute: instituteDetails });
  } catch (error) {
    console.error('GET /api/institute error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}