import React, { useEffect, useState, useCallback } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
} from '@coreui/react'
import { useItemContext } from '../hooks/useItemContext'

const API_URL = 'http://localhost:4020'

export default function Add() {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [itemName, setItemName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { addItem } = useItemContext()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!itemName) return

      setErrorMessage(null)

      const url = new URL(API_URL)
      url.pathname = '/api/nodeId'

      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nodeId: itemName }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        addItem(itemName)
        setModalVisible(false)
        console.log('Item added:', data)
      } catch (error) {
        setErrorMessage('Error adding item: ' + error)
        setItemName('')
        console.error('Error adding item:', error)
      }
    },
    [itemName, addItem]
  )

  useEffect(() => {
    if (modalVisible) {
      setItemName('')
      setErrorMessage(null)
    }
  }, [modalVisible])

  return (
    <>
      <CButton
        color='primary'
        onClick={() => setModalVisible(true)}
      >
        Add New Item
      </CButton>
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CForm onSubmit={handleSubmit}>
          <CModalHeader>
            <CModalTitle>Add Item</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {errorMessage && <CAlert color='danger'>{errorMessage}</CAlert>}
            <CFormInput
              type='text'
              label='Item Name'
              placeholder='ns=3;i=1001'
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </CModalBody>
          <CModalFooter>
            <CButton
              color='secondary'
              onClick={() => setModalVisible(false)}
            >
              Close
            </CButton>
            <CButton
              color='primary'
              type='submit'
            >
              Add
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}
