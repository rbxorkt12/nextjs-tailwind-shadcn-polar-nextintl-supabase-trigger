import { createClient } from 'npm:@supabase/supabase-js'
import { tasks } from "npm:@trigger.dev/sdk@3.0.0/v3";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)


async function logFunctionExecution(payload: any, status: 'success' | 'error', errorMessage?: string, response?: any) {
  try {
    await supabase
      .from('edge_function_logs')
      .insert({
        function_name: 'publish-thread',
        status,
        error_message: errorMessage,
        payload,
        response
      })
  } catch (error) {
    console.error('Failed to log function execution:', error)
  }
}

Deno.serve(async (req) => {
  const startTime = new Date()
  const executionPayload = { startTime: startTime.toISOString() }
  
  try {
    // 현재 시간을 분 단위로 반올림
    const now = new Date()
    now.setSeconds(0, 0)
    

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, thread_account:thread_accounts(*), replies(*)')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now.toISOString())
      .order('scheduled_at')

    if (error) throw error

    if (posts.length === 0) {
      await logFunctionExecution(
        executionPayload,
        'success',
        undefined,
        { status: 'no posts to publish' }
      )
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    // 여러 포스트를 한번에 Trigger.dev로 전송
    await tasks.batchTrigger(
      "publish-thread",
      posts.map(post => ({
        payload: post,
        options: {
          // 각 작업별로 옵션 설정 가능
          idempotencyKey: `publish-${post.id}`,
          // 실패시 최대 3번 재시도
          maxAttempts: 3
        }
      }))
    );

    await logFunctionExecution(
      executionPayload,
      'success',
      undefined,
      { status: 'triggered', postsCount: posts.length }
    )

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    const errorResponse = { 
      success: false, 
      error: error
    }

    await logFunctionExecution(
      executionPayload,
      'error',
      error,
      errorResponse
    )

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}) 