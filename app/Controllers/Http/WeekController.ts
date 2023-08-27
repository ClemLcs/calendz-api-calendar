import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequireName } from "App/Validators/RequireName";
import DateUtils from "../../../providers/DateUtils";
import moment from "moment";
import InvalidDateException from "App/Exceptions/InvalidDateException";
import Scrapper from "../../../providers/Scrapper";
import ScrappingException from "App/Exceptions/ScrappingException";
import Cache from "../../../providers/Cache";

export default class WeekController {

  /**
   * ==============================================================
   * Get courses of a given week
   * ==============================================================
   */
  public async getByDate(ctx: HttpContextContract){
    /**
     * Validate request body against the schema
     */
    const { firstname, lastname, ignoreCache }  = await ctx.request.validate({
      schema: RequireName,
      messages: {
        'string': '{{ field }} must be a string.',
        'boolean': '{{ field }} must be a boolean.',
        'required': 'You must provide a {{ field }}.'
      }
    })

    // check if date is valid, if yes format it

    const dateUtils = new DateUtils()

    if (!dateUtils.isValid(ctx.params.date)) throw new InvalidDateException("Date with invalid format. Ex: 06-27-23", 400, 'E_DATE_INVALID')
    const date = moment(ctx.params.date, 'MM-DD-YYYY').format('MM/DD/YY')
    const translatedDate = dateUtils.getWeekNumber(date)

    // ---------------------------------------------------
    // Use cache (or at least, try to)

    const cache = new Cache()

    if (!ignoreCache) {
      // Get data from cache
      const data = await cache.getWeek(firstname, lastname, date)
      if (data) {
        const dataObj = JSON.parse(data)
        const scrappedToday = await cache.getIsDailyScrapped(firstname, lastname, date)
        return {dataObj, scrappedToday }
      }
    }

    // ---------------------------------------------------
    // Data not in cache: scrapping

    // start scrapping
    const scrapper = new Scrapper()
    const result = await scrapper.fetchWeek(firstname, lastname, date)
      .catch(() => {
        /* istanbul ignore next */
        throw new ScrappingException("Internal Scrapper Error", 500, "E_Internal_Scrapper_Error")
      })

    // set scrap result in cache
    await cache.setWeek(firstname, lastname, date, result)
    // indicate to not restart scrapping today
    await cache.setIsDailyScrapped(firstname, lastname, date)

    return { result, scrappedToday: true, weekNumber: translatedDate.number }
  }
}
