import * as Yup from 'yup';
/* const initialValues = {
  eventName: '',
  eventLocation: '',
  eventDays: [
    { date: '', fromTime: '', toTime: '' }
  ]
} */
export const formSchema = Yup.object().shape({
  eventName: Yup.string().required('Required'),
  eventLocation: Yup.string().required('Required'),
  eventDays: Yup.array().of(
    Yup.object().shape({
      date:Yup.string().required('Required'),
      fromTime:Yup.string().required('Required'), 
      toTime: Yup.string().required('Required')
    })
  )
  });