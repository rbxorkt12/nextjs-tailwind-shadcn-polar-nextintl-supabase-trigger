import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Polar } from "npm:@polar-sh/sdk"

const polar = new Polar({
  accessToken: Deno.env.get('POLAR_PAYMENT')!,
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, email, product_price_id } = await req.json()
    
    // Validate required fields
    if (!user_id || !email || !product_price_id) {
      throw new Error('Missing required fields: user_id, email, and product_price_id are required')
    }

    const frontendUrl = Deno.env.get("FRONTEND_URL")
    
    const checkout = await polar.checkouts.custom.create({
      productPriceId: product_price_id,
      successUrl: `${frontendUrl}/success`,
      metadata: {
        userId: user_id,
      },
      customerEmail: email,
    })

    return new Response(
      JSON.stringify({ url: checkout.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      }
    )
  }
})