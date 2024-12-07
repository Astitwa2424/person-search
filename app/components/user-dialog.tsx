'use client'

import { addUser, editUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

interface UserDialogProps {
  user?: User
  onUserUpdated?: (updatedUser: User) => void
}

export function UserDialog({ user, onUserUpdated }: UserDialogProps) {
  const handleUserAction = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      let actionResult: User
      if (user) {
        actionResult = await editUser(user.id, data)
        onUserUpdated?.(actionResult)
      } else {
        actionResult = await addUser(data)
      }
      return {
        success: true,
        message: `User ${actionResult.name} ${user ? 'updated' : 'added'} successfully`,
        data: actionResult
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to ${user ? 'update' : 'add'} user`
      }
    }
  }

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleUserAction}
      triggerButtonLabel={user ? "Edit User" : "Add User"}
      addDialogTitle="Add New User"
      editDialogTitle="Edit User"
      dialogDescription={user ? "Edit user information below." : "Fill out the form below to add a new user."}
      submitButtonLabel={user ? "Update User" : "Add User"}
      defaultValues={user}
    />
  )
}

