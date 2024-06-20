import { useFormik } from 'formik'
import React, { useState } from 'react'
import Select from 'react-select';
import locations from '../components/jsonData/locations.json'
import { time } from '../components/timeList';
import { bookingsFound, excludeDates, getSelectedTime, nameExists, getTime, getFullDayData } from '../components/helperFunctions/bookings';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formSchema } from '../components/schema/formSchema';

function HomePage() {

  const initialValues = {
    eventName: '',
    eventLocation: '',
    eventDays: [
      { date: '', fromTime: '', toTime: '' }
    ]
  }

  const [timeOptions, setTimeOptions] = useState([
    // { date: '', start: time, end: time }
  ])

  const [selectedTime, setSelectedTime] = useState([])
  const [datesToBeExcluded, setDatesToBeExcluded] = useState([])
  const [fullDay, setFullDay] = useState([
    { date: '', fullDay: false }
  ])


  const { values, handleChange, handleSubmit, handleReset, setFieldValue, resetForm, errors, touched } = useFormik({
    initialValues,
    validationSchema: formSchema,
    onSubmit: () => {
      if (nameExists(values?.eventName,values?.eventLocation)) {
        let localStorageVariable = JSON.parse(localStorage.getItem('bookings')) || []
        localStorageVariable?.push(values)
        localStorage.setItem('bookings', JSON.stringify(localStorageVariable))
        resetForm()
        setFieldValue('eventDays', [{ date: '', fromTime: '', toTime: '' }])
        setSelectedTime([])
        setDatesToBeExcluded([])
        setFullDay([
          { date: '', fullDay: false }
        ])

      }
      else {
        alert("Choose Different Event Name,Name is already Taken")
      }
    }
  })
  const options = locations?.map((item) => ({ value: item, label: item }))
  const addDays = () => {
    let eventDaysVariable = values?.eventDays
    if (values?.eventDays?.length < 5) {
      eventDaysVariable?.push({ date: '', fromTime: '', toTime: '' })
    }
    setFieldValue('eventDays', eventDaysVariable)
    setFullDay([...fullDay, { date: '', fullDay: false }])
  }

  const handleLocation = (e) => {
    setFieldValue('eventDays', [{ date: '', fromTime: '', toTime: '' }])
    setFieldValue('eventLocation', e.value)

    setSelectedTime(getSelectedTime(e.value))
    let datesToBeExcludedVariable =  []
    getSelectedTime(e.value)?.map((day) => {
      if (day?.time?.length == 97) {
        datesToBeExcludedVariable?.push(day?.date)
      }
    })
    setFullDay(getFullDayData(e.value))
    setDatesToBeExcluded(datesToBeExcludedVariable)

  }


  
  const handleChangeDate = (e, index) => {
    let eventDaysVariable = values?.eventDays
    eventDaysVariable[index].date = e?.toDateString()
    setFieldValue('eventDays', eventDaysVariable)
    let timeOptionsVariable = timeOptions
    let variableForCondition = timeOptionsVariable?.filter((item) => item.date == e?.toDateString())
    let selectedTimeVariable = selectedTime
    if (variableForCondition?.length < 1) {
      timeOptionsVariable[index] = { date: e?.toDateString(), start: time, end: time }

      if (Boolean((selectedTime?.find((time) => time?.date == e?.toDateString()))) == false) {
        selectedTimeVariable[index] = { date: e?.toDateString(), time: [] }
      }
    }
    setTimeOptions(timeOptionsVariable)
    setSelectedTime(selectedTimeVariable)

    let fullDayVariable = fullDay
    fullDayVariable?.push({date: e?.toDateString(),fullDay:false})
    // fullDayVariable[index] = { ...fullDayVariable[index], date: e?.toDateString() }
    setFullDay(fullDayVariable)

    let indexOfTimeOptionsVariable = timeOptions?.findIndex((time) => time?.date == e?.toDateString())
    let indexOfSelectedTime = selectedTime?.findIndex((time) => time?.date == e?.toDateString())
    let valuesOfSelectedTime = selectedTimeVariable?.[indexOfSelectedTime]?.time?.map((item) => item?.value)
    timeOptionsVariable[indexOfTimeOptionsVariable].start = timeOptionsVariable?.[indexOfTimeOptionsVariable]?.start?.map((time) => {
      if (valuesOfSelectedTime?.includes(time?.value)) {
        return { ...time, disable: true }
      }
      else {
        return { ...time, disable: false }
      }
    })
    setTimeOptions(timeOptionsVariable)
  }

  const handleFromTime = (e, index) => {
    let eventDaysVariable = values?.eventDays
    eventDaysVariable[index].fromTime = e?.label
    setFieldValue('eventDays', eventDaysVariable)
    let fromTime = e
    let Date = values?.eventDays?.[index]?.date
    let selectedTimeVariable = selectedTime?.find((item) => item?.date == Date)?.time?.find((item) => item?.value > e?.value)
    let timeOptionsVariable = timeOptions
    let indexOfTimeOptionsVariable = timeOptions?.findIndex((item) => item?.date == Date)
    if (selectedTimeVariable) {
      timeOptionsVariable[indexOfTimeOptionsVariable].end = timeOptionsVariable?.[indexOfTimeOptionsVariable]?.end?.map((time) => {

        if (time?.value > fromTime?.value && time?.value <= selectedTimeVariable?.value) {
          return { ...time, disable: false }
        }
        else {
          return { ...time, disable: true }
        }
      })
    }
    else {
      timeOptionsVariable[indexOfTimeOptionsVariable].end = timeOptionsVariable?.[indexOfTimeOptionsVariable]?.end?.map((time) => {

        if (time?.value > fromTime?.value) {
          return { ...time, disable: false }
        }
        else {
          return { ...time, disable: true }
        }
      })
    }


    setTimeOptions(timeOptionsVariable)

  }

  const handleToTime = (e, index) => {
    let eventDaysVariable = values?.eventDays
    eventDaysVariable[index].toTime = e?.label
    setFieldValue('eventDays', eventDaysVariable)

    let toTime = e
    let fromTime = time?.find((item) => item.label == (values?.eventDays?.[index]?.fromTime))
    let Date = values?.eventDays?.[index]?.date
    let indexOfSelectedTime = selectedTime?.findIndex((time) => time?.date == Date)
    let indexOfTimeOptionsVariable = timeOptions?.findIndex((time) => time?.date == Date)

    //updating Selected Time slot  
    let timeSelected = time?.filter((item) => item?.value >= fromTime?.value && item?.value <= toTime?.value)
    let selectedTimeVariable = selectedTime
    selectedTimeVariable?.[indexOfSelectedTime]?.time?.push(...timeSelected)
    let valuesOfSelectedTime = selectedTimeVariable?.[indexOfSelectedTime]?.time?.map((item) => item?.value)
    setSelectedTime(selectedTimeVariable)

    //disabling selected time 
    let timeOptionsVariable = timeOptions
    timeOptionsVariable[indexOfTimeOptionsVariable].start = timeOptionsVariable?.[indexOfTimeOptionsVariable]?.start?.map((time) => {
      if (valuesOfSelectedTime?.includes(time?.value)) {
        return { ...time, disable: true }
      }
      else {
        return { ...time, disable: false }
      }
    })
    setTimeOptions(timeOptionsVariable)
    setDatesToBeExcluded([excludeDates(selectedTimeVariable,datesToBeExcluded)]?.flat())
  }


  const handleFullDay = (e, index) => {
    let checked = e?.target?.checked
    let fullDayVariable = fullDay
    let eventDaysVariable = values?.eventDays
    if (checked) {
      fullDayVariable[index] = { date: values?.eventDays?.[index]?.date, fullDay: true }
      setFullDay([...fullDayVariable])

      eventDaysVariable[index] = { ...eventDaysVariable?.[index], fromTime: "00:00", toTime: "24:00" }
      setFieldValue('eventDays', eventDaysVariable)

      let selectedTimeVariable = selectedTime
      let date = values?.eventDays?.[index]?.date
      selectedTimeVariable[selectedTimeVariable?.findIndex((item) => item?.date == date)] = { date: date, time: time?.map((item) => item) }
      console.log(selectedTimeVariable, "ss")
      setSelectedTime(selectedTimeVariable)
      setDatesToBeExcluded(excludeDates(selectedTimeVariable,datesToBeExcluded))
    }
    else {
      fullDayVariable[index] = { date: values?.eventDays?.[index]?.date, fullDay: false }
      setFullDay([...fullDayVariable])

      eventDaysVariable[index] = { ...eventDaysVariable?.[index], fromTime: "", toTime: "" }
      setFieldValue('eventDays', eventDaysVariable)

      let timeOptionsVariable = timeOptions
      let date = values?.eventDays?.[index]?.date

      timeOptionsVariable[timeOptionsVariable?.findIndex((item) => item?.date == date)].end = timeOptionsVariable[timeOptionsVariable?.findIndex((item) => item?.date == date)].end?.map((time) => ({ ...time, disable: false }))
      timeOptionsVariable[timeOptionsVariable?.findIndex((item) => item?.date == date)].start = timeOptionsVariable[timeOptionsVariable?.findIndex((item) => item?.date == date)].start?.map((time) => ({ ...time, disable: false }))
      setTimeOptions(timeOptionsVariable)

      let selectedTimeVariable = selectedTime
      selectedTimeVariable[selectedTimeVariable?.findIndex((item) => item?.date == date)] = { date: date, time: [] }
      setSelectedTime(selectedTimeVariable)
      setDatesToBeExcluded(excludeDates(values?.eventDays))
    }

  }
  console.log(fullDay)
  console.log(datesToBeExcluded)
  return (
    <div className='container border mx-auto my-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-8 my-8'>
          <div className='flex gap-4 my-4'>
            <label htmlFor="eventName">Enter Event Name:</label>
            <input
              type="text"
              name="eventName"

              id="eventName"
              value={values?.eventName}
              onChange={handleChange}
              className='border'

            />
            {
              errors?.eventName && touched?.eventDays ?
                <p className='text-red-600'>*</p>
                :
                ''
            }
          </div>

          <div className='flex gap-4 my-4'>
            <label htmlFor="eventLocation">Enter Event Location:</label>
            <Select
              value={{ value: values?.eventLocation, label: values?.eventLocation }}
              onChange={(e) => handleLocation(e)}
              className='w-[12rem]'
              options={options}
            />
            {
              errors?.eventLocation && touched?.eventLocation ?
                <p className='text-red-600'>*</p>
                :
                ''
            }
          </div>

        </div>

        <div>
          {
            values?.eventDays?.map((day, index) => {
              return <div className='flex gap-8 my-4'>
                <DatePicker
                  type="date"
                  placeholder='Date'
                  onChange={(e) => handleChangeDate(e, index)}
                  name={`eventDays[${index}].date`}
                  selected={values?.eventDays?.[index]?.date}
                  disabled={index < values?.eventDays?.length - 1 || values?.eventLocation == ''}
                  excludeDates={datesToBeExcluded?.map(date => new Date(date))}
                  minDate={new Date()}
                  className='border'
                />
                {
                  errors?.eventDays?.[index]?.date && touched?.eventDays?.[index]?.date ?
                    <p className='text-red-600'>*</p>
                    :
                    ''
                }
                <Select
                  placeholder={fullDay?.[index]?.fullDay ? 'Full Day' : 'From Time'}
                  className='w-[12rem]'
                  value={{ label: values?.eventDays?.[index]?.fromTime, value: values?.eventDays?.[index]?.fromTime }}
                  options={timeOptions?.[timeOptions?.findIndex((item) => item?.date == values?.eventDays?.[index]?.date)]?.start}
                  onChange={(e) => handleFromTime(e, index)}
                  isOptionDisabled={(option) => option?.disable}
                  // isDisabled={fullDay?.[index]?.fullDay || ((values?.eventDays?.[index]?.date == '' )? true : false ) || index < values?.eventDays?.length - 1}
                  isDisabled={ fullDay?.[fullDay?.findIndex((item)=>item?.date == values?.eventDays?.[index]?.date)]?.fullDay ||
                     ((values?.eventDays?.[index]?.date == '' )? true : false ) || index < values?.eventDays?.length - 1}
                />
                {
                  errors?.eventDays?.[index]?.fromTime && touched?.eventDays?.[index]?.fromTime ?
                    <p className='text-red-600'>*</p>
                    :
                    ''
                }
                <Select
                  placeholder={fullDay?.[index]?.fullDay ? 'Full Day' : 'To Time'}
                  className='w-[12rem]'
                  value={{ label: values?.eventDays?.[index]?.toTime, value: values?.eventDays?.[index]?.toTime }}
                  options={timeOptions?.[timeOptions?.findIndex((item) => item?.date == values?.eventDays?.[index]?.date)]?.end}
                  onChange={(e) => handleToTime(e, index)}
                  isOptionDisabled={(option) => option?.disable}
                  isDisabled={values?.eventDays?.[index]?.fromTime == '' || fullDay?.[fullDay?.findIndex((item)=>item?.date == values?.eventDays?.[index]?.date)]?.fullDay || index < values?.eventDays?.length - 1}
                />
                {
                  errors?.eventDays?.[index]?.toTime && touched?.eventDays?.[index]?.toTime ?
                    <p className='text-red-600'>*</p>
                    :
                    ''
                }
                <div className='flex gap-2'>
                  <label htmlFor={`fullDay${index}`}>Full Day</label>
                  <input
                    type='checkBox'
                    name={`fullDay${index}`}
                    id={`fullDay${index}`}
                    checked={values?.eventDays?.[index]?.fromTime == '00:00' && values?.eventDays?.[index]?.toTime == '24:00'}
                    className='h-[1.5rem] w-[1.5rem]'
                    onChange={(e) => handleFullDay(e, index)}
                    disabled={values?.eventDays?.[index]?.date == '' ? true : false || index < values?.eventDays?.length - 1 || bookingsFound(values?.eventDays, index, selectedTime)}
                  />
                </div>
              </div>
            })
          }
          <button
            type='button'
            className='border px-8 py-2 my-4'
            onClick={() => { addDays() }}
            disabled={values?.eventDays?.[values?.eventDays?.length - 1]?.toTime == ''}
          >
            +
          </button>
        </div>
        <button type='submit' className='border px-8 py-2 my-4 mx-auto'>
          Submit
        </button>
      </form>


    </div>
  )
}

export default HomePage