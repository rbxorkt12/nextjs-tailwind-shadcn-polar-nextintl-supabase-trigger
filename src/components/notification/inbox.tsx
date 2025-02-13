'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { Tab } from '@headlessui/react';
import { classNames } from '@/lib/utils';
import { useLocale } from 'next-intl';

type Notification = {
    id: string;
    type: string;
    title: string;
    content: string;
    metadata: any;
    read_at: string | null;
    created_at: string;
};

interface NotificationInboxProps {
    onNotificationRead?: () => void;
}

export default function NotificationInbox({ onNotificationRead }: NotificationInboxProps) {
    const router = useRouter();
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const locale = useLocale();
    const unreadNotifications = notifications.filter(n => !n.read_at);
    const readNotifications = notifications.filter(n => n.read_at);

    useEffect(() => {
        // 초기 알림 데이터 로드
        const loadNotifications = async () => {
            const { data: initialNotifications } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (initialNotifications) {
                setNotifications(initialNotifications);
            }
        };

        loadNotifications();

        // 실시간 구독 설정
        const channel = supabase
            .channel('notification_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setNotifications(prev => [payload.new as Notification, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setNotifications(prev =>
                            prev.map(notification =>
                                notification.id === payload.new.id
                                    ? payload.new as Notification
                                    : notification
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', notificationId);

        onNotificationRead?.();
    };

    const handleNotificationClick = async (notification: Notification) => {
        // 읽음 표시
        if (!notification.read_at) {
            await markAsRead(notification.id);
        }

        // 메타데이터에 따른 라우팅
        if (notification.metadata?.post_id) {
            router.push(`/${locale}/posts/${notification.metadata.post_id}`);
        } else if (notification.metadata?.source_url) {
            window.open(notification.metadata.source_url, '_blank');
        }
    };

    return (
        <div className="w-96 max-h-[32rem] overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadNotifications.length > 0 && (
                    <button
                        onClick={async () => {
                            for (const notification of unreadNotifications) {
                                await markAsRead(notification.id);
                            }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex border-b border-gray-200">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'flex-1 py-2 px-4 text-sm font-medium text-center focus:outline-none',
                                selected
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            )
                        }
                    >
                        Unread ({unreadNotifications.length})
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'flex-1 py-2 px-4 text-sm font-medium text-center focus:outline-none',
                                selected
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            )
                        }
                    >
                        Read ({readNotifications.length})
                    </Tab>
                </Tab.List>

                <Tab.Panels className="overflow-y-auto" style={{ maxHeight: 'calc(32rem - 120px)' }}>
                    <Tab.Panel className="divide-y divide-gray-100">
                        {unreadNotifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No unread notifications
                            </div>
                        ) : (
                            unreadNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                />
                            ))
                        )}
                    </Tab.Panel>

                    <Tab.Panel className="divide-y divide-gray-100">
                        {readNotifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No read notifications
                            </div>
                        ) : (
                            readNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                />
                            ))
                        )}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

// NotificationItem 컴포넌트 분리
function NotificationItem({
    notification,
    onClick
}: {
    notification: Notification;
    onClick: (notification: Notification) => void;
}) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'post_published':
                return {
                    icon: '✅',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            case 'post_failed':
                return {
                    icon: '❌',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800'
                };
            case 'post_scheduled':
                return {
                    icon: '🕒',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            default:
                return {
                    icon: '📢',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    const typeStyle = getTypeStyles(notification.type);

    return (
        <div
            onClick={() => onClick(notification)}
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
            <div className="flex gap-3">
                <div className={`${typeStyle.bgColor} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm">{typeStyle.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                            {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {notification.content}
                    </p>
                    <div className="mt-2 flex gap-2 items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeStyle.bgColor} ${typeStyle.textColor}`}>
                            {notification.type.replace('post_', '').charAt(0).toUpperCase() +
                                notification.type.replace('post_', '').slice(1)}
                        </span>
                        {!notification.read_at && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                New
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}