import React, { useState } from 'react'
// import { load } from 'recaptcha-v3'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useTextInput } from '../Hooks/useTextInput'

import './Contact.css'

axios.defaults.baseURL = 'https://api.ethanlindell.com'

export default function Contact(props) {
  const name = useTextInput('')
  const email = useTextInput('')
  const phone = useTextInput('')
  const message = useTextInput('')

  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit (event) {
    // const recaptcha = await load('6LdMCa4ZAAAAAJssDlAtEy94IXSLAjDfE1LIseFI')
    // const token = await recaptcha.execute('submit')
    // console.log(token)

    setIsLoading(true)
    const form = event.currentTarget
    if (form.checkValidity() === false || name.value === '' || email.value === '' || message.value === '') {
      event.preventDefault()
      event.stopPropagation()
      setErrorMessage('Please fill out Name, Email and Message before submitting.')
    } else {
      const body = {
        name: DOMPurify.sanitize(name.value),
        phone: DOMPurify.sanitize(phone.value),
        email: DOMPurify.sanitize(email.value),
        message: DOMPurify.sanitize(message.value)
      }
      try {
        await axios.post('/contact', body)
        setSuccess(true)
      } catch (err) {
        console.log(err)
        setErrorMessage('Sorry, we had trouble submitting your message, can you please try again?')
      }
    }
    setIsLoading(false)
  }

  return (
     <div className='ContactContainer'>
      {success
        ? <div className='FormContainer'>
            <h2 className='ContactHeader'>Success!</h2>
            <p className='Success'>Your message has been submitted.</p>
          </div>
        : <div className='FormContainer'>
            <h2 className='ContactHeader'>Contact Me</h2>
            <Form>
              <Form.Group className='Input' controlId='formBasicName'>
                <Form.Control 
                  type='text' 
                  placeholder='Jane Doe' 
                  {...name}
                />
                <Form.Text className='text-muted' />
              </Form.Group>
              <Form.Group className='Input' controlId='formBasicEmail'>
                <Form.Control 
                  type='email' 
                  placeholder='Email' 
                  {...email}
                />
                <Form.Text className='text-muted' />
                <small id='emailHelp' className='form-text text-muted Hint'>We'll never share your email with anyone else.</small>
              </Form.Group>
              <Form.Group className='Input' controlId='formBasicPhone'>
                <Form.Control 
                  type='phone' 
                  placeholder='Phone Number (Optional)' 
                  {...phone}
                />
                <Form.Text className='text-muted' />
                <small id='emailHelp' className='form-text text-muted Hint'>We'll never share your phone with anyone else.</small>
              </Form.Group>
              <Form.Group controlId='formBasicPassword'>
                <Form.Control
                  as='textarea' 
                  rows='3'
                  placeholder={'Hi Michael! I\'m interested in getting into the best shape of my life...'}
                  {...message} 
                />
              </Form.Group>
              {errorMessage && (
                <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{errorMessage}</p>
                </Alert>
              )}
              {isLoading
                ? <Spinner animation='grow' /> 
                : <Button onClick={handleSubmit} variant='primary' type='submit' className='Button'>
                    <p className='ButtonText'>Submit</p>
                  </Button>
                }
            </Form>
          </div>
        }
      </div>
  )
}