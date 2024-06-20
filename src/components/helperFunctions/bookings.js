import { time } from "../timeList"

export const bookingsFound = (eventDays, index, selectedTime) => {
    let variableToReturn = false
    let date = eventDays?.[index]?.date

    let isTimeAvailableToTime = eventDays?.find((item) => item?.date == date)?.toTime
    let isTimeAvailableFromTime = eventDays?.find((item) => item?.date == date)?.fromTime
    
    selectedTime?.map((item) => {
        if (item.date == date && item?.time?.length > 0 ) {
            variableToReturn = true
        }
      
    })
    
    if(isTimeAvailableFromTime =='00:00' &&  isTimeAvailableToTime== '24:00' )
        {
            console.log("entered")
            variableToReturn = false
        }
    return variableToReturn
}


    export const excludeDates = (selectedTime,datesToBeExcluded) => {
        let datesToExclude = []
        console.log(selectedTime)
        selectedTime?.map((booking)=>{
            // console.log(booking,"Booking")
            if(booking?.time?.length >= 97)
                {
                    datesToExclude?.push(booking?.date)
                }
        })
        datesToExclude = [...new Set(datesToExclude)]
        return datesToExclude
    }



export const nameExists = (name,location) => {
    let returningVariable = true
    let localStorageVariable = JSON.parse(localStorage.getItem('bookings'))
    let existingName = localStorageVariable?.map((item) => ({name:item?.eventName,location:item?.eventLocation}))
    console.log(existingName)
    if (existingName?.find((item)=> (item?.name == name) && (item?.location == location))) {
        returningVariable = false
    }
    else {
        returningVariable = true
    }
    return returningVariable
}


export const getTime = (fromTime, toTime) => {

    let variableToReturn = []
    let valueOfFromTime = time?.find((time) => time?.label == fromTime)?.value
    let valueOfToTime = time?.find((time) => time?.label == toTime)?.value
    variableToReturn = time?.filter((item) => item?.value >= valueOfFromTime && item?.value <= valueOfToTime)
    return variableToReturn
}


export const getSelectedTime = (eventLocation) => {
    let variableToReturn = []
    let localStorageVariable = JSON.parse(localStorage.getItem('bookings'))
    let dataOfSelectedLocation = localStorageVariable?.filter((booking) => booking.eventLocation == eventLocation)?.map((booking) => booking?.eventDays)
    console.log(dataOfSelectedLocation,"selectedLocation")



    //converting labels to time
    dataOfSelectedLocation = dataOfSelectedLocation?.map((booking) => {
        return booking?.map((detail) => {
            return { date: detail?.date, time: getTime(detail?.fromTime, detail?.toTime) }
        })
    })

    //removing redundant dates
    dataOfSelectedLocation = dataOfSelectedLocation?.flat()



    dataOfSelectedLocation?.map((item) => {
        if (variableToReturn?.find((data) => data?.date == item?.date)) {
            let indexVariable = variableToReturn?.findIndex((data) => data?.date == item?.date)
            variableToReturn[indexVariable] = { ...(variableToReturn[indexVariable]), time: [...(variableToReturn[indexVariable])?.time, ...item?.time] }
        }
        else {
            variableToReturn?.push(item)
        }
    })

    console.log(variableToReturn,"&&&&&&7")
    return variableToReturn

}
export const getFullDayData = (eventLocation) => {
    let fullDays = []
    let localStorageVariable = JSON.parse(localStorage.getItem('bookings'))
    let dataOfSelectedLocation = localStorageVariable?.filter((booking) => booking.eventLocation == eventLocation)?.map((booking) => booking?.eventDays)




    //converting labels to time
    dataOfSelectedLocation = dataOfSelectedLocation?.map((booking) => {
        return booking?.map((detail) => {
            return { date: detail?.date, time: getTime(detail?.fromTime, detail?.toTime) }
        })
    })

    //Getting Dates to be Excluded
    dataOfSelectedLocation = dataOfSelectedLocation?.flat()
    dataOfSelectedLocation?.map((day) => {
        if (day?.time?.length === 97) {
            fullDays?.push({ date: day?.date, fullDay: true })
        }
        else {
            fullDays?.push({ date: day?.date, fullDay: false })
        }
    })
    return fullDays
}



/* export const disableTimeOptions = (selectedTime) =>{
    selectedTime?.map((booking)=>{
        let indexOfTimeOption = time
    })
} */

