import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import StudentMarksheet from "@/lib/modals/studentmarksheets";
import Student from "@/lib/modals/student";
import { auth } from "@/auth";

// GET - Fetch marksheets (with optional studentId filter)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    let query = {};
    if (studentId) {
      query = { studentId };
    }
    
    const marksheets = await StudentMarksheet.find(query)
      .populate('studentId', 'name class section rollNo')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: marksheets 
    });
  } catch (error) {
    console.error("Error fetching marksheets:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST - Create new marksheet
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();

    // Validate student exists
    const student = await Student.findById(data.studentId);
    if (!student) {
      return NextResponse.json({ 
        success: false, 
        error: "Student not found" 
      }, { status: 404 });
    }

    // Check if marksheet already exists for this student and exam
    const existingMarksheet = await StudentMarksheet.findOne({
      studentId: data.studentId,
      examTitle: data.examTitle,
      examType: data.examType
    });

    if (existingMarksheet) {
      return NextResponse.json({ 
        success: false, 
        error: "Marksheet already exists for this student and exam" 
      }, { status: 400 });
    }

    // Create marksheet with student details
    const marksheetData = {
      ...data,
      studentName: student.name,
      rollNumber: student.rollNo,
      class: student.class,
      section: student.section,
      generatedBy: session.user.name || session.user.email
    };

    const marksheet = new StudentMarksheet(marksheetData);
    await marksheet.save();

    return NextResponse.json({ 
      success: true, 
      data: marksheet 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating marksheet:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// PUT - Update existing marksheet
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { _id, ...updateData } = data;
    
    await connectToDatabase();

    const marksheet = await StudentMarksheet.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!marksheet) {
      return NextResponse.json({ 
        success: false, 
        error: "Marksheet not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: marksheet 
    });
  } catch (error) {
    console.error("Error updating marksheet:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// DELETE - Delete marksheet
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const marksheetId = searchParams.get('id');
    
    if (!marksheetId) {
      return NextResponse.json({ 
        success: false, 
        error: "Marksheet ID is required" 
      }, { status: 400 });
    }

    await connectToDatabase();

    const marksheet = await StudentMarksheet.findByIdAndDelete(marksheetId);

    if (!marksheet) {
      return NextResponse.json({ 
        success: false, 
        error: "Marksheet not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Marksheet deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting marksheet:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// Force Node.js runtime to support Mongoose
export const runtime = 'nodejs';