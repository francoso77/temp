export type AlertColorType = 'error' | 'info' | 'success' | 'warning' | 'loading'

import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Loader2,
} from 'lucide-react'

export const iconMap = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  success: CheckCircle,
  loading: Loader2,
}

export const colorMap = {
  warning: 'yellow',
  error: 'red',
  info: 'blue',
  success: 'green',
  loading: 'blue',
}