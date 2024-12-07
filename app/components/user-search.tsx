'use client'

import { useState, useCallback } from 'react'
import AsyncSelect from 'react-select/async'
import { searchUsers, deleteUser } from '@/app/actions/actions'
import { UserCard } from './user-card'
import { User } from '@/app/actions/schemas'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { debounce } from 'lodash'

interface Option {
  value: string
  label: string
  user: User
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearchUsers = useCallback(
    debounce(async (inputValue: string, callback: (options: Option[]) => void) => {
      setIsLoading(true)
      try {
        const users = await searchUsers(inputValue)
        const options = users.map((user: User) => ({ value: user.id, label: user.name, user }))
        callback(options)
      } catch (error) {
        toast.error('Failed to load users. Please try again.')
        callback([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    debouncedSearchUsers(inputValue, callback)
  }

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setSelectedUser(updatedUser)
  }

  const handleUserDeleted = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast.success('User deleted successfully')
      setSelectedUser(null)
    } catch (error) {
      toast.error('Failed to delete user. Please try again.')
    }
  }

  const handleClearSelection = () => {
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          placeholder="Search for a user..."
          className="w-full max-w-md"
          isLoading={isLoading}
          aria-label="Search for a user"
          noOptionsMessage={() => "No users found"}
          isClearable
          value={selectedUser ? { value: selectedUser.id, label: selectedUser.name, user: selectedUser } : null}
        />
        {selectedUser && (
          <Button onClick={handleClearSelection} variant="outline">
            Clear Selection
          </Button>
        )}
      </div>
      {selectedUser && (
        <UserCard 
          user={selectedUser} 
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  )
}

