
import AllJson from './cyches'
import SimpleJson from './xdhycycds'
import ChineseJson from './chinese'
import idiom from './idiom8.json'
import idiom8data from './idiom8data'
const arr = idiom8data.map((j) => {
  const idiom = j.matrix_space.split(',')[0]
  return idiom
})
const ChineseJsonCommom = ChineseJson.filter((i) => i.difficult > 1)
const ChineseUniqueCommom = ChineseJson.filter((i) => {
  return !arr.includes(i.word)
})
/**
 * 
 * @param word 被包含的词语
 * @returns 成语数组
 */
export const getWordContainArr = (word: string) => {
  return ChineseUniqueCommom.filter((i) => i.word.includes(word)).map((j) => j.word)
}

export const getRandomWord = () => {
  // const random = Math.floor(Math.random() * SimpleJson.length)
  // return SimpleJson[random].words
  const random = Math.floor(Math.random() * ChineseJsonCommom.length)
  return ChineseUniqueCommom[random].word
}

export const checkIsHidden = (str: string) => {
  return str[0] === '['
}

export const wordGenerate = (str: string) => {
  if (str[0] === '[') {
    return str[1]
  } else {
    return `[${str}]`
  }
}
export function getQueryString(name: string) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  };
  return null;
}


export const MD5 = async (str: string) => {
  const { createHash } = await import('crypto');
  let md5sum = createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

export interface IWord {
  x: number
  y: number
  word: string
  direction?: number;
  isLock?: boolean
}

interface IIdiom {
  /**
   * 成语 比如 一心一意
   */
  text: string
  /**
   * 0 横向 1竖向
   */
  direction: number
  /**
   * [{ x: 3, y: 4, word:'一‘, isLock:false}]
   */
  words: [IWord]
}

export type Poem = IIdiom[]

export class Info {
  all: {
    /**
     * 包含字的所有成语
     * 第单数个成语横放,第双数个成语竖着放
     * { "一": ["一心一意","一往无前","沆瀣一气"]}
     */
    [prop: string]: string[]
  }
  constructor(word: string) {
    this.all = {
      [word]: this.getAllWords(word)
    }
  }

  /**
   * 
   * 不可用包括：超出边界, 单词和已有成语的所有坐标重合 且重合的字不同
   * @param words  成语 
   * @param _direction  方向
   * @param _word 成语根 
   * @returns boolean 是否可用
   */
  check(words: IWord[], _direction: number, _word: IWord) {
    console.log(words)
    return true
  }

  getAllWords(word: string) {
    return [word]
  }
}