import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import StudentMarksheet from '@/lib/modals/studentmarksheets';

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is a student
    if (session.user.role !== 'student') {
      return NextResponse.json(
        { error: 'Access denied. Students only.' },
        { status: 403 }
      );
    }
    
    await connectToDatabase();
    
    // Find marksheets for the logged-in student
    const marksheets = await StudentMarksheet.find({
      studentId: session.user.id
    })
    .sort({ generatedDate: -1 }) // Sort by newest first
    .lean();
    
    if (!marksheets || marksheets.length === 0) {
      return NextResponse.json(
        { message: 'No marksheets found', marksheets: [] },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      message: 'Marksheets fetched successfully',
      marksheets
    });
    
  } catch (error) {
    console.error('Error fetching student marksheets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}