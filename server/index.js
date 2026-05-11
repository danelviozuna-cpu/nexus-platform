require('dotenv').config();

const express = require('express');
const cors = require('cors');

const paypal = require('@paypal/checkout-server-sdk');

const app = express();

app.use(cors());

app.use(express.json());

function environment() {

  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  );

}

const client = new paypal.core.PayPalHttpClient(environment());

app.get('/', (req, res) => {
  res.send('PayPal Backend Running');
});

app.post('/create-order', async (req, res) => {

  try {

    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();

    request.prefer('return=representation');

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    });

    const order = await client.execute(request);

    res.json({
      id: order.result.id,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Something went wrong',
    });

  }

});
app.post('/capture-order', async (req, res) => {

  try {

    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);

    request.requestBody({});

    const capture = await client.execute(request);

    res.json(capture.result);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Capture failed',
    });

  }

});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});