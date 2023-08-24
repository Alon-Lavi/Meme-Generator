'use strict'

var gElCanvas
var gCtx
var gStartPos
var gIsMemeSave = false

function addListeners() {
	window.addEventListener('resize', () => {
		resizeCanvas()
		renderMeme()
	})
}

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
	gIsMemeSave = true
	renderMeme()

	openModal()
	const meme = gElCanvas.toDataURL()
	saveMeme(meme)
	gIsMemeSave = false
}

function openModal() {
	const elModal = document.querySelector('.modal')
	elModal.style.display = 'block'

	setTimeout(() => {
		elModal.style.display = 'none'
	}, 1500)
}

window.onclick = function (event) {
	const elModal = document.querySelector('.modal')

	if (event.target === elModal) {
		elModal.style.display = 'none'
	}
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

function onShareMeme() {
	const memeDateUrl = gElCanvas.toDataURL()

	function onSuccess(uploadedImgUrl) {
		const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)
	}
	doUploadImg(memeDateUrl, onSuccess)
}
