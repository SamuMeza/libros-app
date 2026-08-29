'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PhoneInput from '@/components/ui/phone-input'
import AddressForm from '@/components/profile/address-form'
import { isValidPhoneVE, isValidPhoneInternational } from '@/lib/utils/validators'
import type { Profile, Address, PhoneFormat, ProfileUpdateData, AddressCreateData, AddressUpdateData } from '@/types/profile'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneFormat, setPhoneFormat] = useState<PhoneFormat>('ve')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.full_name ?? '')
        setPhone(profileData.phone ?? '')
      }

      const { data: addressesData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      if (addressesData) {
        setAddresses(addressesData)
      }
    } catch {
      setError('Error al cargar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (phone) {
        const isValid = phoneFormat === 've'
          ? isValidPhoneVE(phone)
          : isValidPhoneInternational(phone)
        if (!isValid) {
          setError(phoneFormat === 've'
            ? 'El teléfono debe tener 10 dígitos'
            : 'El teléfono internacional no es válido')
          return
        }
      }

      const updateData: ProfileUpdateData = {
        full_name: fullName.trim(),
        phone: phone || null,
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Perfil actualizado correctamente')
        setProfile((prev) => prev ? { ...prev, ...updateData } : null)
      }
    } catch {
      setError('Error al actualizar el perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddressCreate = async (data: AddressCreateData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    if (data.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { error } = await supabase
      .from('addresses')
      .insert({ ...data, user_id: user.id })

    if (error) {
      throw new Error(error.message)
    }

    setShowAddressForm(false)
    loadProfile()
  }

  const handleAddressUpdate = async (data: AddressUpdateData) => {
    if (!editingAddress) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    if (data.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { error } = await supabase
      .from('addresses')
      .update(data)
      .eq('id', editingAddress.id)

    if (error) {
      throw new Error(error.message)
    }

    setEditingAddress(null)
    loadProfile()
  }

  const handleAddressDelete = async (addressId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)

    if (error) {
      setError(error.message)
    } else {
      loadProfile()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm mb-6">
            {success}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <PhoneInput
                value={phone}
                onChange={(value, format) => {
                  setPhone(value)
                  setPhoneFormat(format)
                }}
                format={phoneFormat}
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Direcciones</h2>
            <button
              onClick={() => {
                setEditingAddress(null)
                setShowAddressForm(true)
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Agregar dirección
            </button>
          </div>

          {showAddressForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
              </h3>
              <AddressForm
                address={editingAddress ?? undefined}
                onSubmit={editingAddress ? handleAddressUpdate : handleAddressCreate}
                onCancel={() => {
                  setShowAddressForm(false)
                  setEditingAddress(null)
                }}
              />
            </div>
          )}

          {addresses.length === 0 && !showAddressForm && (
            <p className="text-gray-500 text-center py-4">
              No tienes direcciones guardadas
            </p>
          )}

          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {address.label && (
                      <p className="font-medium text-gray-900">{address.label}</p>
                    )}
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state}
                      {address.zip_code && ` ${address.zip_code}`}
                    </p>
                    {address.phone && (
                      <p className="text-gray-600">Tel: {address.phone}</p>
                    )}
                    {address.is_default && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address)
                        setShowAddressForm(true)
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleAddressDelete(address.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
