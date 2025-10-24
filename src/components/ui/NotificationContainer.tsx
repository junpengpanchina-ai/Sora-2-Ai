'use client'

import React, { useState, useEffect } from 'react'
import Notification, { NotificationProps, notificationManager } from './Notification'

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications)
    return unsubscribe
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  )
}
