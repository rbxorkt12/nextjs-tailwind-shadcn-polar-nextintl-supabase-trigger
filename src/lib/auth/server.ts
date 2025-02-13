import { createClient } from '@/utils/supabase/server'
import { User } from '@supabase/supabase-js'

export async function getUser(): Promise<User | null> {
    const supabase = await createClient()

    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
            console.error('Error fetching user:', error)
            return null
        }

        return user
    } catch (error) {
        console.error('Error in getUser:', error)
        return null
    }
}

export async function getUserId(): Promise<string | null> {
    const user = await getUser()
    return user?.id ?? null
}

// 유저의 세션이 유효한지 확인하는 헬퍼 함수
export async function isAuthenticated(): Promise<boolean> {
    const user = await getUser()
    return user !== null
}

// 유저의 이메일이 확인되었는지 체크하는 헬퍼 함수
export async function isEmailVerified(): Promise<boolean> {
    const user = await getUser()
    return user?.email_confirmed_at != null
} 

