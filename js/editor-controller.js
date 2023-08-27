'use strict'

var gElCanvas
var gCtx
var gStartPos
var gIsMemeSave = false

function renderMeme() {
	const meme = getMeme()
	const img = new Image()
	const selectedImg = getImg(meme)

	if (!selectedImg) return

	const uploadImg = selectedImg.keywords.includes('upload')
	img.src = uploadImg ? `${selectedImg.url}` : `imgs/imgs-square/${selectedImg.url}`

	img.onload = () => {
		resizeCanvas()

		gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
		drawText()

		renderTextInput()
		gCtx.save()
	}
}

function renderTextInput() {
	const line = getLine()

	if (!line) document.querySelector('input[name="line"]').value = ''
	else document.querySelector('input[name="line"]').value = line.txt
}

function drawText() {
	const lines = getLines()

	if (!lines) return

	gCtx.lineWidth = 2
	gCtx.textBaseline = 'top'

	lines.forEach(line => {
		const { txt, align, size, font, color, stroke, pos } = line

		gCtx.textAlign = align
		gCtx.font = `${size}px ${font}`
		gCtx.fillStyle = color
		gCtx.strokeStyle = stroke

		gCtx.fillText(txt, pos.x, pos.y)
		gCtx.strokeText(txt, pos.x, pos.y)
	})
}

function onSetLineTxt(txt) {
	setLineTxt(txt)
	renderMeme()
}

function onChangeColor(type, color) {
	changeColor(type, color)
	renderMeme()
}

function onChangeFontSize(diff) {
	changeFontSize(diff)
	renderMeme()
}

function onChangeFontFamily(font) {
	changeFontFamily(font)
	renderMeme()
	renderGallery()
}

function onChangeLine() {
	const line = changeLine()
	onSetLineTxt(line.txt)
	renderMeme()
}

function onMoveLine(direction) {
	const diff = direction === 'up' ? -5 : 5
	moveLine(diff, 'y')
	renderMeme()
}

function onAddLine() {
	document.querySelector('.tooltiptext').style.visibility = 'hidden'
	const font = document.querySelector('.select-font-family').value
	addLine(font)

	renderMeme()
}

function onRemoveLine() {
	removeLine()
	renderMeme()
}

function onSaveMeme() {
	openModal()
	gIsMemeSave = true

	const meme = gElCanvas.toDataURL()
	saveMeme(meme)

	renderMeme()

	gIsMemeSave = false
}

function openModal() {
	const elModal = document.querySelector('.modal')
	elModal.style.display = 'block'

	setTimeout(() => {
		elModal.style.display = 'none'
	}, 1500)
}

function onDownloadMeme(elLink) {
	const memeContent = gElCanvas.toDataURL()
	elLink.href = memeContent
}

function resizeCanvas() {
	const elContainer = document.querySelector('.canvas-container')
	gElCanvas.width = elContainer.offsetWidth
	gElCanvas.height = elContainer.offsetHeight
}

function onUploadImg() {
	// Gets the image from the canvas
	const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

	function onSuccess(uploadedImgUrl) {
		// Handle some special characters
		const url = encodeURIComponent(uploadedImgUrl)
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
	}

	// Send the image to the server
	doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
	// Pack the image for delivery
	const formData = new FormData()
	formData.append('img', imgDataUrl)

	// Send a post req with the image to the server
	const XHR = new XMLHttpRequest()
	XHR.onreadystatechange = () => {
		// If the request is not done, we have no business here yet, so return
		if (XHR.readyState !== XMLHttpRequest.DONE) return
		// if the response is not ok, show an error
		if (XHR.status !== 200) return console.error('Error uploading image')
		const { responseText: url } = XHR
		// Same as
		// const url = XHR.responseText

		// If the response is ok, call the onSuccess callback function,
		// that will create the link to facebook using the url we got
		console.log('Got back live url:', url)
		onSuccess(url)
	}
	XHR.onerror = (req, ev) => {
		console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
	}
	XHR.open('POST', '//ca-upload.com/here/upload.php')
	XHR.send(formData)
}
