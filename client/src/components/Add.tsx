import { API_URL } from '../config'
import { useItemContext } from '../hooks/useItemContext'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

export default function Add() {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [itemName, setItemName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { addItem } = useItemContext()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      setLoading(true)
      e.preventDefault()
      if (!itemName) return

      setErrorMessage(null)

      API_URL.pathname = '/api/nodeId'

      try {
        const response = await fetch(API_URL.toString(), {
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
      } catch (error) {
        setErrorMessage('Error adding item: ' + error)
        setItemName('')
        console.error('Error adding item:', error)
      } finally {
        setLoading(false)
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
      <Button
        variant='contained'
        color='primary'
        onClick={() => setModalVisible(true)}
      >
        Add New Item
      </Button>
      <Dialog
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
            {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
            <TextField
              autoFocus
              margin='dense'
              label='Node ID'
              type='text'
              fullWidth
              variant='outlined'
              placeholder='ns=3;i=1001'
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color='secondary'
              onClick={() => setModalVisible(false)}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              color='primary'
              type='submit'
              disabled={loading}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
