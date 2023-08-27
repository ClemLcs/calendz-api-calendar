import moment from "moment";

// TODO: refactor (clean code)

export default class DateUtils{
  public getMonth (month: string) {
    switch (month.toLowerCase()) {
      case 'janvier':
        return '01'
      case 'février':
        return '02'
      case 'mars':
        return '03'
      case 'avril':
        return '04'
      case 'mai':
        return '05'
      case 'juin':
        return '06'
      case 'juillet':
        return '07'
      case 'aout':
        return '08'
      case 'septembre':
        return '09'
      case 'octobre':
        return '10'
      case 'novembre':
        return '11'
      case 'décembre':
        return '12'
      default:
        throw new Error('Unrecognized month name')
    }
  }

  public getDayFromString (day: string) {
    if (day.toLowerCase().includes('lundi')) {
      return 'lundi'
    } else if (day.toLowerCase().includes('mardi')) {
      return 'mardi'
    } else if (day.toLowerCase().includes('mercredi')) {
      return 'mercredi'
    } else if (day.toLowerCase().includes('jeudi')) {
      return 'jeudi'
    } else if (day.toLowerCase().includes('vendredi')) {
      return 'vendredi'
    } else if (day.toLowerCase().includes('samedi')) {
      return 'samedi'
    } else if (day.toLowerCase().includes('dimanche')) {
      return 'dimanche'
    } else {
      throw new Error('Unknown day')
    }
  }

  public getDayFromInt (day: number) {
    switch (day) {
      case 1:
        return 'Lundi'
      case 2:
        return 'Mardi'
      case 3:
        return 'Mercredi'
      case 4:
        return 'Jeudi'
      case 5:
        return 'Vendredi'
      case 6:
        return 'Samedi'
      case 7:
        return 'Dimanche'
      default:
        throw new Error('Unrecognized day number')
    }
  }

  public getWeekNumber(date: string) {
    // Copy date so don't modify original
    const dateObject: Date = new Date(date)
    const myDate: any = new Date(Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate()))
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    myDate.setUTCDate(myDate.getUTCDate() + 4 - (myDate.getUTCDay() || 7))
    // Get first day of year
    const yearStart: any = new Date(Date.UTC(myDate.getUTCFullYear(), 0, 1))
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((myDate - yearStart) / 86400000) + 1) / 7)

    // Return object with year and week number
    return { year: myDate.getUTCFullYear(), number: weekNo }
  }

  public isValid (_date) {
    const date1 = moment(_date, 'MM-DD-YY').format('MM/DD/YYYY')
    const date2 = new Date(_date)

    const dd = (date2.getDate() < 10) ? '0' + date2.getDate().toString() : date2.getDate().toString()
    let oldMonth = date2.getMonth() + 1

    const yy = date2.getFullYear().toString()
    const mm = (oldMonth < 10) ? '0' + oldMonth.toString() : oldMonth.toString()

    // return true if date is valid
    return date1 === `${mm}/${dd}/${yy}`
  }

  public computeExpireMidnight () {
    const today = new Date()
    const tomorrow = new Date().setDate(today.getDate() + 1)
    const expireDate = new Date(tomorrow).setHours(3, 0, 0)
    const expireIn = Math.abs((new Date(expireDate).getTime() - today.getTime()) / 1000)
    return expireIn
  }

  public computeExpireFriday () {
    const temp = new Date()
    const today = new Date()
    const friday = temp.setDate(today.getDate() + (7 + 5 - today.getDay()) % 7)
    const expireDate = new Date(friday).setHours(4, 0, 0)
    const expireIn = Math.abs((new Date(expireDate).getTime() - today.getTime()) / 1000)
    return expireIn
  }
}
