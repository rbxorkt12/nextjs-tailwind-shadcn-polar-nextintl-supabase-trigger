'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationInbox from './inbox';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const bellRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        // 사용자 ID 가져오기
        const getUserId = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user?.id) {
                setUserId(session.session.user.id);
            }
        };
        getUserId();
    }, [supabase]);

    useEffect(() => {
        if (!userId) return;

        console.log(userId)
        const fetchUnreadCount = async () => {
            const { data, error, count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .is('read_at', null);

            if (!error) {
                setUnreadCount(count || 0);
            }
        };

        fetchUnreadCount();

        const channel = supabase
            .channel(`notification_count_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    fetchUnreadCount()
                }
            )
            .subscribe();

        return () => {
            supabase.channel(`notification_count_${userId}`).unsubscribe();
        };
    }, [supabase, userId]);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={bellRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <BellIcon className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 z-50">
                    <NotificationInbox
                        onNotificationRead={() => setUnreadCount(prev => Math.max(0, prev - 1))}
                    />
                </div>
            )}
        </div>
    );
} 