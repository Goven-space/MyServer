class Mine {
    constructor(trNums, tdNums, mineNums) {
        this.trNums = trNums//行数
        this.tdNums = tdNums//列数
        this.mineNums = mineNums//地雷数
        this.squareArr = [] //二维数组的格式放置每格的属性
        //属性格式
        // {
        //     type: "number"/"mine"
        //     x:
        //     y:
        //     value 
        // }
        this.eleArr = []    //二维数组的格式放置每格的dom元素
        this.overCount = 0

        this.total = trNums * tdNums//格子总数
        this.parent = document.querySelector('.gameBox')
        this.mn = document.querySelector('.mine-nums')
    }
    //创建元素
    createDom() {
        var self = this
        self.parent.innerHTML = ''
        var table = document.createElement('table')
        //初始化地雷数
        this.mn.innerHTML = this.mineNums
        //取消右键打开菜单
        table.oncontextmenu = function () {
            return false
        }
        //开始创建表格
        for (let i = 0; i < this.trNums; i++) {
            var tr = document.createElement('tr')
            this.eleArr[i] = []
            for (let j = 0; j < this.tdNums; j++) {
                var td = document.createElement('td')
                td.pos = [j, i]
                td.onmousedown = function (e) {
                    self.play(e, this)
                }
                this.eleArr[i][j] = td
                tr.appendChild(td)


            }
            table.appendChild(tr)
        }
        
        self.parent.innerHTML = ''//避免重复创建表格
        self.parent.appendChild(table)
    }
    //随机生成地雷位置
    randomNum() {
        var square = new Array(this.total)
        for (let i = 0; i < square.length; i++) {
            square[i] = i
        }
        square.sort(function () {
            return 0.5 - Math.random()
        })
        return square.slice(0, this.mineNums)
    }
    //初始化
    init() {
        this.createDom()
        //初始化已显示格子的数量
        this.overCount = 0
        var mineList = this.randomNum()
        var n = 0
        //以二维数组格式添加表格属性
        for (let i = 0; i < this.trNums; i++) {
            this.squareArr[i] = []
            for (let j = 0; j < this.tdNums; j++) {
                if (mineList.indexOf(n++) != -1) {
                    this.squareArr[i][j] = {
                        type: "mine",
                        x: j,
                        y: i
                    }
                } else {
                    this.squareArr[i][j] = {
                        type: "number",
                        x: j,
                        y: i,
                        value: 0
                    }
                }
            }
        }
        this.updateNum()

    }
    //更新表格中代表周围地雷个数的数字
    updateNum() {
        for (let i = 0; i < this.trNums; i++) {
            for (let j = 0; j < this.tdNums; j++) {
                if (this.squareArr[i][j].type == "mine") {
                    var around = this.around(j, i)
                    for (let k = 0; k < around.length; k++) {
                        var item = this.squareArr[around[k][0]][around[k][1]]
                        if (item.type == "number") {
                            item.value++
                        }
                    }
                }
            }
        }
    }
    //获取点击表格周围9宫格内的表格的位置以行列表示返回
    around(x, y) {
        let aroundArr = []

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i < 0 || i > this.tdNums - 1 || j < 0 || j > this.trNums - 1 || (i == x && j == y)) {
                    continue
                }
                aroundArr.push([j, i])

            }
        }
        return aroundArr
    }

    //游戏运行主方法
    play(env, obj) {
        var cl = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"]
        var self = this
        //显示格子方法
        //1、点击格子为地雷是，游戏失败
        //2、点击格子不是地雷时，分两种情况1.该格子9宫格范围内地雷为0时，将与该格子
        //相连的格子显示，知道其格子9宫格内地雷数不为0为止
        //2.若该格子9宫格内地雷数不为0，则显示该地雷数
        function show(state, ele) {
            if (!state.check) {
                state.check = true
                if (state.value === 0) {
                    self.overCount++
                    ele.classList.add('zero')
                    if(self.overCount == self.total-self.mineNums){
                        self.over(true)
                    }
                    var around = self.around(state.x, state.y)
                    for (var value of around) {
                        if (!self.eleArr[value[0]][value[1]].classList.contains('flag')) {
                            show(self.squareArr[value[0]][value[1]], self.eleArr[value[0]][value[1]])
                        }

                    }
                } else {
                    self.overCount++
                    ele.classList.add(cl[state.value])
                    ele.innerHTML = state.value
                    if(self.overCount == self.total-self.mineNums){
                        self.over(true)
                    }
                }


            }
        }
        var state = this.squareArr[obj.pos[1]][obj.pos[0]]
        // 点击鼠标左键
        if (env.which == 1) {
            var ele = this.eleArr[state.y][state.x]
            if (state.type == "mine") {
                ele.classList.add('bomb')
                this.over()             
            }
            if (!obj.classList.contains('flag')) {
                if (state.type == "number") {
                    show(state, ele)
                }
            }
            //点击鼠标右键
        } else if (env.which == 3) {
            if (!state.check) {
                if (obj.classList.contains('flag')) {
                    this.mineNums++
                    this.mn.innerHTML = this.mineNums
                    obj.classList.remove('flag')
                } else {
                    this.mineNums--
                    this.mn.innerHTML = this.mineNums
                    obj.classList.add('flag')
                }
                if(this.mineNums ==0){
                    this.checkResult()
                }
            }


        }
    }
    //检测所有旗子标记的地方是否为地雷
    checkResult(){
        for (let i = 0; i < this.trNums; i++) {
            for (let j = 0; j < this.tdNums; j++) {
                var square = this.squareArr[i][j]
                if (square.type == "mine") {
                    if(!this.eleArr[i][j].classList.contains('flag')){
                        this.over(false)
                        return
                    }
                    
                }
                
            }
        }
        this.over(true)
    }

    //游戏结束 分为游戏胜利 和游戏失败两种结果
    over(result){
        for (let i = 0; i < this.trNums; i++) {
            for (let j = 0; j < this.tdNums; j++) {
                var square = this.squareArr[i][j]

                if (square.type == "mine") {
                    this.eleArr[i][j].classList.add('mine')
                }
                this.eleArr[i][j].onmousedown = null
            }
        }
        setTimeout(() => {
            if(result){
                alert("恭喜你过关了")
            }else{
                alert("很遗憾你失败了")
            }
        },100)
        
        
    }
}
//顶排按键功能
var mine 
var fir = 0
var btn = document.querySelectorAll('.level-btn')
var arr = [[9,9,10],[16,16,40],[25,25,75]]
for(let i =0 ;i<btn.length;i++){
    if(i<3){
        btn[i].onclick = () => {
            mine = new Mine(...arr[i])
            mine.init()
            btn[fir].classList.remove('active')
            btn[i].classList.add('active')
            fir = i
        }
    }else{
        btn[i].onclick = () => {
            mine.init()
        }
    }
}
btn[0].onclick()


