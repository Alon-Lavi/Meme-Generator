'use strict'

const STORAGE_KEY = 'memeDB'
var gMemes = []
var gCurrLineIdx = 0
var gFilterWord = 'all'

var gMeme = {
	selectedImgId: 0,
	selectedLineIdx: 0,
	lines: [],
}

const gKeywordSearchCountMap = {
	all: 25,
	funny: 15,
	animal: 12,
	happy: 9,
	angry: 12,
	people: 16,
	baby: 11,
	politics: 17,
	crazy: 15,
}

var gImgs = [
	{ id: 1, url: '1.jpg', keywords: ['politics', 'angry', 'people'] },
	{ id: 2, url: '2.jpg', keywords: ['animal', 'happy'] },
	{ id: 3, url: '3.jpg', keywords: ['baby', 'animal'] },
	{ id: 4, url: '4.jpg', keywords: ['animal'] },
	{ id: 5, url: '5.jpg', keywords: ['baby', 'happy', 'funny'] },
	{ id: 6, url: '6.jpg', keywords: ['people', 'crazy'] },
	{ id: 7, url: '7.jpg', keywords: ['funny', 'baby', 'happy'] },
	{ id: 8, url: '8.jpg', keywords: ['funny', 'people', 'crazy'] },
	{ id: 9, url: '9.jpg', keywords: ['funny', 'baby', 'happy'] },
	{ id: 10, url: '10.jpg', keywords: ['politics', 'happy', 'people'] },
	{ id: 11, url: '11.jpg', keywords: ['funny', 'people'] },
	{ id: 12, url: '12.jpg', keywords: ['people', 'crazy', 'sad'] },
	{ id: 13, url: '13.jpg', keywords: ['people', 'happy'] },
	{ id: 14, url: '14.jpg', keywords: ['people', 'crazy', 'angry'] },
	{ id: 15, url: '15.jpg', keywords: ['crazy', 'people'] },
	{ id: 16, url: '16.jpg', keywords: ['funny', 'happy', 'people'] },
	{ id: 17, url: '17.jpg', keywords: ['politics', 'crazy', 'angry'] },
	{ id: 18, url: '18.jpg', keywords: ['funny', 'happy'] },
]

function getMeme() {
	return gMeme
}

function getKeywords() {
	return gKeywordSearchCountMap
}

function getSavedMemes() {
	gMemes = loadFromStorage(STORAGE_KEY)

	if (!gMemes) gMemes = []

	return gMemes
}

function getImg(meme) {
	return gImgs.find(img => img.id === meme.selectedImgId)
}

function getImgs() {
	if (gFilterWord === 'all') return gImgs

	return gImgs.filter(img => img.keywords.includes(gFilterWord))
}

function getLine() {
	return gMeme.lines[gCurrLineIdx]
}

function getLines() {
	return gMeme.lines
}

function setLineTxt(txt) {
	const line = getLine()
	if (!line) return

	line.pos.x = gElCanvas.width / 2
	line.txt = txt
}

function setImg(id, src) {
	if (id === 100) {
		id = makeId()
		gImgs.push({ id, url: src, keywords: ['upload'] })
	}

	gMeme.selectedImgId = id
}

function changeColor(type, color) {
	if (type === 'font') gMeme.lines[gCurrLineIdx].color = color
	else gMeme.lines[gCurrLineIdx].stroke = color
}

function changeFontSize(diff) {
	const line = getLine()
	line.size += diff
}

function changeFontFamily(font) {
	const line = getLine()
	if (!line) return

	line.font = font
}

function moveLine(diff, dir) {
	const line = getLine()
	line.pos[dir] += diff
}

function changeLine() {
	const lines = getLines()

	if (!lines.length) return

	if (gMeme.selectedLineIdx + 1 === lines.length) gMeme.selectedLineIdx = 0
	else gMeme.selectedLineIdx++

	updateLineIdx(gMeme.selectedLineIdx)
	return lines[gCurrLineIdx]
}

function addLine(font) {
	const lines = getLines()
	const numNewLine = lines.length + 1
	const newLine = createLine(font)

	gMeme.lines.push(newLine)
	updateLineIdx(gMeme.lines.length - 1)
}

function removeLine() {
	const lines = getLines()

	if (!lines.length) return

	lines.splice(gCurrLineIdx, 1)
	updateLineIdx(0)
}

function resetCanvas() {
	updateLineIdx(-1)

	gMeme.selectedImgId = -1
	gMeme.lines = []
}

function filterBySearch(word) {
	gFilterWord = word
}

function saveMeme(src) {
	const id = makeId()
	gMemes.push({ id, src })
	saveMemesToStorage()
}

function deleteMeme(id) {
	const memeIdx = gMemes.findIndex(meme => meme.id === id)
	gMemes.splice(memeIdx, 1)

	saveMemesToStorage()
}

function updateLineIdx(idx) {
	gCurrLineIdx = idx
	gMeme.selectedLineIdx = gCurrLineIdx
}

function createLine(font) {
	const newPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }

	return {
		txt: '',
		size: 30,
		align: 'center',
		color: 'white',
		stroke: 'black',
		font,
		pos: { x: newPos.x, y: newPos.y },
	}
}

function doUploadImg(imgDataUrl, onSuccess) {
	const formData = new FormData()
	formData.append('img', imgDataUrl)

	fetch('//ca-upload.com/here/upload.php', {
		method: 'POST',
		body: formData,
	})
		.then(res => res.text())
		.then(url => {
			onSuccess(url)
		})
		.catch(err => {
			console.error(err)
		})
}

function saveMemesToStorage() {
	saveToStorage(STORAGE_KEY, gMemes)
}
