import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  try {
    // 현재 시간에 예약된 포스트들 조회
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, thread_account:thread_accounts(*), replies(*)')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at')
      .limit(10) // 한번에 처리할 최대 개수

    if (error) throw error

    // 각 포스트 처리
    for (const post of posts) {
      try {
        // 포스트 상태를 처리 중으로 업데이트
        const { error: updateError } = await supabase
          .from('posts')
          .update({ status: 'publishing' })
          .eq('id', post.id)
        
        if (updateError) throw updateError

        // 외부 API를 호출하여 포스트 발행
        const response = await fetch(`${Deno.env.get('APP_URL')}/api/posts/${post.id}/publish`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('INTERNAL_API_KEY')}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to publish post: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error)
        // 실패 시 상태 업데이트
        await supabase
          .from('posts')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id)
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: posts.length 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in process-scheduled-posts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})