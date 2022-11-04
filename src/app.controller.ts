import { HttpService } from '@nestjs/axios'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { g_idiom_level } from '@prisma/client'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'
import { PrismaService } from './prisma.service'
import { MD5 } from './utils/tool'
import ChineseJson from './json/chineseForEmport'

@Controller()
export class AppController {
  count = 0;
  account: number = 8
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) { }

  @Get('hello')
  async getHelloWorld(): Promise<string> {
    return '134'
  }


  @Get('/update-explaination')
  async updateAllExplaination(): Promise<any> {
    const idioms = await this.prismaService.g_idiom_level.findMany()
    idioms.forEach(async (i, index) => {
      // await this.addWords(i.matrix_space, i.id)
      // 从json里取
      await this.addWordsFromJson(i.matrix_space, i.id)
      if (index === idioms.length - 1) {
        console.log('end', this.count)
      }
    })

    return idioms
  }


  @Get('level/:id')
  async getLevel(@Param('id') id: number): Promise<any> {
    return await this.prismaService.g_idiom_level.findUnique({
      where: {
        id: Number(id)
      }
    })
  }
  @Get('levels')
  async getLevels(): Promise<g_idiom_level[]> {
    return await this.prismaService.g_idiom_level.findMany({
      orderBy: [
        {
          level: 'asc'
        },
        {
          sort: 'asc'
        },
      ]
    })
  }


  @Get('insert')
  async addChinese(): Promise<any> {
    const four = ChineseJson.filter((i) => i.word.length === 4)
    four.forEach(async (i, index) => {
      const { explanation, word, pinyin } = i
      if (word.length === 4) {
        console.log(index)
        await this.prismaService.g_idiom_chinese.create({
          data: {
            explanation,
            pinyin,
            word,
          }
        })
      }
    })
    return {
      l: ChineseJson.length,
      four: four.length
    }
  }

  @Get('explaination')
  async getExplaination(@Query('words') words: string, id?: number): Promise<any> {
    const staticSalt = 'gankao666'
    const api = 'https://www.gankao.com/p-aienglish/dict/getDict'
    const { data } = await firstValueFrom(
      this.httpService.post(api, {
        words,
        code: 'cyches',
      }, {
        headers: {
          'Content-Type': 'application/json',
          token: await MD5(words + staticSalt)
        }
      }).pipe(
        catchError((error: AxiosError) => {
          throw `An error happened in api! +${error} + ${words} + id${id}`;
        }),
      ),
    );
    return {
      d: data && data.data[0] && data.data[0].data ? JSON.parse(data.data[0].data) : ''
    }
  }

  async addWordsFromJson(matrix_space: string, id: number): Promise<any> {
    const matrixArr = matrix_space.split(',')
    for (let index = 0; index < matrixArr.length; index++) {
      const i = matrixArr[index];
      const recordFromJsonIndex = ChineseJson.findIndex((j) => j.word === i)
      const { explanation, pinyin } = ChineseJson[recordFromJsonIndex]
      await this.prismaService.g_idiom_words.create({
        data: {
          meaning: explanation,
          pinyin,
          name: i,
          level_id: id
        }
      })
    }
  }

  async addWords(matrix_space: string, id: number): Promise<any> {
    const matrixArr = matrix_space.split(',')
    // if (matrixArr.length === this.account) {
    //   this.count = this.count + this.account
    // } else {
    //   console.log(`id是${id}的关卡数量不对!`)
    // }
    for (let index = 0; index < matrixArr.length; index++) {
      const i = matrixArr[index];
      const { d } = await this.getExplaination(i, id)
      if (d && d.definition && d.definition[0]) {
        const { pinyin, section } = d.definition[0]
        const meaning = section[0]?.sense[0]?.value
        const sameMeaning = section[0]?.sense[0]?.consult?.consultword?.value
        if (pinyin && meaning) {
          await this.prismaService.g_idiom_words.create({
            data: {
              meaning,
              pinyin,
              name: i,
              level_id: id
            }
          })
        }
        if (pinyin && !meaning && sameMeaning) {
          await this.prismaService.g_idiom_words.create({
            data: {
              meaning: `同: "${sameMeaning}"。`,
              pinyin,
              name: i,
              level_id: id,
            }
          })
        }
        if (!pinyin || (!meaning && !sameMeaning)) {
          console.log(`id是${id}的关卡第${index + 1}个${pinyin}--${meaning}:`, i)
        }
        if (!pinyin && !meaning) {
          console.log(`id是${id}的关卡第${index + 1}个既没有拼音，也没有释义:`, i)
        }
        if (!pinyin && !meaning && !sameMeaning) {
          console.log(`id是${id}的关卡第${index + 1}个啥都没有:`, i)
        }
      } else {
        console.log(`id是${id}的关卡第${index + 1}个单词没有返回值:`, i)
      }
    }
    return

  }

  @Post('add')
  async add(@Body() body: g_idiom_level): Promise<g_idiom_level> {
    const { level, name, sort, matrix, id, matrix_space } = body
    if (id) {
      // 先删除再添加
      await this.prismaService.g_idiom_words.deleteMany({
        where: {
          level_id: id
        }
      })
      this.addWords(matrix_space, id)
      const r = await this.prismaService.g_idiom_level.update({
        where: {
          id
        },
        data: {
          level,
          name,
          sort,
          matrix,
          matrix_space
        }
      })
      return r
    } else {
      const record = await this.prismaService.g_idiom_level.create({
        data: {
          level,
          name,
          sort,
          matrix,
          matrix_space
        }
      })
      // this.addWords(matrix_space, record.id)
      return record
    }
  }



}

