'use strict'

const Redis = use('Redis')
const DateUtils = use('DateUtils')

class Cache {
  /**
   * Retrieve week from cache
   */
  async getWeek (firstname, lastname, date) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const result = await Redis.hget(`u:${firstname}.${lastname}`, [`y:${translatedDate.year}|w:${translatedDate.number}`])
    return JSON.parse(result)
  }

  /**
   * Set week in cache, and make it auto-expire
   */
  async setWeek (firstname, lastname, date, data) {
    const translatedDate = DateUtils.getWeekNumber(date)
    const expireIn = DateUtils.computeExpireMidnight()
    await Redis.hmset(`u:${firstname}.${lastname}`, `y:${translatedDate.year}|w:${translatedDate.number}`, JSON.stringify(data))
    await Redis.expire(`u:${firstname}.${lastname}`, expireIn)
  }

  /**
   * Retrieve day from cache
   */
  async getDay (firstname, lastname, date) {
    const result = await Redis.hget(`u:${firstname}.${lastname}`, [`d:${date}`])
    return JSON.parse(result)
  }

  /**
   * Set day in cache, and make it auto-expire
   */
  async setDay (firstname, lastname, date, data) {
    const expireIn = DateUtils.computeExpireMidnight()
    await Redis.hmset(`u:${firstname}.${lastname}`, `d:${date}`, JSON.stringify(data))
    await Redis.expire(`u:${firstname}.${lastname}`, expireIn)
  }
}

module.exports = Cache
