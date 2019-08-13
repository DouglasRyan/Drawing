let canvas = document.getElementById('hb')
let hb = canvas.getContext('2d')
// let pen = document.getElementById('pen')
// let eraser = document.getElementById('eraser')
let eraserEnabled = eraser.value
// let size = document.getElementById('size')
let Size = 2
// let colorSelector = document.getElementById('colorSelector')
// let color = document.getElementById('color')
// let download = document.getElementById('download')
// let clear = document.getElementById('clear')
// let pre = document.getElementById('pre')
// let next = document.getElementById('next')
let i = 0
let imgData = []

//设置画布大小为屏幕大小
autoSetCanvasSize()

//监听用户画画动作
listenToUser(canvas)

//交互动作监听（上一步、下一步、画笔、橡皮擦、画笔/橡皮擦大小、常用颜色选择、全部颜色选择、下载、清空）
pre.onclick = (e) => {
    if (i > 0) {
        hb.putImageData(imgData[i - 2], 0, 0);
        i = i - 1
    }
}
next.onclick = (e) => {
    if (i < imgData.length) {
        hb.putImageData(imgData[i], 0, 0);
        i = i + 1
        e.target.classList.add('activeColor')
    }
}
pen.onclick = (e) => {
    eraserEnabled = false
    pen.classList.add('active')
    pen.style.color = color.value
    eraser.classList.remove('active')
}
eraser.onclick = () => {
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}
size.onclick = (e) => {
    Size = e.target.getAttribute("data-value") - 0
    if (e.target.nodeName === "SPAN") {
        let a = e.target.parentNode.children
        for (let i = 0; i < 4; i++) {
            if (a[i].className) {
                a[i].classList.remove("active")
            }
        }
        e.target.classList.add('active')
    }
}
colorSelector.onclick = (e) => {
    color.value = e.target.dataset.colorValue
    pen.style.color = color.value
}
color.onchange = (e) => {
    pen.style.color = e.target.value
}
download.onclick = (e) => {
    let a = document.createElement('a')
    a.href = canvas.toDataURL("image/png")
    a.download = "刚刚画的图"
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    download.classList.add('active')
    eraser.classList.remove('active')
    setTimeout(() => {
        download.classList.remove('active')
        pen.classList.add('active')
    }, 1000);
}
clear.onclick = () => {
    hb.clearRect(0, 0, canvas.width, canvas.height)
    clear.classList.add('active')
    eraser.classList.remove('active')
    pen.classList.remove('active')
    setTimeout(() => {
        clear.classList.remove('active')
    }, 1000);
}

function autoSetCanvasSize() {
    setCanvasSize()
    window.onresize = () => { setCanvasSize() }
    function setCanvasSize() {
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeight
    }
}

function listenToUser(canvas) {
    let width = canvas.width
    let height = canvas.height
    let img = hb.getImageData(0, 0, width, height)
    imgData.push(img)
    i = imgData.length
    pen.style.color = color.value
    let using = false
    let oldPoint = { x: "", y: "" }
    let newPoint = { x: "", y: "" }

    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.ontouchstart = (e) => {
            let x = e.touches[0].clientX
            let y = e.touches[0].clientY
            using = true
            if (eraserEnabled === true) {
                hb.clearRect(x - 5, y - 5, Size * 10, Size * 10)
            } else {
                oldPoint = { "x": x, "y": y }
            }
        }
        canvas.ontouchmove = (e) => {
            e.preventDefault()
            let x = e.touches[0].clientX
            let y = e.touches[0].clientY
            if (!using) {
                return;
            }
            if (eraserEnabled === true) {
                hb.clearRect(x - 5, y - 5, Size * 10, Size * 10)
            } else {
                newPoint = { "x": x, "y": y }
                drawLine(oldPoint.x, oldPoint.y, newPoint.x, newPoint.y)
                oldPoint = newPoint
            }
        }
        canvas.ontouchend = (e) => {
            using = false
            let width = canvas.width
            let height = canvas.height
            const img = hb.getImageData(0, 0, width, height)
            imgData.push(img)
            i = imgData.length
        }
    } else {
        //非触屏设备
        canvas.onmousedown = (e) => {
            using = true
            let x = e.clientX
            let y = e.clientY
            if (eraserEnabled === true) {
                hb.clearRect(x - 5, y - 5, Size * 10, Size * 10)
            } else {
                oldPoint = { "x": x, "y": y }
            }
        }
        canvas.onmousemove = (e) => {
            let x = e.clientX
            let y = e.clientY
            if (!using) {
                return;
            }
            if (eraserEnabled === true) {
                hb.clearRect(x - 5, y - 5, Size * 10, Size * 10)
            } else {
                newPoint = { "x": x, "y": y }
                drawLine(oldPoint.x, oldPoint.y, newPoint.x, newPoint.y)
                oldPoint = newPoint
            }
        }
        canvas.onmouseup = function (a) {
            using = false
            let width = canvas.width
            let height = canvas.height
            const img = hb.getImageData(0, 0, width, height)
            imgData.push(img)
            i = imgData.length
        }
    }
    function drawLine(x1, y1, x2, y2) {
        hb.lineCap = 'round'
        hb.lineJoin = 'round'
        hb.lineWidth = Size * 3
        hb.strokeStyle = color.value
        hb.beginPath()
        hb.moveTo(x1, y1)
        hb.lineTo(x2, y2)
        hb.stroke()
    }
}
