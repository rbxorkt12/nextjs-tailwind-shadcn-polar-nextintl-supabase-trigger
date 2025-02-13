import { createClient } from '@supabase/supabase-js';
import { task, logger} from "@trigger.dev/sdk/v3";

// 단일 포스트에 대한 타입 정의
interface PostPayload {
  id: string;
  content: string;
  thread_account: {
    access_token: string;
  };
  replies?: Array<{
    content: string;
  }>;
}

export const publishThreadTask = task({
  id: "publish-thread",
  // 이제 payload는 단일 포스트
  run: async (payload: PostPayload, io) => {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
      logger.info("Publishing thread", { postId: payload.id });
      const result = await publishThread(payload);
      
      if (result.success) {
        await supabase
          .from('posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            thread_post_id: result.threadId,
            source_url: result.permalink,
            updated_at: new Date().toISOString()
          })
          .eq('id', payload.id);
        
        logger.info("Successfully published thread", { 
          postId: payload.id,
          threadId: result.threadId 
        });
      } else {
        await supabase
          .from('posts')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
            error_message: result.error
          })
          .eq('id', payload.id);
        
        logger.error("Failed to publish thread", { 
          postId: payload.id,
          error: result.error 
        });
      }
    } catch (error) {
      logger.error("Unexpected error while publishing post", { 
        postId: payload.id, 
        error: error instanceof Error ? error.message : String(error)
      });
      
      await supabase
        .from('posts')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : String(error)
        })
        .eq('id', payload.id);
    }
  }
});

// publishThread 함수는 그대로 유지
async function publishThread(post: PostPayload) {
    try {
        const threadAccount = post.thread_account;
        if (!threadAccount) {
            return { success: false, error: 'Thread account not found' };
        }

        // Step 1: Create the main thread post
        const createResponse = await fetch(
            `https://graph.threads.net/v1.0/me/threads`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${threadAccount.access_token}`
                },
                body: new URLSearchParams({
                    'media_type': 'TEXT',
                    'text': post.content
                })
            }
        );

        const createData = await createResponse.json();
        if (!createData.id) {
            console.error('Failed to create thread container:', {
                response: createData,
                postContent: post.content
            });
            return { success: false, error: `Failed to create thread container: ${JSON.stringify(createData)}` };
        }

        // Step 2: Publish the thread
        const publishResponse = await fetch(
            `https://graph.threads.net/v1.0/me/threads_publish`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${threadAccount.access_token}`
                },
                body: new URLSearchParams({
                    'creation_id': createData.id
                })
            }
        );

        const publishData = await publishResponse.json();
        console.log('Thread publish response:', publishData);
        if (!publishData.id) {
            console.error('Failed to publish thread:', {
                response: publishData,
                creationId: createData.id
            });
            return { success: false, error: `Failed to publish thread: ${JSON.stringify(publishData)}` };
        }

        // Get the thread details to retrieve the permalink
        const threadDetails = await fetch(
            `https://graph.threads.net/v1.0/${publishData.id}?fields=permalink`,
            {
                headers: {
                    'Authorization': `Bearer ${threadAccount.access_token}`
                }
            }
        );

        const threadData = await threadDetails.json();
        console.log('Thread details response:', threadData);

        // Step 3: Process replies if they exist
        if (post.replies && post.replies.length > 0) {
            for (const reply of post.replies) {
                try {
                    // Create reply container
                    const replyCreateResponse = await fetch(
                        `https://graph.threads.net/v1.0/me/threads`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${threadAccount.access_token}`
                            },
                            body: new URLSearchParams({
                                'media_type': 'TEXT',
                                'text': reply.content,
                                'reply_to_id': publishData.id // Reply to the main thread
                            })
                        }
                    );

                    const replyCreateData = await replyCreateResponse.json();
                    if (!replyCreateData.id) {
                        console.error('Failed to create reply container:', {
                            response: replyCreateData,
                            replyContent: reply.content,
                            parentThreadId: publishData.id
                        });
                        continue;
                    }

                    // Publish reply
                    const replyPublishResponse = await fetch(
                        `https://graph.threads.net/v1.0/me/threads_publish`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${threadAccount.access_token}`
                            },
                            body: new URLSearchParams({
                                'creation_id': replyCreateData.id
                            })
                        }
                    );

                    const replyPublishData = await replyPublishResponse.json();
                    console.log('Reply publish response:', replyPublishData);
                } catch (replyError) {
                    console.error('Error publishing reply:', {
                        error: replyError instanceof Error ? replyError.message : String(replyError),
                        replyContent: reply.content,
                        parentThreadId: publishData.id
                    });
                }
            }
        }

        return {
            success: true,
            threadId: publishData.id,
            permalink: threadData.permalink
        };

    } catch (error) {
        console.error('Error in publishThread:', {
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : String(error),
            postId: post.id,
            content: post.content
        });
        return { 
            success: false, 
            error: `Failed to publish thread and replies: ${error instanceof Error ? error.message : String(error)}` 
        };
    }
}