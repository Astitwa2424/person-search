import { NextRequest, NextResponse } from 'next/server';
import { searchUsers, addUser, editUser, deleteUser } from '@/app/actions/actions';
import { UserFormData } from '@/app/actions/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const users = await searchUsers(query);
    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userData: UserFormData = await request.json();

  try {
    const newUser = await addUser(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { id, ...userData }: { id: string } & Partial<UserFormData> = await request.json();

  try {
    const updatedUser = await editUser(id, userData);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    await deleteUser(id);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

