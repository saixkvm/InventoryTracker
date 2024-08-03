'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Modal, Stack, TextField, Button} from '@mui/material'
import { firestore } from '../firebase'
import { query, collection, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore'
import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })


const Home = () => {


  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemname, setItemname] = useState('')
  const [sitem, setsitem] = useState(null)
  const [searchResults, setSearchResults] = useState(null)

  const updateInventory = async() => {
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    docs.forEach((doc) => {
      inventoryList.push(
        {
          name:doc.id,
          ...doc.data()
        }
      )
    })
    setInventory(inventoryList)
    console.log(inventoryList);
  } 
  const removeItems = async(item) => {
    const docRef = doc(collection(firestore,'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {count} = docSnap.data();
      if (count === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {count: count - 1})
      }
    }

    await updateInventory();
  }
  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {count} = docSnap.data();

      await setDoc(docRef, {count:count + 1})
    }
    else{
      await setDoc(docRef, {count: 1})
    }

    await updateInventory();
  }
  const handleSearch = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {count} = docSnap.data();
      setSearchResults({item, count})
    }
    else{
      setSearchResults(null)
    }

  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  useEffect(() => {
    updateInventory()
  },[])

  return (
    <Box 
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      justifyContent="center" 
      flexDirection="column"
      alignItems = "center" 
      gap = {2}
      >
      
      <Modal 
        open = {open}
        onClose={handleClose}>
        <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
          >
            <Typography variant='h6'>Add Item</Typography>
            <Stack width = "100%" direction ="row" spacing = {2}>
              <TextField
                variant = 'outlined'
                fullwdith 
                value = {itemname}
                onChange = {(e) => {
                  setItemname(e.target.value)
                }}
              >
              </TextField>
              <Button variant = "outlined" onClick = {() => {
                addItem(itemname)
                setItemname('')
                handleClose()
              }}>Add</Button>

            </Stack>
          </Box>
      </Modal>

    <Box 
    width = "800px" 
    height = "100px" 
    // bgcolor = "#ADD8E6"
    display = "flex"
    alignItems= "center"
    justifyContent="center"
    >

    <Typography 
    variant='h2' 
    color = "#333"
    className = {inter.className}>
      Inventory Items
    </Typography>
    </Box>

    <Stack
    width="60%"
    direction="row"
    spacing={2}
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <TextField
      variant='outlined'
      fullWidth
      value={sitem}
      onChange={(e) => {
        setsitem(e.target.value)
      }}
    />
    <Button variant="outlined" 
            onClick= {() => {
              handleSearch(sitem)
              setsitem('')
            }
            }>
      Search
    </Button>
  </Stack>

  {searchResults && 
    (
    <Box mt={2}>
      {
        (
        <>
          <Stack direction="row" spacing={2}>
            <Typography className = {inter.className}>Item: {searchResults.item}</Typography>
            <Typography className = {inter.className}>Count: {searchResults.count}</Typography>
          </Stack>
        </>
      )}
    </Box>
  )}
      
    <Box border = "1px solid #333">
    

    <Stack 
        width = "800px"
        height = "300px"
        spacing = {2}
        overflow = "auto">
        {
          inventory.map(({name, count}) => (
            
              <Box key = {name}
              width= "100%"
              minHeight="150px"
              display ="flex"
              alignItems="center"
              justifyContent="space-between"

              padding={5}
              >
              
              <Typography variant = "h4"color = "#333" textAlign="center" className = {inter.className}>{name}</Typography>
              <Typography variant = "h4" color = "#333" className = {inter.className}>{count}</Typography>


              <Box display = "flex" sx={{ gap: 2 }}>
                <Button variant = "contained" onClick={() => addItem(name)}>Add</Button>
                <Button variant = "contained" onClick={() => removeItems(name)}>Remove</Button>
              </Box>
              
              </Box>
            
            
          ))}
    </Stack>

    </Box>

    <Button 
      variant = "contained"
      onClick = {() => {
        handleOpen()
      }}>
      Add New Item
      </Button>
    
    </Box>
  )
}

export default Home;
