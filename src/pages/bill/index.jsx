import StartFirebase from '../../components/firebaseConfig'
import { onValue, ref, update } from 'firebase/database';

const db = StartFirebase()
const Bill = () => {
    const handleThanhToan = () => {
        update(ref(db, '-NE0UKLIS4i7uY3mlPAQ'), {
            paymentConfirmation: 1,
        })
    }
    return (
        <button onClick={handleThanhToan}>thanh toán</button>
    )
}

export default Bill