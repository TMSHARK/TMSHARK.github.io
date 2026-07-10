// server.js - Backend para Stripe (Node.js + Express)
const express = require('express');
const stripe = require('stripe')('rk_test_51TrXSKCvQhuLFC7Fyc74BJtzRSD7swtJVVafLcjfADyo5P5Gpt83tsp9jKgsCawLdxFiABtaSojBuG7YPGVx99Cd00SfRlFT0H'); // ← Reemplaza con tu clave privada
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Ruta para crear sesión de pago
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, productName } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://neuroplant.store/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://neuroplant.store/cancel',
            metadata: {
                productName: productName,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
});

// Ruta de éxito (opcional)
app.get('/success', (req, res) => {
    res.send(`
        <h1>¡Pago realizado con éxito!</h1>
        <p>Gracias por tu compra. Te enviaremos el enlace de descarga por WhatsApp.</p>
        <a href="https://neuroplant.store">Volver a la página</a>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});