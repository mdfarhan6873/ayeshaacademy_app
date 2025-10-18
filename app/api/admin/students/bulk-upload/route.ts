import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Student from "@/lib/modals/student";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import * as XLSX from 'xlsx';

// Configure route to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST - Bulk upload students from Excel
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: "Only Excel files (.xlsx, .xls) are allowed" }, { status: 400 });
    }

    await connectToDatabase();

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    const students: any[] = [];
    const errors: string[] = [];
    const duplicateMobiles: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;

      // Validate required fields
      const requiredFields = ['name', 'class', 'section', 'rollNo', 'mobileNo', 'password', 'parentName', 'parentMobileNo', 'address'];
      const missingFields = requiredFields.filter(field => !row[field]);

      if (missingFields.length > 0) {
        errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`);
        continue;
      }

      // Check for duplicate mobile in existing database
      const existingStudent = await Student.findOne({ mobileNo: row.mobileNo });
      if (existingStudent) {
        duplicateMobiles.push(row.mobileNo);
        continue;
      }

      // Check for duplicate mobile in current upload
      const duplicateInUpload = students.find(s => s.mobileNo === row.mobileNo);
      if (duplicateInUpload) {
        duplicateMobiles.push(row.mobileNo);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(row.password.toString(), 12);

      students.push({
        name: row.name.toString().trim(),
        class: row.class.toString().trim(),
        section: row.section.toString().trim(),
        rollNo: row.rollNo.toString().trim().padStart(2, '0'),
        mobileNo: row.mobileNo.toString().trim(),
        password: hashedPassword,
        role: "student",
        parentName: row.parentName.toString().trim(),
        parentMobileNo: row.parentMobileNo.toString().trim(),
        address: row.address.toString().trim()
      });
    }

    // Insert students
    const insertedStudents = await Student.insertMany(students);

    const response = {
      message: `Data successfully uploaded! ${insertedStudents.length} out of ${jsonData.length} students were added to the system.`,
      totalRows: jsonData.length,
      successfulUploads: insertedStudents.length,
      errors: errors,
      duplicateMobiles: duplicateMobiles
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error bulk uploading students:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Force Node.js runtime to support Mongoose
export const runtime = 'nodejs';
