import {CheckCircle2,Clock3,RefreshCw,XCircle,MinusCircle} from 'lucide-react'
const icons={ACTIVE:CheckCircle2,RENEWED:RefreshCw,PENDING:Clock3,CANCEL_REQUESTED:Clock3,CANCELLED:XCircle,EXPIRED:MinusCircle,QUOTED:Clock3}
export default function StatusBadge({status}){const Icon=icons[status]||Clock3;return <span className={`status-badge status-${status.toLowerCase()}`}><Icon size={15}/>{status.replaceAll('_',' ')}</span>}
