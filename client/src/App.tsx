import { useState } from 'react'

import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js'

function App() {

  const [amount, setAmount] = useState('100')

  return (

    <PayPalScriptProvider
      options={{
        clientId: 'AQzbVptV7pW5Ez7jrwe7MPuYNUqz7VuzARzE2oWwWS2vCO5Q9nt-P8JdIZmyVQfiE_1dWiMYV6FiDn5F',
      }}
    >

      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          color: 'white',
          padding: '40px',
          fontFamily: 'Arial',
        }}
      >

        <h1>Nexus Financial Platform</h1>

        <div
          style={{
            maxWidth: '400px',
            marginTop: '40px',
          }}
        >

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              marginBottom: '20px',
            }}
          />

          <PayPalButtons

            createOrder={async () => {

              const response = await fetch(
                'http://localhost:5000/create-order',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount,
                  }),
                }
              )

              const data = await response.json()

              return data.id
            }}

            onApprove={async (data) => {

  const response = await fetch(
    'http://localhost:5000/capture-order',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }
  )

  const captureData = await response.json()

  console.log(captureData)

  alert('Payment completed successfully')

}}

          />

        </div>

      </div>

    </PayPalScriptProvider>
  )
}

export default App