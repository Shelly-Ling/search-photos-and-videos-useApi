// let apiPage = 1

const BASE_URL = "https://pixabay.com/api/"
const API_KEY = "?key=18315640-e8efecb1db04f1eb1ad2f8c60"
const PHOTO_URL = BASE_URL + API_KEY
const VIDEO_URL = BASE_URL + "videos/" + API_KEY
let callApiByPage_url = ''
let search_URL = ""
let carouselPhoto_url = ""
let renderData = []
let nowPage = 1
let totalDataHits = ''
let mode = 'photo'

const searchBtns = document.querySelector('#search-btns')
//輪播屏幕位置
const carouselDataPanel = document.querySelector('.carousel-inner')
//渲染照片或影片位置
const datapanelContainer = document.querySelector('.photo-or-viedo-container')
//搜尋按鈕的文字要抓值
const searchPhotoInput = document.querySelector('#search-photo-input')
const searchVideoInput = document.querySelector('#search-video-input')



//照片資料 結構都一樣 data.hits
//https://pixabay.com/api/?key=18315640-e8efecb1db04f1eb1ad2f8c60

//影片資料
//https://pixabay.com/api/videos/?key=18315640-e8efecb1db04f1eb1ad2f8c60

//搜尋照片方式
//https://pixabay.com/api/?key=18315640-e8efecb1db04f1eb1ad2f8c60&q=yellow+flowers&image_type=photo

//搜影片方式
//https://pixabay.com/api/videos/?key=18315640-e8efecb1db04f1eb1ad2f8c60&q=yellow+flowers&pretty=true




// // 初始影片資料呼叫
// axios.get(VIDEO_URL)
//   .then(function getVideoApiData(response) {

//     let datas = response.data.hits

//     renderVideos(datas)

//   })



//初始照片資料呼叫
axios.get(PHOTO_URL)
  .then(function getPhotoApiData(response) {
    let datas = response.data.hits
    renderPhotos(datas)
    totalDataHits = Number(response.data.totalHits)

    start()
  })

function start() {
  carouselRandomPicture()
  renderPaginator(totalDataHits)

}

//隨機顯示大屏幕輪播圖片，資料最多給500筆，一頁顯示20筆，所以找隨機數1~25之間
function carouselRandomPicture() {
  const randomPageNumber = Math.floor(Math.random() * 25) + 1
  carouselPhoto_url = PHOTO_URL + '&q=ocean&image_type=photo&page=' + randomPageNumber

  axios.get(carouselPhoto_url)
    .then(function getApiData(response) {
      let datas = response.data.hits
      renderCarouselPhoto(datas)
    })
}


//渲染輪播照片，亂數處理，重新整理網頁會更新，但渲染照片或影片資料不會
function renderCarouselPhoto(datas) {

  let randomIndex = Math.floor(Math.random() * Math.floor(datas.length))

  let rowHtml = `
      <div class="carousel-item active">
        <a href="${datas[randomIndex].largeImageURL}" target="_blank"><img src="${datas[randomIndex].largeImageURL}"
          class="d-block w-100" alt="..."></a>
      </div>
  `

  for (let i = 1; i < 3; i++) {
    randomIndex = Math.floor(Math.random() * Math.floor(datas.length))
    rowHtml += `
      <div class="carousel-item">
        <a href="${datas[randomIndex].largeImageURL}" target="_blank"><img src="${datas[randomIndex].largeImageURL}"
          class="d-block w-100" alt="..."></a>
      </div>
    `
  }
  carouselDataPanel.innerHTML = rowHtml
}



//渲染影片
function renderVideos(datas) {
  let rowHtml = ""

  datas.forEach(data => {

    let id = data.id
    let video = data.videos.tiny.url
    let downloadTimes = data.downloads
    let providerPage = data.pageURL
    let providerName = data.user

    rowHtml += `

     <div class="video-and-info" data-id=${id}>
        <video class="video" width=250px height=auto controls>
          <source
            src="${video}">
        </video>
        <p>Donload times: ${downloadTimes}</p>
        <p>more videos click: </p>
        <u><a href="${providerPage}" target="_blank">${providerName}</a></u>
      </div>
          `
  })

  datapanelContainer.innerHTML = rowHtml
  mode = 'video'
}

//渲染照片
function renderPhotos(datas) {

  let rowHtml = ""

  datas.forEach(data => {
    let id = data.id
    let webFormatPhoto = data.webformatURL
    let largeImagePhoto = data.largeImageURL
    let downloadTimes = data.downloads
    let providerPage = data.pageURL
    let providerName = data.user

    rowHtml += `
              <div class="photo-and-info" data-id=${id}>
                <a href="${largeImagePhoto}"  target="_blank"><img src="${webFormatPhoto}" class="rounded" alt="..."></a>
                 <p>Donload times: ${downloadTimes}</p>
                <p>more photos click: </p>
                <u><a href="${providerPage}" target="_blank">${providerName}</a></u>
              </div>
        `
  })

  datapanelContainer.innerHTML = rowHtml
  mode = 'photo'
}


//搜尋照片或影片監聽
searchBtns.addEventListener('click', function onSearchBtnOnClicked() {

  if (event.target.matches('#search-photo-btn')) {
    event.preventDefault()
    let keywords = searchPhotoInput.value
    getPhotoUrlByInputValue(keywords)
    searchPhotoInput.value = ""
    mode = 'photo'
  } else if (event.target.matches('#search-video-btn')) {
    event.preventDefault()
    let keywords = searchVideoInput.value
    getVideoUrlByInputValue(keywords)
    searchVideoInput.value = ""
    mode = 'video'
  }
})


// 判斷照片欄搜尋內容，加入到網址，請求API新資料
function getPhotoUrlByInputValue(keywords) {

  if (keywords.trim() === "") {
    alert("Please enter text.")
    return
  }

  search_URL = PHOTO_URL + '&q=' + keywords + '&image_type=photo'
  getPhotoSearchResult(search_URL)
  mode = 'photo'

}

//渲染照片搜尋結果
function getPhotoSearchResult(url) {

  axios.get(url)
    .then(function getResult(resonse) {
      let totalPageNumber = resonse.data.totalHits
      let datas = resonse.data.hits
      if (!datas.length) {
        alert("No result!")
      }
      renderPhotos(datas)
      renderPaginator(totalPageNumber)
      mode = 'photo'
    })
}

//判斷影片欄搜尋內容，加入到網址，請求API新資料
function getVideoUrlByInputValue(keywords) {

  if (keywords.trim() === "") {
    alert("Please enter text.")
    return
  }

  search_URL = VIDEO_URL + '&q=' + keywords + '&pretty=true'
  getVideoSearchResult(search_URL)

}
//  
function getVideoSearchResult(url) {

  axios.get(url)
    .then(function getResult(resonse) {
      let totalPageNumber = resonse.data.totalHits
      let datas = resonse.data.hits
      if (!datas.length) {
        alert("No result!")
      }
      renderVideos(datas)
      renderPaginator(totalPageNumber)
      mode = 'video'
    })
}

const paginator = document.querySelector('#paginator')

function renderPaginator(dataAmount) {
  let totalPageNumber = Math.ceil(dataAmount / 20)
  let rowHtml = ''

  for (let page = 1; page <= totalPageNumber; page++) {
    rowHtml += `
      <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
`
  }

  paginator.innerHTML = `
  <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    ${rowHtml}
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `
}

paginator.addEventListener('click', function pagenatorOnClicked(page) {
  if (event.target.tagName !== 'A') return

  nowPage = Number(event.target.dataset.page)
  renderDataByClickedPaginator()
})

function renderDataByClickedPaginator(url) {

  if (mode === 'photo') {
    callApiByPage_url = PHOTO_URL + `&page=${nowPage}`

    axios.get(callApiByPage_url)
      .then(function getPhotoApiData(response) {
        let datas = response.data.hits
        renderPhotos(datas)
      })

  } else if (mode === 'video') {
    callApiByPage_url = VIDEO_URL + `&page=${nowPage}`

    axios.get(callApiByPage_url)
      .then(function getPhotoApiData(response) {
        let datas = response.data.hits
        renderVideos(datas)
      })
  }

}

