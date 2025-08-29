export const uploadService = {
  uploadImg
}

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDNAME}/image/upload`

async function uploadImg(base64, folder='Morena foodlist') {
  const FORM_DATA = new FormData()

  FORM_DATA.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
  FORM_DATA.append('file', base64)
  if (folder) {
    FORM_DATA.append('folder', folder)
  }

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: FORM_DATA,
    })
    return res.json()
  }
  catch (err) {
    console.dir(err)
  }
}