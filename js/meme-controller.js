'use strict'

function onInit() {
	gElCanvas = document.querySelector('.canvas')
	gCtx = gElCanvas.getContext('2d')

	addListeners()

	renderKeywords()
	renderGallery()
	doTrans()
}

function renderSavedMemes() {
	const memes = getSavedMemes()
	let strHtml

	if (memes.length) {
		strHtml = memes
			.map(meme => {
				return `<div class="img-gallery" data-id="${meme.id}">
                <img src="${meme.src}" onclick="onOpenImgModal('${meme.src}', '${meme.id}')"/>
              </div>`
			})
			.join('')
	} else {
		strHtml = `No Memes available.`
	}

	document.querySelector('.meme-container').innerHTML = strHtml
}

function renderKeywords() {
	const keywords = getKeywords()
	let strHtml = ''

	for (const word in keywords) {
		strHtml += `
    <li class="keyword"><a href="#" "
    onclick="onKeyFilter('${word}')">${word}</a></li>`
	}

	document.querySelector('.keywords-container').innerHTML = strHtml
}

function onSelectImg(id) {
	setImg(id)
	moveToEditPage()
	onAddLine()
	renderMeme()
}

function onOpenPage(page) {
	onToggleMenu()
	resetCanvas()
	hideSections()

	switch (page) {
		case 'gallery':
			openGallery()
			break
		case 'memes':
			openMemes()
			break
	}
}

function openMemes() {
	document.querySelector('.memes-container').classList.remove('none')
	document.querySelector('.main-nav .btn-memes').classList.add('active')

	renderSavedMemes()
}

function onSearch(ev) {
	ev.preventDefault()

	const elSearch = document.querySelector('input[name="search"]')
	filterBySearch(elSearch.value)
	elSearch.value = ''

	renderKeywords()
	renderGallery()
}

function onKeyFilter(word) {
	filterBySearch(word)
	renderKeywords()
	renderGallery()
}

function onToggleMenu() {
	if (window.innerWidth > 820) document.body.classList.remove('menu-open')
	else document.body.classList.toggle('menu-open')

	const elBtnMenu = document.querySelector('.btn-menu')
	elBtnMenu.innerText = document.body.classList.contains('menu-open') ? '✕' : '☰'
}

function onUploadImg(ev) {
	var reader = new FileReader()

	reader.onload = event => {
		var img = new Image()
		img.src = event.target.result
		setImg(100, img.src)
		moveToEditPage()
		onAddLine()
		renderMeme()
	}

	reader.readAsDataURL(ev.target.files[0])
}

function onOpenImgModal(imgSrc, imgId) {
	const strHtml = `<div class="img-modal" data-id="${imgId}" onmouseleave="onLeaveModal(this)">
                      <div class="img-modal-container">
                        <button class="delete-meme" onclick="onDeleteMeme('${imgId}')" data-trans="btn-delete">Delete</button>
                        <a
                        class="btn-download"
                        href="#"
                        onclick="onDownloadImg(this, '${imgSrc}', '${imgId}')"
                        download="meme.jpg">
						<button class="btn" data-trans="btn-download">Download</button></a>
                      </div>
                    </div>`

	const elContainer = document.querySelector(`.img-gallery[data-id="${imgId}"]`)
	elContainer.style.position = 'relative'
	elContainer.innerHTML += strHtml
	doTrans()
}

function onDownloadImg(elLink, src, id) {
	elLink.href = src
	document.querySelector(`.img-modal[data-id="${id}"]`).style.display = 'none'
}

function onLeaveModal(el) {
	el.style.display = 'none'
}

function onDeleteMeme(memeId) {
	deleteMeme(memeId)
	renderSavedMemes()
}

function onSetLang(lang) {
	setLang(lang)

	if (lang === 'he') document.body.classList.add('rtl')
	else document.body.classList.remove('rtl')

	doTrans()
}

function moveToEditPage() {
	document.querySelector('.gallery-container').classList.add('none')
	document.querySelector('.editor-container').classList.remove('none')
}

function hideSections() {
	document.querySelector('.gallery-container').classList.add('none')
	document.querySelector('.editor-container').classList.add('none')
	document.querySelector('.memes-container').classList.add('none')

	document.querySelector('.main-nav .btn-gallery').classList.remove('active')
	document.querySelector('.main-nav .btn-memes').classList.remove('active')
}
