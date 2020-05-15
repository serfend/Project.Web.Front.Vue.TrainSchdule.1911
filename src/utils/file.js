export function fileToBase64(data, fileType) {
  return new Promise((res, rej) => {
    var reader = new FileReader()
    reader.onload = function(evt) {
      res(evt.target.result)
    }
    reader.onerror = function(evt) {
      rej(evt)
    }
    if (!fileType) fileType = 'image/jpg'
    var blob = new Blob([data], {
      type: fileType
    })
    reader.readAsDataURL(blob)
  })
}
