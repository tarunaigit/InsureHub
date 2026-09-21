import {Toaster} from 'react-hot-toast'

export default function ToastProvider(){
  return <Toaster position="top-right" gutter={10} toastOptions={{
    duration:3200,
    style:{background:'#0f2747',color:'#fff',borderRadius:'14px',padding:'12px 14px',fontSize:'13px',fontWeight:700,boxShadow:'0 16px 38px rgba(13,42,82,.18)'},
    success:{iconTheme:{primary:'#35c69b',secondary:'#fff'}},
    error:{iconTheme:{primary:'#ff7b8d',secondary:'#fff'}}
  }}/>
}
