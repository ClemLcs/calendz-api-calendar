import DateUtils from "../DateUtils";
import Redis from "ioredis";
import Env from "@ioc:Adonis/Core/Env";

export default class Cache {
  private dateUtils: DateUtils;
  private redis: Redis;

  constructor() {
    this.dateUtils = new DateUtils();
    this.redis = new Redis({
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    });
  }

  /**
   * Retrieve week from cache
   */
  public async getWeek(firstname: string, lastname: string, date: string) {
    const translatedDate = this.dateUtils.getWeekNumber(date);
    const result = await this.redis.hget(
      `u:${firstname}.${lastname}`, 'y:' + translatedDate.year.toString() + '|w:' + translatedDate.number.toString()
    )
    return result || false
  }

  /**
   * Set week in cache, and make it auto-expire
   */
  public async setWeek(firstname, lastname, date, data) {
    const translatedDate = this.dateUtils.getWeekNumber(date);
    const expireIn = this.dateUtils.computeExpireFriday();

    await this.redis.hmset(
      `u:${firstname}.${lastname}`, `y:${translatedDate.year}|w:${translatedDate.number}`,
      JSON.stringify({ ...data, weekNumber: translatedDate.number })
    );
    await this.redis.expire(`u:${firstname}.${lastname}`, expireIn);
  }

  /*
  |--------------------------------------------------------------------------
  | Background actualization
  |--------------------------------------------------------------------------
  */

  /**
   * Indicate that requested date has already been scrapped today
   */
  public async setIsDailyScrapped(firstname, lastname, date) {
    const translatedDate = this.dateUtils.getWeekNumber(date);
    const expireIn = this.dateUtils.computeExpireMidnight();
    await this.redis.hmset(`u:${firstname}.${lastname}|daily`, `y:${translatedDate.year}|w:${translatedDate.number}`, "true");
    await this.redis.expire(`u:${firstname}.${lastname}|daily`, expireIn);
  }

  /**
   * Check if date has already been scrapped today
   */
  public async getIsDailyScrapped(firstname: string, lastname: string, date: string) {
    const translatedDate = this.dateUtils.getWeekNumber(date);
    const result = await this.redis.hget(
      `u:${firstname}.${lastname}|daily`, 'y:'+ translatedDate.year.toString() + '|w:' + translatedDate.number.toString());
    return result || false;
  }
}
