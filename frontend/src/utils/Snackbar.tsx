import * as React from 'react'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'

/** スナックバーの表示をカスタマイズ */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

/** GlobalSnackbar コンポーネントに渡す props の型情報 */
type Props = {
  /** スナックバーを表示するか */
  open: boolean

  /** スナックバーに表示するメッセージ */
  message: string

  /** スナックバーの色 (error | warning | info | success) */
  severity?: AlertColor

  /** スナックバーを閉じるべきタイミングで呼び出されます */
  onClose?: () => void
}

/** スナックバーを表示するコンポーネント */
export const GlobalSnackbar: React.FC<Props> = ({
  open, message, severity = 'info', onClose
}) => {
  return (
    <Snackbar open={open} onClose={onClose} autoHideDuration={6000}>
      <Alert severity={severity} sx={{ width: '100%' }}>{message}</Alert>
    </Snackbar>
  )
}

/** SnackbarContext コンテキストオブジェクトの型 */
export type SnackbarContextType = {
    /** Snackbar に表示する文字列。空文字列のときは Snackbar を表示しないことを意味します */
    message: string
  
    /** Snackbar の色 */
    severity: AlertColor // 'error' | 'warning' | 'info' | 'success'
  
    /** Snackbar を表示したいときに呼び出します */
    showSnackbar: (message: string, severity: AlertColor) => void
}
  
/** スナックバーの表示状態を管理するコンテキストオブジェクト */
export const SnackbarContext = React.createContext<SnackbarContextType>({
message: '', // デフォルト値
severity: 'error', // デフォルト値
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
showSnackbar: (_message: string, _severity: AlertColor) => {}, // ダミー関数
})
  
/**
 * SnackbarContext コンテキストオブジェクトを提供するコンポーネント。
 *
 * このコンポーネント以下に配置した子コンポーネントであれば、
 * useSnackbar フック関数を呼び出すことができます。
 */
export const SnackbarContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context: SnackbarContextType = React.useContext(SnackbarContext)
    const [message, setMessage] = React.useState(context.message)
    const [severity, setSeverity] = React.useState(context.severity)
  
    // コンテクストオブジェクトに自分自身の値を変更する関数をセットする
    const newContext: SnackbarContextType = React.useMemo(
      () => ({
        message,
        severity,
        showSnackbar: (message: string, severity: AlertColor) => {
          setMessage(message)
          setSeverity(severity)
        },
      }),
      [message, severity, setMessage, setSeverity]
    )
  
    // スナックバーを閉じるためのハンドラー関数
    const handleClose = React.useCallback(() => {
      setMessage('')
    }, [setMessage])
  
    return (
      <SnackbarContext.Provider value={newContext}>
        {children}
        <GlobalSnackbar
          open={newContext.message !== ''}
          message={newContext.message}
          severity={newContext.severity}
          onClose={handleClose}
        />
      </SnackbarContext.Provider>
    )
}

/** SnackbarContext を簡単に使うためのユーティリティ関数 */
export function useSnackbar(): SnackbarContextType {
    return React.useContext(SnackbarContext)
}