
import { getRandomWord, getWordContainArr, IWord } from './json/game'
var _ = require('lodash');
const { appendFile } = require('fs')

// const xBlockNum = 10
// const yBlockNum = 10
let wordDic: {
  [prop in string]: string[]
} = {}

let idiomDic: {
  [prop in string]: IWord
} = {}
let matrixRecord: string[] = []

let postionXY = {
  x: [] as number[],
  y: [] as number[]
}

const finalTableData = []

const createData = (xBlockNum: number, yBlockNum: number) => {
  return Array.from({ length: yBlockNum }).map((i) => (
    [
      ...Array.from({ length: xBlockNum }).map(() => '')
    ]
  ))
}
let initData: string[][]
const refreshAmount = 1
let refreshCount = 1
// 如果有了 不发请求

const idiomCount = 8
const xBlockNum = 16
const yBlockNum = 6
initData = createData(xBlockNum, yBlockNum)

const refresh = () => {
  wordDic = {}
  idiomDic = {}
  matrixRecord = []
  postionXY = {
    x: [],
    y: [],
  }
  initData = createData(xBlockNum, yBlockNum)
  const firstIdiom = getRandomWord()
  // console.log('第一个随机的成语是:', firstIdiom)
  const randomY = _.random(-1, 1)
  const randomX = _.random(2, 4)
  const centerX = parseInt((xBlockNum / 2).toString())
  const centerY = parseInt((yBlockNum / 2).toString())
  renderData({
    x: centerX - randomX,
    y: centerY - randomY,
    word: firstIdiom
  }, idiomCount, 0).then((res) => {
  })
}

const renderData = async (idiom: IWord, count: number, direction: number) => {
  postionXY['x'].push(idiom.x)
  postionXY['y'].push(idiom.y)
  if (count > 0) {
    matrixRecord.push(idiom.word)
  }
  if (count < 1) {
    const sort = refreshAmount - refreshCount + 1
    console.log(`生成成功,本次的第${sort}条成语记录为:`, matrixRecord)
    refreshCount--;
    finalTableData.push({
      // name: `第${sort}关`,
      // sort,
      matrix: getEmptyData(initData),
      matrix_space: matrixRecord.toString()
    })
    if (sort < refreshAmount) {
      // 在生成一个
      refresh()
    }
    if (sort === refreshAmount) {
      const path = `./src/json/idiom2.json`;
      try {
        finalTableData.forEach((i) => {
          appendFile(path, JSON.stringify(i, null, 2) + ',', () => {
          })
        });
        console.log('成功存入json');
      } catch (error) {
        console.log('An error has occurred ', error);
      }
      return
    }

    return
  }
  idiomDic[idiom.word] = {
    ...idiom,
    direction
  }
  const randomEmptyIndex = _.random(0, idiom.word.length - 1)
  for (let index = 0; index < idiom.word.length; index++) {
    const element = idiom.word[index];
    wordDic[element] = getWordContainArr(element)
    const { x, y } = idiom
    if (direction === 0) {
      // 在这里把随机的empty给加了
      initData[y][x + index] = index == randomEmptyIndex ? `[${element}]` : element
    } else {
      initData[y + index][x] = index == randomEmptyIndex ? `[${element}]` : element
    }
  }

  for (const key in idiomDic) {
    if (Object.prototype.hasOwnProperty.call(idiomDic, key)) {
      const element = idiomDic[key].word;
      const elementInfo = idiomDic[element]
      for (let index = 0; index < element.length; index++) {
        // 每一个字
        const letter = element[index]
        // 每一个字有多少个成语
        const letterArr = wordDic[letter]

        // 每一个字的坐标
        const letterPosition = {
          x: elementInfo.direction === 0 ? elementInfo.x + index : elementInfo.x,
          y: elementInfo.direction === 0 ? elementInfo.y : elementInfo.y + index,
        }


        if (letterArr) {
          for (let i = 0; i < letterArr.length; i++) {
            const idiom = letterArr[i];
            const { x: nextX, y: nextY } = getIdiomBeginPosition(letter, letterPosition, idiom, 1 - direction)
            if (await checkWordsIsOk(idiom, nextX, nextY, 1 - direction, {
              x: letterPosition.x,
              y: letterPosition.y
            })) {
              // console.log('下一个position：', { nextX, nextY }, letter, letterArr, element, letterPosition, idiom, 1 - direction)
              // console.log('本次渲染的成语是；', idiom, postionXY)
              // 避免一条长龙的成语现象

              renderData({
                x: nextX,
                y: nextY,
                word: idiom
              }, count - 1, 1 - direction).then((res) => {
                if (!res && count - 1 > 0) {
                  // 重新render
                  initData = createData(xBlockNum, yBlockNum)
                  setTimeout(() => {
                    refresh()
                  }, 1000);
                }
              })
              return true
            } else {
            }
          }

        }
      }
    }
  }



  // setData([...initData])
}

const checkWordsIsOk = async (word: string, x: number, y: number, direction: number, ignore: {
  x: number,
  y: number
}) => {
  if (idiomDic[word]) {
    return false
  }

  // 横着渲染 不能和之前渲染过的同一行
  if (direction == 0) {
    if (postionXY['y'].includes(y)) {
      return false
    }
  }

  if (direction == 1) {
    if (postionXY['x'].includes(x)) {
      return false
    }
  }

  if (x < 0 || x > xBlockNum || y < 0 || y > yBlockNum) {
    return false
  }

  // 左右上下
  const moveArr = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  const postions = word.split('').map((i, index) => {
    return {
      letter: i,
      letterX: direction === 0 ? x + index : x,
      letterY: direction === 0 ? y : y + index,
    }
  })



  for (let i = 0; i < postions.length; i++) {
    const { letterX, letterY, letter } = postions[i];
    // 超出边界false
    if (letterX > xBlockNum - 1 || letterY > yBlockNum - 1) {
      // console.log('超出边界', xBlockNum, yBlockNum, letter)
      return false
    }
    // 检测每个字上下左右的字
    for (let index = 0; index < moveArr.length; index++) {
      const [dx, dy] = moveArr[index];
      const tx = letterX + dx
      const ty = letterY + dy
      if ((tx === ignore.x && ty === ignore.y) || (letterX === ignore.x && letterY === ignore.y)) {
        continue
      } else {
        try {
          if (initData[ty] && initData[ty][tx]) {
            return false
          }
        } catch (error) {
          console.log(initData, tx, ty)
        }

      }
    }
  }
  // 检查后来的是否和 之前的成语有所交集 如果没有false，放在最后检查 是为了 数组边界问题
  let exist = false
  for (let i = 0; i < postions.length; i++) {
    // console.log('检查：', initData, postions)
    const { letterX, letterY } = postions[i];
    if (initData[letterY] && initData[letterY][letterX]) {
      exist = true
    }
  }
  if (!exist) {
    return false
  }
  return true
}

const getIdiomBeginPosition = (
  letter: string,
  letterPositon: { x: number, y: number },
  idiom: string, direction: number) => {
  const letterIndex = idiom.split('').findIndex(i => i === letter)
  const { x, y } = letterPositon
  if (direction === 1) {
    return {
      x,
      y: y - letterIndex
    }
  } else {
    return {
      x: x - letterIndex,
      y
    }
  }

}


const submitOne = async (matrix: string[][], id?: string) => {
  return 1
}

const getEmptyData = (data: string[][]) => {
  let randomEmptyCount = _.random(idiomCount + 4, idiomCount + 6)
  const dataCopy = JSON.parse(JSON.stringify(data))
  const postions = []
  // 保证四周节点必须有
  for (let index = 0; index < data.length; index++) {
    const line = data[index]
    for (let i = 0; i < line.length; i++) {
      const word = line[i];
      if (word) {
        const result = checkAround(data, i, index)
        if (randomEmptyCount > 0 && result && word[0] !== '[') {
          randomEmptyCount--;
          dataCopy[index][i] = `[${word}]`
        } else {
          postions.push({ x: i, y: index, word })
        }
        if (word[0] == '[') {
          randomEmptyCount--;
        }
      }
    }
  }
  // 应该是每一个成语里面都应该有一个字 empty
  for (let index = 0; index < randomEmptyCount; index++) {
    const randomIndex = _.random(0, postions.length - 1)
    const { x, y, word } = postions[randomIndex]
    if (word[0] !== '[') {
      dataCopy[y][x] = `[${word}]`
    }
  }
  // 先把
  return dataCopy
}

const checkAround = (data: string[][], letterX: number, letterY: number) => {
  const moveArr = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let result = true
  for (let index = 0; index < moveArr.length; index++) {
    const [dx, dy] = moveArr[index];
    const tx = letterX + dx
    const ty = letterY + dy
    if (!(data[ty] && data[ty][tx])) {
      result = false
      return
    }
  }
  return result
}


refresh()
// cluter.js
// const cluster = require('cluster');
// const os = require('os');
// if (cluster.isMaster) {
//   const cpus = os.cpus().length;
//   console.log('forking for ', cpus, ' CPUS');
//   for (let i = 0; i < cpus; i++) {
//     cluster.fork();
//   }
// } else {
//   const pid = process.pid;
//   console.log(`started process`, pid);
//   refresh()
// }