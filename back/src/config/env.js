import 'dotenv/config'
export const env={port:Number(process.env.PORT)||4000,frontendUrl:process.env.FRONTEND_URL||'http://localhost:5173',deviceApiKey:process.env.DEVICE_API_KEY||'dev-esp32-key',hfEndpointUrl:process.env.HF_ENDPOINT_URL||'',hfToken:process.env.HF_TOKEN||''}
